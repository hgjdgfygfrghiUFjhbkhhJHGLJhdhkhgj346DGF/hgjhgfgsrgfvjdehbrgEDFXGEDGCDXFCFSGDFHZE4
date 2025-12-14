"use client";
import React, { useState } from "react";
import { useTheme } from "../themes";
import ProjectDashboard from "./ProjectDashboard";
import ProjectList from "./ProjectList";
import NewProjectWizard from "./NewProjectWizard";
import ProjectDetail from "./ProjectDetail";

export type ProjectStatus = "draft" | "processing" | "analyzing" | "completed" | "error";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: ProjectStatus;
  progress: number;
  documentCount: number;
  graphCount: number;
  isStarred: boolean;
  folder?: string;
  tags: string[];
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  error: number;
}

const ProjectManagement: React.FC = () => {
  const { themeClasses } = useTheme();
  const [view, setView] = useState<"dashboard" | "list" | "detail" | "new">("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState("Custom Browser");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Medical Research Papers",
      description: "Analysis of medical research papers on cardiovascular diseases",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      status: "completed",
      progress: 100,
      documentCount: 24,
      graphCount: 5,
      isStarred: true,
      folder: "Medical",
      tags: ["research", "medical", "health"]
    },
    {
      id: "2",
      name: "Legal Documents Analysis",
      description: "Contract analysis and entity extraction from legal documents",
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-19"),
      status: "analyzing",
      progress: 75,
      documentCount: 12,
      graphCount: 3,
      isStarred: false,
      folder: "Legal",
      tags: ["legal", "contracts", "entities"]
    },
    {
      id: "3",
      name: "Academic Papers Corpus",
      description: "Large corpus of academic papers for knowledge graph creation",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      status: "processing",
      progress: 40,
      documentCount: 150,
      graphCount: 0,
      isStarred: true,
      folder: "Academic",
      tags: ["academic", "papers", "research"]
    },
    {
      id: "4",
      name: "Technical Documentation",
      description: "Software documentation analysis for API reference",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-06"),
      status: "error",
      progress: 30,
      documentCount: 8,
      graphCount: 0,
      isStarred: false,
      tags: ["technical", "docs", "api"]
    }
  ]);

  const handleCreateProject = (projectData: { 
    name: string; 
    description: string;
    initializationType: "files" | "folder" | "existing";
    selectedFiles?: File[];
    selectedFolder?: FileList | null;
    selectedProjects?: string[];
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      progress: 0,
      documentCount: projectData.initializationType === "files" 
        ? (projectData.selectedFiles?.length || 0)
        : projectData.initializationType === "folder"
        ? (projectData.selectedFolder?.length || 0)
        : projectData.selectedProjects?.length || 0,
      graphCount: 0,
      isStarred: false,
      tags: []
    };
    
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    setCurrentProjectName(newProject.name);
    setView("detail");
    
    console.log("Project created with data:", projectData);
    alert(`Project "${newProject.name}" created successfully!`);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
    setSelectedProject(updatedProject);
    setCurrentProjectName(updatedProject.name);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setCurrentProjectName("Custom Browser");
      setView("dashboard");
    }
  };

  const handleStarProject = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    ));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
    }
  };

  const handleExportProject = (projectId: string, format: "csv" | "sql") => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      console.log(`Exporting project ${project.name} as ${format}`);
      alert(`Project "${project.name}" exported as ${format.toUpperCase()}`);
    }
  };

  const handleResumeProject = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: "processing", progress: 50 } : p
    ));
    alert("Project processing resumed");
  };

  return (
    <div className={`rounded-lg p-6 ${themeClasses.card}`}>
      {view === "dashboard" && (
        <ProjectDashboard
          projects={projects}
          onViewAll={() => setView("list")}
          onNewProject={() => setView("new")}
          onSelectProject={(project) => {
            setSelectedProject(project);
            setCurrentProjectName(project.name);
            setView("detail");
          }}
          onStarProject={handleStarProject}
        />
      )}

      {view === "list" && (
        <ProjectList
          projects={projects}
          onBack={() => setView("dashboard")}
          onNewProject={() => setView("new")}
          onSelectProject={(project) => {
            setSelectedProject(project);
            setCurrentProjectName(project.name);
            setView("detail");
          }}
          onStarProject={handleStarProject}
          onDeleteProject={handleDeleteProject}
          onExportProject={handleExportProject}
          onResumeProject={handleResumeProject}
        />
      )}

      {view === "new" && (
        <NewProjectWizard
          onBack={() => setView("dashboard")}
          onCreateProject={handleCreateProject}
          existingProjects={projects}
        />
      )}

      {view === "detail" && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onBack={() => {
            setView("dashboard");
            setCurrentProjectName("Custom Browser");
          }}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onExportProject={handleExportProject}
          onResumeProject={handleResumeProject}
          onStarProject={handleStarProject}
        />
      )}
    </div>
  );
};

export default ProjectManagement;