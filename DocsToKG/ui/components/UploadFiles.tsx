import React, { useState } from "react";
import { 
  Upload,
  Trash2
} from "lucide-react";
import { useTheme } from "./themes";

const UploadFiles: React.FC = () => {
  const { themeClasses } = useTheme();
  
  const [uploadType, setUploadType] = useState<"files" | "folder">("files");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
    
    const iconColors = themeClasses.bg.card.replace('bg-', 'text-').replace('border-', 'bg-');
    
    return (
      <div className={`w-8 h-8 rounded flex items-center justify-center ${iconColors}`}>
        <span className="text-xs font-medium">
          {ext === 'pdf' ? 'PDF' : 
           ext === 'doc' || ext === 'docx' ? 'DOC' : 
           ext === 'txt' ? 'TXT' : 
           'FILE'}
        </span>
      </div>
    );
  };

  return (
    <div className={`rounded-lg border w-full max-w-3xl mx-auto ${themeClasses.card}`}>
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
                  // Note: For folder upload in a real app, you'd need webkitdirectory attribute
                  // but it has limited browser support
                  // webkitdirectory="true"
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
  );
};

export default UploadFiles;