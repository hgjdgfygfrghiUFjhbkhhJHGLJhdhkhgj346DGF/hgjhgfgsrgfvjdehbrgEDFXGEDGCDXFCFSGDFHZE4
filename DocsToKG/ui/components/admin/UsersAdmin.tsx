"use client";

import React, { useEffect, useState } from "react";

type User = {
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  email: string;
  address: string | null;
  role: 'admin' | 'member' | 'user';
  is_connected: number;
  is_blocked: number;
  created_at: string;
  updated_at: string;
};

type Project = {
  user_id: number;
  project_name: string;
  description: string | null;
  is_favorite: number;
  is_active: number;
  status: string;
  tags: string | null;
  percentage: number;
  created_at: string;
  updated_at: string;
};

type History = {
  user_id: number;
  event: 'login' | 'logout';
  event_time: string;
};

type AdminUserItem = {
  user: User;
  projects: Project[];
  history: History[];
};

const UsersAdmin: React.FC = () => {
  const [items, setItems] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [expandedView, setExpandedView] = useState<"projects" | "history" | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data.users || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (user_id: number, block: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_blocked: block }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (err) {
      console.error("Block/unblock failed", err);
    }
  };

  const deleteUser = async (user_id: number) => {
    if (!confirm("Delete this user and all related data?")) return;
    try {
      const res = await fetch(`/api/admin/users/${user_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleDetail = (user_id: number, view: "projects" | "history") => {
    if (expandedUserId === user_id && expandedView === view) {
      setExpandedUserId(null);
      setExpandedView(null);
      return;
    }
    setExpandedUserId(user_id);
    setExpandedView(view);
  };

  const renderProjects = (projects: Project[]) => {
    if (projects.length === 0) {
      return <div className="text-gray-400">No projects.</div>;
    }
    return (
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-[#2a2a2a]">
            <th className="py-2 pr-4">Project</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Active</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.project_name} className="border-b border-gray-100 dark:border-[#1f1f1f]">
              <td className="py-2 pr-4 font-medium">{p.project_name}</td>
              <td className="py-2 pr-4 text-xs text-gray-500">{p.status}</td>
              <td className="py-2 pr-4 text-xs">{p.is_active ? "Yes" : "No"}</td>
              <td className="py-2 pr-4 text-xs">{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderHistory = (history: History[]) => {
    if (history.length === 0) {
      return <div className="text-gray-400">No history.</div>;
    }
    return (
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-[#2a2a2a]">
            <th className="py-2 pr-4">Event</th>
            <th className="py-2 pr-4">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, idx) => (
            <tr key={`${h.event}-${idx}`} className="border-b border-gray-100 dark:border-[#1f1f1f]">
              <td className="py-2 pr-4 text-xs">{h.event}</td>
              <td className="py-2 pr-4 text-xs">{new Date(h.event_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Total users: {items.length}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-[#2a2a2a]">
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Connected</th>
              <th className="py-2 pr-4">Blocked</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ user, projects, history }) => (
              <React.Fragment key={user.user_id}>
                <tr className="border-b border-gray-100 dark:border-[#1f1f1f]">
                  <td className="py-2 pr-4">
                    {(user.first_name || "") + " " + (user.last_name || "").trim() || "—"}
                  </td>
                  <td className="py-2 pr-4">{user.email}</td>
                  <td className="py-2 pr-4">{user.role}</td>
                  <td className="py-2 pr-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${user.is_connected ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-700 dark:bg-[#2a2a2a] dark:text-gray-300'}`}>
                      <span className={`h-2 w-2 rounded-full ${user.is_connected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {user.is_connected ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{user.is_blocked ? 'Yes' : 'No'}</td>
                  <td className="py-2 pr-4">{new Date(user.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDetail(user.user_id, "projects")}
                        className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => toggleDetail(user.user_id, "history")}
                        className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                      >
                        History
                      </button>
                      <button
                        onClick={() => toggleBlock(user.user_id, user.is_blocked ? false : true)}
                        className={`px-2 py-1 rounded text-xs ${user.is_blocked ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.user_id)}
                        className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700 dark:bg-[#2a2a2a] dark:text-gray-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedUserId === user.user_id && expandedView === "projects" && (
                  <tr className="bg-gray-50 dark:bg-[#0f0f0f]">
                    <td colSpan={7} className="p-4">
                      {renderProjects(projects)}
                    </td>
                  </tr>
                )}
                {expandedUserId === user.user_id && expandedView === "history" && (
                  <tr className="bg-gray-50 dark:bg-[#0f0f0f]">
                    <td colSpan={7} className="p-4">
                      {renderHistory(history)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersAdmin;
