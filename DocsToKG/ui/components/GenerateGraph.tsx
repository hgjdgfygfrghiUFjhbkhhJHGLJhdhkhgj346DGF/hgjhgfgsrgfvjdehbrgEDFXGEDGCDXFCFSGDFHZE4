import React, { useState } from "react";
import { 
  Plus, 
  Trash2,
  CheckSquare,
  Zap,
  Upload,
  FileText,
  Folder
} from "lucide-react";
import { useTheme } from "./themes";

const GenerateGraph: React.FC = () => {
  const { themeClasses } = useTheme();
  
  // Tab state for Generate Graph section
  const [activeTab, setActiveTab] = useState<"upload" | "data" | "graphs">("upload");
  
  // Data extraction state
  const [extractTasks, setExtractTasks] = useState({
    metadata: false,
    text: false,
    figures: false,
    tables: false,
    formulas: false
  });
  
  // Figure extraction configuration
  const [scoreThreshold, setScoreThreshold] = useState(0.5);
  const [classificationThreshold, setClassificationThreshold] = useState(0.5);
  const [figureLabels, setFigureLabels] = useState<string[]>([]);
  const [newFigureLabel, setNewFigureLabel] = useState("");
  const [acceptedLabels, setAcceptedLabels] = useState<string[]>([]);
  
  // Graph generation state
  // Lexical graph
  const [separator, setSeparator] = useState("");
  const [chunkSize, setChunkSize] = useState("");
  const [chunkOverlap, setChunkOverlap] = useState("");
  
  // Domain graph
  const [allowedNodes, setAllowedNodes] = useState<string[]>([]);
  const [newNode, setNewNode] = useState("");
  const [allowedRelationships, setAllowedRelationships] = useState<string[]>([]);
  const [newRelationship, setNewRelationship] = useState("");
  const [retryCondition, setRetryCondition] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Upload Files state
  const [uploadType, setUploadType] = useState<"files" | "folder">("files");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file upload functions
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFolder(files);
  };

  const simulateUpload = () => {
    if ((uploadType === "files" && selectedFiles.length === 0) || 
        (uploadType === "folder" && !selectedFolder)) {
      alert(`Please select ${uploadType === "files" ? "files" : "a folder"} to upload.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const totalItems = uploadType === "files" ? selectedFiles.length : (selectedFolder ? selectedFolder.length : 1);
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        
        const itemCount = uploadType === "files" ? selectedFiles.length : (selectedFolder ? selectedFolder.length : 0);
        alert(`Successfully uploaded ${itemCount} ${uploadType === "files" ? 'file(s)' : 'item(s) from folder'}!`);
        
        // Reset selections
        setSelectedFiles([]);
        setSelectedFolder(null);
      }
      setUploadProgress(progress);
    }, 300);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFolderSelection = () => {
    setSelectedFolder(null);
  };

  // Helper component for file icons
  const FileIcon = ({ fileName }: { fileName: string }) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    return (
      <div className={`w-8 h-8 rounded flex items-center justify-center ${themeClasses.bg.card}`}>
        <span className="text-xs font-medium">
          {ext === 'pdf' ? 'PDF' : 
           ext === 'doc' || ext === 'docx' ? 'DOC' : 
           ext === 'txt' ? 'TXT' : 
           'FILE'}
        </span>
      </div>
    );
  };

  // Generate graph handlers
  const handleTaskChange = (task: keyof typeof extractTasks) => {
    setExtractTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const handleAddFigureLabel = () => {
    if (newFigureLabel.trim()) {
      setFigureLabels(prev => [...prev, newFigureLabel.trim()]);
      setNewFigureLabel("");
    }
  };

  const handleDeleteFigureLabel = (index: number) => {
    const labelToDelete = figureLabels[index];
    setFigureLabels(prev => prev.filter((_, i) => i !== index));
    // Also remove from accepted labels if it was selected
    setAcceptedLabels(prev => prev.filter(label => label !== labelToDelete));
  };

  const handleAcceptedLabelToggle = (label: string) => {
    if (acceptedLabels.includes(label)) {
      setAcceptedLabels(prev => prev.filter(l => l !== label));
    } else {
      setAcceptedLabels(prev => [...prev, label]);
    }
  };

  const handleAddNode = () => {
    if (newNode.trim()) {
      setAllowedNodes(prev => [...prev, newNode.trim()]);
      setNewNode("");
    }
  };

  const handleDeleteNode = (index: number) => {
    setAllowedNodes(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRelationship = () => {
    if (newRelationship.trim()) {
      setAllowedRelationships(prev => [...prev, newRelationship.trim()]);
      setNewRelationship("");
    }
  };

  const handleDeleteRelationship = (index: number) => {
    setAllowedRelationships(prev => prev.filter((_, i) => i !== index));
  };

  const handleRun = () => {
    console.log("Running graph generation with settings:", {
      extractTasks,
      figureExtraction: extractTasks.figures ? {
        scoreThreshold,
        classificationThreshold,
        figureLabels,
        acceptedLabels
      } : null,
      lexicalGraph: {
        separator,
        chunkSize,
        chunkOverlap
      },
      domainGraph: {
        allowedNodes,
        allowedRelationships,
        retryCondition,
        additionalInstructions
      }
    });
    alert("Graph generation started!");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab Navigation */}
      <div className={`mb-6 border-b ${themeClasses.border.default}`}>
        <div className="flex">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${themeClasses.tab(activeTab === "upload")}`}
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${themeClasses.tab(activeTab === "data")}`}
          >
            <FileText className="w-4 h-4" />
            Data Extraction
          </button>
          <button
            onClick={() => setActiveTab("graphs")}
            className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${themeClasses.tab(activeTab === "graphs")}`}
          >
            <Zap className="w-4 h-4" />
            Graph Generation
          </button>
        </div>
      </div>

      {/* Upload Files Tab */}
      {activeTab === "upload" && (
        <div className={`rounded-lg border mb-6 ${themeClasses.card}`}>
          <div className="p-6">
            <h2 className={`text-lg font-semibold mb-6 ${themeClasses.text.primary}`}>
              Upload Files or Folder
            </h2>
            
            {/* Upload type selection */}
            <div className="mb-8">
              <label className={`block text-sm font-medium mb-3 ${themeClasses.text.secondary}`}>
                Select upload type
              </label>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="files"
                    name="uploadType"
                    checked={uploadType === "files"}
                    onChange={() => setUploadType("files")}
                    className={`w-4 h-4 ${themeClasses.radio}`}
                  />
                  <label htmlFor="files" className={`text-sm ${themeClasses.text.secondary}`}>
                    Files
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="folder"
                    name="uploadType"
                    checked={uploadType === "folder"}
                    onChange={() => setUploadType("folder")}
                    className={`w-4 h-4 ${themeClasses.radio}`}
                  />
                  <label htmlFor="folder" className={`text-sm ${themeClasses.text.secondary}`}>
                    Folder
                  </label>
                </div>
              </div>
            </div>
            
            {/* Upload fields */}
            <div className="space-y-6">
              {/* Files upload field */}
              {uploadType === "files" ? (
                <div>
                  <label className={`block text-sm font-medium mb-3 ${themeClasses.text.secondary}`}>
                    Select Files
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${themeClasses.fileUpload}`}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                      id="files-upload"
                    />
                    <label htmlFor="files-upload" className="cursor-pointer">
                      <div className={`text-sm ${themeClasses.text.muted}`}>
                        <p className="mb-2">Click to select files or drag and drop</p>
                        <p className="text-xs">Supported formats: PDF, DOC, DOCX, TXT, etc.</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Selected files preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h3 className={`text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                        Selected Files ({selectedFiles.length})
                      </h3>
                      <div className={`max-h-40 overflow-y-auto rounded border ${themeClasses.input}`}>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 border-b last:border-b-0 ${themeClasses.border.default}`}
                          >
                            <div className="flex items-center gap-3">
                              <FileIcon fileName={file.name} />
                              <div>
                                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>
                                  {file.name}
                                </p>
                                <p className={`text-xs ${themeClasses.text.muted}`}>
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className={`p-1 rounded transition-colors ${
                                themeClasses.button.danger.replace('bg-', 'text-').replace('hover:bg-', 'hover:bg-')
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Folder upload field */
                <div>
                  <label className={`block text-sm font-medium mb-3 ${themeClasses.text.secondary}`}>
                    Select Folder
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${themeClasses.fileUpload}`}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFolderChange}
                      className="hidden"
                      id="folder-upload"
                    />
                    <label htmlFor="folder-upload" className="cursor-pointer">
                      <div className={`text-sm ${themeClasses.text.muted}`}>
                        <p className="mb-2">Click to select a folder</p>
                        <p className="text-xs">All files in the folder will be uploaded</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Selected folder preview */}
                  {selectedFolder && selectedFolder.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-sm font-medium ${themeClasses.text.secondary}`}>
                          Selected Folder ({selectedFolder.length} files)
                        </h3>
                        <button
                          onClick={clearFolderSelection}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            themeClasses.button.danger.replace('bg-', 'text-').replace('hover:bg-', 'hover:bg-')
                          }`}
                        >
                          Clear
                        </button>
                      </div>
                      <div className={`text-sm p-3 rounded border ${themeClasses.input} ${themeClasses.text.muted}`}>
                        <p>Folder selected with {selectedFolder.length} files</p>
                        <p className="text-xs mt-1">
                          First file: {selectedFolder[0].name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload progress bar */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>
                      Uploading...
                    </span>
                    <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    themeClasses.slider
                  }`}>
                    <div
                      className="h-full bg-[#4fb3d9] transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                    {uploadType === "files" 
                      ? `Uploading ${selectedFiles.length} file(s)...` 
                      : `Uploading folder contents...`}
                  </p>
                </div>
              )}
              
              {/* Upload button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={simulateUpload}
                  disabled={isUploading || (uploadType === "files" && selectedFiles.length === 0) || 
                           (uploadType === "folder" && !selectedFolder)}
                  className={`px-6 py-3 rounded font-medium transition-colors flex items-center gap-2 ${
                    isUploading || (uploadType === "files" && selectedFiles.length === 0) || 
                    (uploadType === "folder" && !selectedFolder)
                      ? themeClasses.button.secondary + ' cursor-not-allowed'
                      : themeClasses.button.primary
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload {uploadType === "files" ? "Files" : "Folder"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Extraction Tab */}
      {activeTab === "data" && (
        <div className={`rounded-lg border mb-6 ${themeClasses.card}`}>
          <div className={`p-4 border-b ${themeClasses.border.default}`}>
            <h2 className={`text-lg font-semibold ${themeClasses.text.secondary}`}>
              Data extraction
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Select tasks layout */}
            <div className={`p-4 rounded-lg ${themeClasses.bg.card}`}>
              <h3 className={`text-sm font-semibold mb-4 ${themeClasses.text.secondary}`}>
                Select tasks
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskChange('metadata')}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        extractTasks.metadata
                          ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                          : themeClasses.border.default
                      }`}
                    >
                      {extractTasks.metadata && (
                        <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                      )}
                    </button>
                    <label className={`text-sm ${themeClasses.text.secondary}`}>
                      Extract metadata
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskChange('text')}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        extractTasks.text
                          ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                          : themeClasses.border.default
                      }`}
                    >
                      {extractTasks.text && (
                        <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                      )}
                    </button>
                    <label className={`text-sm ${themeClasses.text.secondary}`}>
                      Extract text
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskChange('figures')}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        extractTasks.figures
                          ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                          : themeClasses.border.default
                      }`}
                    >
                      {extractTasks.figures && (
                        <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                      )}
                    </button>
                    <label className={`text-sm ${themeClasses.text.secondary}`}>
                      Extract figures
                    </label>
                  </div>
                </div>
                
                {/* Right column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskChange('tables')}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        extractTasks.tables
                          ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                          : themeClasses.border.default
                      }`}
                    >
                      {extractTasks.tables && (
                        <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                      )}
                    </button>
                    <label className={`text-sm ${themeClasses.text.secondary}`}>
                      Extract tables
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskChange('formulas')}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        extractTasks.formulas
                          ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                          : themeClasses.border.default
                      }`}
                    >
                      {extractTasks.formulas && (
                        <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                      )}
                    </button>
                    <label className={`text-sm ${themeClasses.text.secondary}`}>
                      Extract formulas
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Configure figure extraction - only shown if Extract figures is checked */}
            {extractTasks.figures && (
              <div className={`p-4 rounded-lg ${themeClasses.bg.card}`}>
                <h3 className={`text-sm font-semibold mb-4 ${themeClasses.text.secondary}`}>
                  Configure figure extraction
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                        Score threshold: {scoreThreshold.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={scoreThreshold}
                        onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${themeClasses.slider}`}
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className={themeClasses.text.muted}>0</span>
                        <span className={themeClasses.text.muted}>1</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                        Classification threshold: {classificationThreshold.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={classificationThreshold}
                        onChange={(e) => setClassificationThreshold(parseFloat(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${themeClasses.slider}`}
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className={themeClasses.text.muted}>0</span>
                        <span className={themeClasses.text.muted}>1</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                        Labels
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFigureLabel}
                          onChange={(e) => setNewFigureLabel(e.target.value)}
                          placeholder="Enter label"
                          className={`flex-1 px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                        />
                        <button
                          onClick={handleAddFigureLabel}
                          className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${themeClasses.button.primary}`}
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                      
                      {/* Display labels */}
                      <div className="mt-2 space-y-1">
                        {figureLabels.map((label, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded ${themeClasses.bg.hover}`}
                          >
                            <span className={`text-sm ${themeClasses.text.secondary}`}>
                              {label}
                            </span>
                            <button
                              onClick={() => handleDeleteFigureLabel(index)}
                              className={`p-1 rounded transition-colors ${
                                themeClasses.button.danger.replace('bg-', 'text-').replace('hover:bg-', 'hover:bg-')
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      Accepted labels
                    </label>
                    <div className={`p-3 rounded border min-h-[200px] ${themeClasses.input}`}>
                      {figureLabels.length === 0 ? (
                        <p className={`text-sm text-center ${themeClasses.text.muted}`}>
                          Add labels first to select accepted ones
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {figureLabels.map((label, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <button
                                onClick={() => handleAcceptedLabelToggle(label)}
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  acceptedLabels.includes(label)
                                    ? themeClasses.button.primary.replace('bg-', 'border-').replace('hover:bg-', '')
                                    : themeClasses.border.default
                                }`}
                              >
                                {acceptedLabels.includes(label) && (
                                  <CheckSquare className={`w-3 h-3 ${themeClasses.text.primary}`} />
                                )}
                              </button>
                              <span className={`text-sm ${themeClasses.text.secondary}`}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Graph Generation Tab */}
      {activeTab === "graphs" && (
        <div className={`rounded-lg border mb-6 ${themeClasses.card}`}>
          <div className={`p-4 border-b ${themeClasses.border.default}`}>
            <h2 className={`text-lg font-semibold ${themeClasses.text.secondary}`}>
              Graph generation
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Create lexical graph */}
            <div className={`p-4 rounded-lg ${themeClasses.bg.card}`}>
              <h3 className={`text-sm font-semibold mb-4 ${themeClasses.text.secondary}`}>
                Create lexical graph
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    Separator
                  </label>
                  <input
                    type="text"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    placeholder="e.g., \n\n"
                    className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    Chunk size
                  </label>
                  <input
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(e.target.value)}
                    placeholder="e.g., 1000"
                    className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    Chunk overlap
                  </label>
                  <input
                    type="number"
                    value={chunkOverlap}
                    onChange={(e) => setChunkOverlap(e.target.value)}
                    placeholder="e.g., 200"
                    className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                  />
                </div>
              </div>
            </div>
            
            {/* Create domain graph */}
            <div className={`p-4 rounded-lg ${themeClasses.bg.card}`}>
              <h3 className={`text-sm font-semibold mb-4 ${themeClasses.text.secondary}`}>
                Create domain graph
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Allowed nodes */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      Allowed nodes
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newNode}
                        onChange={(e) => setNewNode(e.target.value)}
                        placeholder="Enter node type"
                        className={`flex-1 px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                      />
                      <button
                        onClick={handleAddNode}
                        className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${themeClasses.button.primary}`}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    
                    {/* Display nodes */}
                    <div className={`p-3 rounded border min-h-[100px] ${themeClasses.input}`}>
                      {allowedNodes.length === 0 ? (
                        <p className={`text-sm text-center ${themeClasses.text.muted}`}>
                          No nodes added yet
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {allowedNodes.map((node, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded ${themeClasses.bg.hover}`}
                            >
                              <span className={`text-sm ${themeClasses.text.secondary}`}>
                                {node}
                              </span>
                              <button
                                onClick={() => handleDeleteNode(index)}
                                className={`p-1 rounded transition-colors ${
                                  themeClasses.button.danger.replace('bg-', 'text-').replace('hover:bg-', 'hover:bg-')
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Allowed relationships */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      Allowed relationships
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newRelationship}
                        onChange={(e) => setNewRelationship(e.target.value)}
                        placeholder="Enter relationship type"
                        className={`flex-1 px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                      />
                      <button
                        onClick={handleAddRelationship}
                        className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${themeClasses.button.primary}`}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    
                    {/* Display relationships */}
                    <div className={`p-3 rounded border min-h-[100px] ${themeClasses.input}`}>
                      {allowedRelationships.length === 0 ? (
                        <p className={`text-sm text-center ${themeClasses.text.muted}`}>
                          No relationships added yet
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {allowedRelationships.map((relationship, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded ${themeClasses.bg.hover}`}
                            >
                              <span className={`text-sm ${themeClasses.text.secondary}`}>
                                {relationship}
                              </span>
                              <button
                                onClick={() => handleDeleteRelationship(index)}
                                className={`p-1 rounded transition-colors ${
                                  themeClasses.button.danger.replace('bg-', 'text-').replace('hover:bg-', 'hover:bg-')
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Retry condition */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    Retry condition
                  </label>
                  <input
                    type="text"
                    value={retryCondition}
                    onChange={(e) => setRetryCondition(e.target.value)}
                    placeholder="e.g., if extraction fails, retry with different parameters"
                    className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                  />
                </div>
                
                {/* Additional instructions */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    Additional instructions
                  </label>
                  <textarea
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Enter any additional instructions for graph generation..."
                    rows={4}
                    className={`w-full px-3 py-2 rounded border outline-none transition-colors ${themeClasses.input}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Run button - only shown in data and graphs tabs */}
      {(activeTab === "data" || activeTab === "graphs") && (
        <div className="flex justify-end">
          <button
            onClick={handleRun}
            className={`px-6 py-3 rounded font-medium transition-colors flex items-center gap-2 ${themeClasses.button.primary}`}
          >
            <Zap className="w-4 h-4" />
            Run
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateGraph;