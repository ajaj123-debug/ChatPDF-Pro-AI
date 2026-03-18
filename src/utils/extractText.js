/**
 * extractText.js
 * Extracts per-page text from a PDF File object using pdfjs-dist.
 * Returns structured page data and a joined fullText string.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker — Vite will handle the URL resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * @typedef {Object} PageData
 * @property {number} pageNumber - 1-based page number
 * @property {string} text - Extracted text content for this page
 */

/**
 * Extract text from all pages of a PDF file.
 * @param {File} file - The PDF File object from the file input
 * @returns {Promise<{ pages: PageData[], fullText: string, pageCount: number }>}
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Join text items, preserving line breaks between blocks
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    pages.push({ pageNumber: i, text });
  }

  // Build context string: "Page 1: ... \nPage 2: ..."
  const fullText = pages.map((p) => `Page ${p.pageNumber}: ${p.text}`).join('\n\n');

  return {
    pages,
    fullText,
    pageCount: pdf.numPages,
  };
}

/**
 * Build a condensed context string from page data,
 * truncating individual pages to avoid token overflow.
 * @param {PageData[]} pages
 * @param {number} [maxCharsPerPage=3000]
 * @returns {string}
 */
export function buildPageContext(pages, maxCharsPerPage = 3000) {
  return pages
    .map((p) => {
      const truncated =
        p.text.length > maxCharsPerPage
          ? p.text.slice(0, maxCharsPerPage) + '...[truncated]'
          : p.text;
      return `Page ${p.pageNumber}: ${truncated}`;
    })
    .join('\n\n');
}

/**
 * Extract all page numbers mentioned in a text string.
 * Handles formats: "Page 3", "page 5", "Pages 2 and 4", "pg. 7"
 * @param {string} text
 * @returns {number[]} Unique sorted page numbers
 */
export function extractPageNumbers(text) {
  const matches = [];
  // Match "Page X", "Pages X", "page X", "pg X", "pg. X"
  const re = /\b(?:pages?|pg\.?)\s+(\d+)(?:\s*(?:and|,|&)\s*(\d+))*/gi;
  let match;
  while ((match = re.exec(text)) !== null) {
    // Extract all numbers from the full match
    const nums = match[0].match(/\d+/g);
    if (nums) nums.forEach((n) => matches.push(parseInt(n, 10)));
  }
  return [...new Set(matches)].sort((a, b) => a - b);
}
