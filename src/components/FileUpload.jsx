import { useRef, useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, currentFile, onReset, theme = 'dark' }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDark = theme === 'dark';

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

  if (currentFile) {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl transition-colors duration-300 ${
          isDark
            ? 'bg-zinc-950 border-zinc-800 shadow-[0_12px_30px_rgba(0,0,0,0.3)]'
            : 'bg-white border-stone-200 shadow-[0_12px_30px_rgba(24,24,27,0.08)]'
        }`}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
            isDark ? 'bg-zinc-100' : 'bg-stone-900'
          }`}
        >
          <FileText size={16} className={isDark ? 'text-black' : 'text-white'} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
            {currentFile.name}
          </p>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
            {(currentFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onReset}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark
              ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
          }`}
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
        w-full h-40 sm:h-48 rounded-2xl border-2 border-dashed cursor-pointer
        transition-all duration-200 group
        ${
          isDark
            ? 'shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
            : 'shadow-[0_24px_60px_rgba(24,24,27,0.08)]'
        }
        ${
          isDragging
            ? isDark
              ? 'border-zinc-100 bg-zinc-900 scale-[1.02]'
              : 'border-stone-900 bg-stone-100 scale-[1.02]'
            : isDark
              ? 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 hover:bg-zinc-900/90'
              : 'border-stone-300 bg-white hover:border-stone-500 hover:bg-stone-50'
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

      <div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
          ${
            isDragging
              ? isDark
                ? 'bg-zinc-100 rotate-3'
                : 'bg-stone-900 rotate-3'
              : isDark
                ? 'bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-100 group-hover:rotate-3'
                : 'bg-stone-100 border border-stone-200 group-hover:bg-stone-900 group-hover:rotate-3'
          }
        `}
      >
        <Upload
          size={24}
          className={
            isDragging
              ? isDark
                ? 'text-black'
                : 'text-white'
              : isDark
                ? 'text-zinc-100 group-hover:text-black'
                : 'text-stone-900 group-hover:text-white'
          }
        />
      </div>

      <div className="px-4 text-center">
        <p className={`text-sm font-medium ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
          {isDragging ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
        </p>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>PDF files only</p>
      </div>
    </div>
  );
}
