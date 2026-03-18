/**
 * PdfViewer.jsx
 * Renders the PDF using react-pdf with page navigation controls.
 * Exposes page jump via currentPage prop.
 */

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfViewer({
  pdfUrl,
  currentPage,
  pageCount,
  onPageChange,
  theme = 'dark',
}) {
  const [scale, setScale] = useState(1.0);
  const [pageInput, setPageInput] = useState('');
  const isDark = theme === 'dark';

  const handleDocumentLoadSuccess = useCallback(() => {
    // pageCount is managed by parent, but this is a fallback
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) onPageChange(currentPage + 1);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!Number.isNaN(num)) {
      onPageChange(num);
    }
    setPageInput('');
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  if (!pdfUrl) return null;

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 transition-colors duration-300 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200'
        }`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className={`p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={String(currentPage)}
              className={`w-10 text-center text-sm rounded-md py-0.5 font-mono focus:outline-none transition-colors ${
                isDark
                  ? 'bg-black border border-zinc-700 text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/40'
                  : 'bg-stone-50 border border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-400/30'
              }`}
            />
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
              / {pageCount}
            </span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= pageCount}
            className={`p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className={`p-1.5 rounded-lg disabled:opacity-30 transition-all ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetZoom}
            className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-all ${
              isDark
                ? 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5}
            className={`p-1.5 rounded-lg disabled:opacity-30 transition-all ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-auto flex justify-center py-6 transition-colors duration-300 ${
          isDark ? 'bg-[#050505]' : 'bg-stone-100'
        }`}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${
                    isDark ? 'border-zinc-100' : 'border-stone-900'
                  }`}
                />
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                  Loading document...
                </p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-red-500">Failed to load PDF.</p>
            </div>
          }
          className={
            isDark
              ? 'rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.65)]'
              : 'rounded-2xl shadow-[0_30px_90px_rgba(24,24,27,0.10)]'
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div
                className={`w-full aspect-[3/4] shimmer rounded-lg ${isDark ? 'shimmer-dark' : 'shimmer-light'}`}
                style={{ width: 600 * scale, maxWidth: '100%' }}
              />
            }
            className="animate-fade-in"
          />
        </Document>
      </div>
    </div>
  );
}
