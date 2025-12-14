import React, { useState } from "react";
import { useTheme } from "../themes"; // Changed from getThemeClasses

const ManageConnections: React.FC = () => {
  const { themeClasses } = useTheme(); // Changed this line
  
  const [uri, setUri] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("neo4j");
  const [isAuraDB, setIsAuraDB] = useState(false);
  const [uriError, setUriError] = useState("");

  const validateUri = (value: string) => {
    const uriPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+/;
    if (!value) {
      setUriError("");
      return true;
    }
    if (!uriPattern.test(value)) {
      setUriError("URI must follow the format: protocol://url");
      return false;
    }
    setUriError("");
    return true;
  };

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUri(value);
    validateUri(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== "string") return;

      const lines = content.split("\n");
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed) return;

        if (trimmed.startsWith("NEO4J_URI=")) {
          const value = trimmed.substring("NEO4J_URI=".length);
          setUri(value);
          validateUri(value);
        } else if (trimmed.startsWith("NEO4J_USERNAME=")) {
          setUsername(trimmed.substring("NEO4J_USERNAME=".length));
        } else if (trimmed.startsWith("NEO4J_PASSWORD=")) {
          setPassword(trimmed.substring("NEO4J_PASSWORD=".length));
        } else if (trimmed.startsWith("NEO4J_DATABASE=")) {
          setDatabase(trimmed.substring("NEO4J_DATABASE=".length));
        } else if (trimmed.startsWith("AURA_INSTANCEID=")) {
          setIsAuraDB(true);
        }
      });
    };
    reader.readAsText(file);
  };

  const handleConnect = () => {
    if (!validateUri(uri)) {
      return;
    }
    if (!uri || !username || !password || !database) {
      alert("Please fill in all required fields");
      return;
    }
    console.log("Connecting to Neo4j:", { uri, username, database, isAuraDB });
    alert("Connection initiated!");
  };

  return (
    <div className={`rounded-lg p-8 border w-full max-w-2xl mx-auto ${themeClasses.card}`}>
      <h2 className={`text-lg font-semibold mb-6 text-center ${themeClasses.text.primary}`}>
        Connect to Neo4j
      </h2>
      
      <div className="space-y-4">
        {/* URI Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
            URI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={uri}
            onChange={handleUriChange}
            placeholder="neo4j+s://example.databases.neo4j.io"
            className={`w-full px-3 py-2 rounded border outline-none transition-colors ${
              uriError
                ? 'border-red-500 focus:border-red-600'
                : themeClasses.input
            }`}
          />
          {uriError && (
            <p className="text-red-500 text-xs mt-1">{uriError}</p>
          )}
          <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
            Format: protocol://url (e.g., neo4j+s://, bolt://, neo4j://)
          </p>
        </div>

        {/* Username Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="neo4j"
            className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
          />
        </div>

        {/* Database Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
            Database <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="neo4j"
            className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
          />
        </div>

        {/* AuraDB Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auradb"
            checked={isAuraDB}
            onChange={(e) => setIsAuraDB(e.target.checked)}
            className={`w-4 h-4 rounded ${themeClasses.checkbox}`}
          />
          <label htmlFor="auradb" className={`text-sm ${themeClasses.text.secondary}`}>
            AuraDB Instance
          </label>
        </div>

        {/* File Upload */}
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${themeClasses.fileUpload}`}>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
            id="connection-file"
          />
          <label htmlFor="connection-file" className="cursor-pointer">
            <div className={`text-sm ${themeClasses.text.muted}`}>
              <p className="mb-2">Upload connection file (.txt)</p>
              <p className="text-xs">Click to browse or drag and drop</p>
            </div>
          </label>
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          className={`w-full font-medium py-2 px-4 rounded transition-colors ${themeClasses.button.primary}`}
        >
          Connect to Neo4j
        </button>
      </div>
    </div>
  );
};

export default ManageConnections;