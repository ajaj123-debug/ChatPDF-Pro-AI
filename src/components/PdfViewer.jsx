/**
 * PdfViewer.jsx
 * Renders the PDF using react-pdf with page navigation controls.
 * Exposes page jump via currentPage prop.
 */

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfViewer({ pdfUrl, currentPage, pageCount, onPageChange }) {
  const [scale, setScale] = useState(1.0);
  const [pageInput, setPageInput] = useState('');

  const handleDocumentLoadSuccess = useCallback(({ numPages }) => {
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
    if (!isNaN(num)) {
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-paper-100 border-b border-ink-200 flex-shrink-0">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
              className="w-10 text-center text-sm bg-paper-50 border border-ink-200 rounded-md py-0.5 font-mono focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30"
            />
            <span className="text-xs text-ink-400 font-mono">/ {pageCount}</span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= pageCount}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-200 disabled:opacity-30 transition-all"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetZoom}
            className="px-2 py-0.5 text-xs font-mono text-ink-500 hover:text-ink-800 hover:bg-ink-200 rounded-lg transition-all"
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-200 disabled:opacity-30 transition-all"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* PDF Canvas Area */}
      <div className="flex-1 overflow-auto bg-ink-100 flex justify-center py-6">
        <Document
          file={pdfUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-ink-400">Loading document…</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-red-500">Failed to load PDF.</p>
            </div>
          }
          className="shadow-2xl"
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="w-full aspect-[3/4] shimmer rounded-lg" style={{ width: 600 * scale, maxWidth: '100%' }} />
            }
            className="animate-fade-in"
          />
        </Document>
      </div>
    </div>
  );
}
