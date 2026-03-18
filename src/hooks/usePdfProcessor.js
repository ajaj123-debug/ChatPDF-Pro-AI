import { useState, useCallback } from 'react';
import { extractTextFromPDF, buildPageContext } from '../utils/extractText';

export function usePdfProcessor() {
  const [pdfFile, setPdfFile] = useState(null);       // The File object for react-pdf
  const [pdfUrl, setPdfUrl] = useState(null);         // Object URL for react-pdf rendering
  const [pages, setPages] = useState([]);             // Array of { pageNumber, text }
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);

  /**
   * Load a PDF file: create object URL and extract text.
   */
  const loadPdf = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setExtractError('Please upload a valid PDF file.');
      return;
    }

    // Clean up previous object URL
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    setIsExtracting(true);
    setExtractError(null);
    setPages([]);
    setCurrentPage(1);

    const url = URL.createObjectURL(file);
    setPdfFile(file);
    setPdfUrl(url);

    try {
      const { pages: extractedPages, pageCount: count } = await extractTextFromPDF(file);
      setPages(extractedPages);
      setPageCount(count);
    } catch (err) {
      console.error('Text extraction failed:', err);
      setExtractError('Failed to extract text from PDF. The file may be scanned or encrypted.');
    } finally {
      setIsExtracting(false);
    }
  }, [pdfUrl]);

  /**
   * Navigate to a specific page (clamped to valid range).
   */
  const goToPage = useCallback((pageNum) => {
    setCurrentPage((prev) => {
      const clamped = Math.max(1, Math.min(pageNum, pageCount || 1));
      return clamped;
    });
  }, [pageCount]);

  /**
   * Build the context string for LLM queries.
   */
  const getContext = useCallback(() => {
    return buildPageContext(pages);
  }, [pages]);

  /**
   * Get the full text (joined pages) for summarization.
   */
  const getFullText = useCallback(() => {
    return pages.map((p) => `Page ${p.pageNumber}: ${p.text}`).join('\n\n');
  }, [pages]);

  const reset = useCallback(() => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(null);
    setPdfUrl(null);
    setPages([]);
    setPageCount(0);
    setCurrentPage(1);
    setExtractError(null);
  }, [pdfUrl]);

  return {
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
    reset,
  };
}
