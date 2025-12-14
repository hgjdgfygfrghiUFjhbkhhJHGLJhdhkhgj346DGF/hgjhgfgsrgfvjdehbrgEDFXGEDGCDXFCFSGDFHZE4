import React, { useState } from "react";
import { 
  Folder,
  Cpu,
  Network,
  Server,
  Database // Added for Manage Connections
} from "lucide-react";
import Storage from "./settings/Storage";
import LLMGraphRAG from "./settings/LLMGraphRAG";
import GraphProperties from "./settings/GraphProperties";
import APIs from "./settings/APIs";
import ManageConnections from "./settings/ManageConnections"; // Added import
import { getThemeClasses } from "./themes";

const Settings: React.FC = () => {
  const [activeConfigTab, setActiveConfigTab] = useState("Storage");
  
  // Storage state
  const [storagePaths, setStoragePaths] = useState({
    rawDocuments: { path: "", prefix: "raw" },
    metadata: { path: "", prefix: "metadata" },
    text: { path: "", prefix: "text" },
    figures: { path: "", prefix: "figures" },
    formulas: { path: "", prefix: "formulas" },
    tables: { path: "", prefix: "table" },
    hierarchy: { path: "", prefix: "hierarchy" },
    shrinks: { path: "", prefix: "shrink" }
  });
  
  // LLM & GraphRAG state
  const [llmProvider, setLlmProvider] = useState("");
  const [modelName, setModelName] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [embeddingDimensions, setEmbeddingDimensions] = useState("");
  const [similarityMetric, setSimilarityMetric] = useState("");
  
  // Graph properties state
  const [metaLabels, setMetaLabels] = useState({
    lexicalGraph: "",
    domainGraph: "",
    formulasGraph: "",
    tablesGraph: "",
    figuresGraph: ""
  });
  const [hierarchyLevels, setHierarchyLevels] = useState<string[]>([]);
  const [newHierarchyLevel, setNewHierarchyLevel] = useState("");
  
  // APIs state
  const [llmGraphBuilderUrl, setLlmGraphBuilderUrl] = useState("");

  // Updated config tabs to include Manage Connections
  const configTabs = [
    { name: "Storage", icon: Folder },
    { name: "LLM & GraphRAG", icon: Cpu },
    { name: "Graph properties", icon: Network },
    { name: "APIs", icon: Server },
    { name: "Manage Connections", icon: Database }, // Added
  ];

  const themeClasses = getThemeClasses(true); // Get theme classes

  // Storage path handlers
  const handleStoragePathChange = (key: keyof typeof storagePaths, field: 'path' | 'prefix', value: string) => {
    setStoragePaths(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  // Meta labels handlers
  const handleMetaLabelChange = (key: keyof typeof metaLabels, value: string) => {
    setMetaLabels(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Hierarchy levels handlers
  const handleAddHierarchyLevel = () => {
    if (newHierarchyLevel.trim()) {
      setHierarchyLevels(prev => [...prev, newHierarchyLevel.trim()]);
      setNewHierarchyLevel("");
    }
  };

  const handleDeleteHierarchyLevel = (index: number) => {
    setHierarchyLevels(prev => prev.filter((_, i) => i !== index));
  };

  // Render Configurations content
  const renderConfigurations = () => {
    switch (activeConfigTab) {
      case "Storage":
        return (
          <Storage
            storagePaths={storagePaths}
            onStoragePathChange={handleStoragePathChange}
          />
        );

      case "LLM & GraphRAG":
        return (
          <LLMGraphRAG
            llmProvider={llmProvider}
            modelName={modelName}
            embeddingModel={embeddingModel}
            embeddingDimensions={embeddingDimensions}
            similarityMetric={similarityMetric}
            onLlmProviderChange={setLlmProvider}
            onModelNameChange={setModelName}
            onEmbeddingModelChange={setEmbeddingModel}
            onEmbeddingDimensionsChange={setEmbeddingDimensions}
            onSimilarityMetricChange={setSimilarityMetric}
          />
        );

      case "Graph properties":
        return (
          <GraphProperties
            metaLabels={metaLabels}
            hierarchyLevels={hierarchyLevels}
            newHierarchyLevel={newHierarchyLevel}
            onMetaLabelChange={handleMetaLabelChange}
            onHierarchyLevelsChange={setHierarchyLevels}
            onNewHierarchyLevelChange={setNewHierarchyLevel}
            onAddHierarchyLevel={handleAddHierarchyLevel}
            onDeleteHierarchyLevel={handleDeleteHierarchyLevel}
          />
        );

      case "APIs":
        return (
          <APIs
            llmGraphBuilderUrl={llmGraphBuilderUrl}
            onLlmGraphBuilderUrlChange={setLlmGraphBuilderUrl}
          />
        );

      case "Manage Connections":
        return <ManageConnections />; // Added

      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg border w-full max-w-5xl mx-auto ${themeClasses.card}`}>
      {/* Configurations Tabs */}
      <div className={`border-b ${themeClasses.border.default}`}>
        <div className="flex overflow-x-auto">
          {configTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveConfigTab(tab.name)}
                className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${themeClasses.tab(activeConfigTab === tab.name)}`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configurations Content */}
      <div className="p-6">
        {renderConfigurations()}
      </div>
    </div>
  );
};

export default Settings;