"use client";

import React, { useEffect, useState } from "react";

const ranges = ["day", "week", "month", "year"] as const;
type Range = typeof ranges[number];

type StatsResponse = {
  online: number;
  offline: number;
  projectsPerUser: { user_id: number; name: string; projects: number }[];
  connectionsLogins: { bucket: string; count: number }[];
  connectionsLogouts: { bucket: string; count: number }[];
  avgSessionMinutes: number;
  range: Range;
};

const AdminStatistics: React.FC = () => {
  const [range, setRange] = useState<Range>("day");
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (selectedRange: Range) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?range=${selectedRange}`, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(range);
  }, [range]);

  const totalUsers = (data?.online || 0) + (data?.offline || 0);
  const maxConnections = Math.max(
    ...(data?.connectionsLogins?.map((c) => c.count) || [0]),
    ...(data?.connectionsLogouts?.map((c) => c.count) || [0])
  );
  const maxProjects = Math.max(...(data?.projectsPerUser?.map((u) => u.projects) || [0]));

  const bar = (value: number, max: number, colorClass: string) => {
    const width = max > 0 ? Math.max(5, (value / max) * 100) : 0;
    return (
      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#1d1d1d] overflow-hidden">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${Math.min(width, 100)}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Admin Statistics</h2>
        <select
          className="rounded border border-gray-200 dark:border-[#2a2a2a] bg-transparent px-3 py-1 text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
        >
          {ranges.map((r) => (
            <option key={r} value={r} className="bg-gray-900 text-white">
              {r}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
          Loading stats...
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {data && !loading && !error && (
        <div className="space-y-6">
          {/* Online vs Offline with bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] space-y-2">
              <div className="text-sm text-gray-500">Online users</div>
              <div className="text-2xl font-semibold">{data.online}</div>
              {bar(data.online, totalUsers, "bg-emerald-500")}
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] space-y-2">
              <div className="text-sm text-gray-500">Offline users</div>
              <div className="text-2xl font-semibold">{data.offline}</div>
              {bar(data.offline, totalUsers, "bg-gray-500")}
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] space-y-2">
              <div className="text-sm text-gray-500">Avg session (min)</div>
              <div className="text-2xl font-semibold">{data.avgSessionMinutes.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Based on login→logout pairs</div>
            </div>
          </div>

          {/* Connections over time with bars (logins vs logouts) */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f]">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Connections by {data.range}</div>
              <div className="text-xs text-gray-500">Logins & logouts (latest buckets)</div>
            </div>
            {(data.connectionsLogins.length === 0 && data.connectionsLogouts.length === 0) ? (
              <div className="text-sm text-gray-500">No data.</div>
            ) : (
              <div className="space-y-3">
                {data.connectionsLogins.map((c) => {
                  const logout = data.connectionsLogouts.find((l) => l.bucket === c.bucket)?.count || 0;
                  return (
                    <div key={c.bucket} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{c.bucket}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-emerald-400">Login {c.count}</span>
                          <span className="text-orange-300">Logout {logout}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bar(c.count, maxConnections, "bg-emerald-500")}
                        {bar(logout, maxConnections, "bg-orange-400")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Projects per user with bars */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f]">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Projects per user</div>
              <div className="text-xs text-gray-500">Sorted by projects desc</div>
            </div>
            {data.projectsPerUser.length === 0 ? (
              <div className="text-sm text-gray-500">No data.</div>
            ) : (
              <div className="space-y-2">
                {data.projectsPerUser.map((u) => (
                  <div key={u.user_id} className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200">{u.name}</span>
                      <span className="font-medium">{u.projects}</span>
                    </div>
                    {bar(u.projects, maxProjects, "bg-blue-500")}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;
