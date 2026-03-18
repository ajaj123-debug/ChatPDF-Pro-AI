import { useEffect, useCallback } from 'react';
import { BookOpen } from 'lucide-react';

import logo from './assets/final_logo.png';

import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
import SummaryPanel from './components/SummaryPanel';
import ChatBox from './components/ChatBox';

import { usePdfProcessor } from './hooks/usePdfProcessor';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    pdfFile,
    pdfUrl,
    pages,
    pageCount,
    currentPage,
    isExtracting,
    extractError,
    loadPdf,
    goToPage,
    getContext,
    getFullText,
    reset: resetPdf,
  } = usePdfProcessor();

  const {
    messages,
    isLoading,
    summary,
    isSummarizing,
    summaryError,
    sendMessage,
    generateSummary,
    clearChat,
  } = useChat();

  // Listen for page-jump events from MessageBubble
  useEffect(() => {
    const handler = (e) => goToPage(e.detail);
    window.addEventListener('pdf-jump-page', handler);
    return () => window.removeEventListener('pdf-jump-page', handler);
  }, [goToPage]);

  const handleFileSelect = useCallback(
    (file) => {
      clearChat();
      loadPdf(file);
    },
    [loadPdf, clearChat]
  );

  const handleReset = useCallback(() => {
    resetPdf();
    clearChat();
  }, [resetPdf, clearChat]);

  const handleAnalyze = useCallback(() => {
    const text = getFullText();
    if (text) generateSummary(text);
  }, [getFullText, generateSummary]);

  const handleSend = useCallback(
    (question) => {
      const context = getContext();
      sendMessage(question, context);
    },
    [getContext, sendMessage]
  );

  const hasPdfLoaded = !!pdfUrl;
  const hasPages = pages.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-paper-300">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-ink-900 border-b border-ink-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-6 h-6" />
          </div>
          <span className="font-display text-lg font-medium text-paper-100 tracking-tight">
            ChatPDF Pro AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isExtracting && (
            <div className="flex items-center gap-2 text-ink-400 text-xs">
              <span className="w-3.5 h-3.5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
              Extracting text…
            </div>
          )}
          {extractError && (
            <p className="text-xs text-red-400">{extractError}</p>
          )}
        </div>
      </header>

      {/* Main content area */}
      <main className="flex flex-1 overflow-hidden">
        {/* ─── LEFT PANEL: PDF Upload + Viewer ─── */}
        <div className="flex flex-col w-1/2 border-r border-ink-200 bg-paper-200 overflow-hidden">
          {/* Upload bar */}
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={pdfFile}
              onReset={handleReset}
            />
          </div>

          {/* PDF viewer */}
          <div className="flex-1 overflow-hidden">
            {hasPdfLoaded ? (
              <PdfViewer
                pdfUrl={pdfUrl}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={goToPage}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-ink-200 flex items-center justify-center">
                  <BookOpen size={36} className="text-ink-400" />
                </div>
                <div>
                  <p className="font-display text-xl font-medium text-ink-600">
                    No document loaded
                  </p>
                  <p className="text-sm text-ink-400 mt-1">
                    Upload a PDF above to view and analyze it
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL: Summary + Chat ─── */}
        <div className="flex flex-col w-1/2 bg-paper-300 overflow-hidden">
          <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
            {/* Summary panel — only shown when a PDF is loaded */}
            {hasPdfLoaded && (
              <div className="flex-shrink-0">
                <SummaryPanel
                  onAnalyze={handleAnalyze}
                  isSummarizing={isSummarizing}
                  summary={summary}
                  summaryError={summaryError}
                  isDisabled={!hasPages || isSummarizing}
                />
              </div>
            )}

            {/* Chat box — fills remaining space */}
            <div className="flex-1 min-h-0">
              <ChatBox
                messages={messages}
                isLoading={isLoading}
                onSend={handleSend}
                hasPages={hasPages}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
