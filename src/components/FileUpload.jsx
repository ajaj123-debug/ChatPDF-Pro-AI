/**
 * FileUpload.jsx
 * Drag-and-drop / click-to-upload PDF file picker.
 */

import { useRef, useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, currentFile, onReset }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file?.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e) => handleFile(e.target.files?.[0]);

  // If a file is already loaded, show a compact status bar instead
  if (currentFile) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-paper-100 border border-ink-200 rounded-xl">
        <div className="flex items-center justify-center w-8 h-8 bg-accent-500 rounded-lg flex-shrink-0">
          <FileText size={16} className="text-paper-50" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-800 truncate">{currentFile.name}</p>
          <p className="text-xs text-ink-400">
            {(currentFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onReset}
          className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg transition-colors"
          title="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3
        w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer
        transition-all duration-200 group
        ${isDragging
          ? 'border-accent-500 bg-accent-500/10 scale-[1.02]'
          : 'border-ink-300 bg-paper-100 hover:border-accent-400 hover:bg-paper-200'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="sr-only"
      />

      <div className={`
        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
        ${isDragging ? 'bg-accent-500 rotate-3' : 'bg-ink-200 group-hover:bg-accent-400 group-hover:rotate-3'}
      `}>
        <Upload
          size={24}
          className={isDragging ? 'text-paper-50' : 'text-ink-600 group-hover:text-paper-50'}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-ink-700">
          {isDragging ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-xs text-ink-400 mt-0.5">PDF files only</p>
      </div>
    </div>
  );
}
