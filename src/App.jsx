import { useEffect, useCallback, useState } from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';

import logo from './assets/final_logo.png';

import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
import SummaryPanel from './components/SummaryPanel';
import ChatBox from './components/ChatBox';

import { usePdfProcessor } from './hooks/usePdfProcessor';
import { useChat } from './hooks/useChat';

const THEME_STORAGE_KEY = 'chatpdf-theme';

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  });

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const hasPdfLoaded = !!pdfUrl;
  const hasPages = pages.length > 0;
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#050505] text-zinc-100' : 'bg-stone-100 text-stone-900'
      }`}
    >
      <header
        className={`flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0 backdrop-blur transition-colors duration-300 ${
          isDark ? 'bg-black/95 border-zinc-800' : 'bg-stone-50/95 border-stone-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
              isDark
                ? 'bg-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                : 'bg-stone-900 shadow-[0_0_20px_rgba(24,24,27,0.08)]'
            }`}
          >
            <img src={logo} alt="Logo" className="w-6 h-6" />
          </div>
          <span
            className={`font-display text-lg font-medium tracking-tight ${
              isDark ? 'text-zinc-100' : 'text-stone-900'
            }`}
          >
            ChatPDF Pro AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isExtracting && (
            <div
              className={`flex items-center gap-2 text-xs ${
                isDark ? 'text-zinc-400' : 'text-stone-500'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin ${
                  isDark ? 'border-zinc-100' : 'border-stone-900'
                }`}
              />
              Extracting text...
            </div>
          )}
          {extractError && <p className="text-xs text-red-500">{extractError}</p>}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isDark
                ? 'border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900'
                : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100'
            }`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div
          className={`flex flex-col w-1/2 border-r overflow-hidden transition-colors duration-300 ${
            isDark ? 'border-zinc-800 bg-[#090909]' : 'border-stone-200 bg-stone-50'
          }`}
        >
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={pdfFile}
              onReset={handleReset}
              theme={theme}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {hasPdfLoaded ? (
              <PdfViewer
                pdfUrl={pdfUrl}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={goToPage}
                theme={theme}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                <div
                  className={`w-20 h-20 rounded-3xl border flex items-center justify-center transition-colors duration-300 ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
                      : 'bg-white border-stone-200 shadow-[0_12px_40px_rgba(24,24,27,0.08)]'
                  }`}
                >
                  <BookOpen size={36} className={isDark ? 'text-zinc-100' : 'text-stone-900'} />
                </div>
                <div>
                  <p
                    className={`font-display text-xl font-medium ${
                      isDark ? 'text-zinc-100' : 'text-stone-900'
                    }`}
                  >
                    No document loaded
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                    Upload a PDF above to view and analyze it
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col w-1/2 overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-[#050505]' : 'bg-stone-100'
          }`}
        >
          <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
            {hasPdfLoaded && (
              <div className="flex-shrink-0">
                <SummaryPanel
                  onAnalyze={handleAnalyze}
                  isSummarizing={isSummarizing}
                  summary={summary}
                  summaryError={summaryError}
                  isDisabled={!hasPages || isSummarizing}
                  theme={theme}
                />
              </div>
            )}

            <div className="flex-1 min-h-0">
              <ChatBox
                messages={messages}
                isLoading={isLoading}
                onSend={handleSend}
                hasPages={hasPages}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
