"use client";
import React, { useState } from "react";
import { ThemeProvider } from "./themes";
import Sidebar from "./Sidebar";
import Settings from "./Settings";
import GenerateGraph from "./GenerateGraph";
import Evaluation from "./Evaluation";
import Operations from "./Operations";
import Statistics from "./Statistics";
import ProjectManagement from "./project_management/ProjectManagement";
import TopMenuBar from "./TopMenuBar";

export default function DocsToKG() {
  const [activeTab, setActiveTab] = useState("Projects");
  const [currentProjectName, setCurrentProjectName] = useState("Custom Browser");

  const renderContent = () => {
    switch (activeTab) {
      case "Settings":
        return <Settings />;
      case "Build graph":
        return <GenerateGraph />;
      case "Statistics":
        return <Statistics />;
      case "Evaluation":
        return <Evaluation />;
      case "Operations":
        return <Operations />;
      case "Projects":
        return <ProjectManagement />;
      default:
        return <ProjectManagement />;
    }
  };

  return (
    <ThemeProvider defaultDarkMode={true}>
      <div className="h-screen w-full flex flex-col font-sans">
        {/* Top Menu Bar */}
        <TopMenuBar />

        {/* Main App Layout */}
        <div className="flex-1 flex">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentProjectName={currentProjectName}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="text-xl font-semibold">{activeTab}</div>
          </div>

          {/* Content Area */}
          <div className="p-6 min-h-full">
            {renderContent()}
          </div>
        </div>
        </div>
      </div>
    </ThemeProvider>
  );
}