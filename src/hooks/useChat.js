/**
 * useChat.js
 * Manages chat message history, sending questions to the LLM,
 * and document summarization.
 */

import { useState, useCallback, useRef } from 'react';
import { answerQuestion, summarizeDocument } from '../services/llmService';
import { extractPageNumbers } from '../utils/extractText';

/** @typedef {{ id: string, role: 'user'|'assistant'|'error', content: string, pages?: number[] }} Message */

let msgIdCounter = 0;
const uid = () => `msg_${++msgIdCounter}_${Date.now()}`;

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const abortRef = useRef(null);

  const addMessage = useCallback((role, content, extra = {}) => {
    const msg = { id: uid(), role, content, ...extra };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  /**
   * Send a user question and get a page-cited answer.
   * @param {string} question
   * @param {string} context - Page-formatted context string
   * @param {function} onPageJump - Callback when user clicks a page citation
   */
  const sendMessage = useCallback(
    async (question, context) => {
      if (!question.trim() || isLoading) return;

      addMessage('user', question);
      setIsLoading(true);

      try {
        const answer = await answerQuestion(context, question);
        const pages = extractPageNumbers(answer);
        addMessage('assistant', answer, { pages });
      } catch (err) {
        addMessage('error', err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage]
  );

  /**
   * Generate a document summary.
   * @param {string} fullText - Full extracted text from the PDF
   */
  const generateSummary = useCallback(async (fullText) => {
    if (!fullText.trim() || isSummarizing) return;

    setIsSummarizing(true);
    setSummaryError(null);
    setSummary(null);

    try {
      const result = await summarizeDocument(fullText);
      setSummary(result);
    } catch (err) {
      setSummaryError(err.message || 'Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  }, [isSummarizing]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSummary(null);
    setSummaryError(null);
  }, []);

  return {
    messages,
    isLoading,
    summary,
    isSummarizing,
    summaryError,
    sendMessage,
    generateSummary,
    clearChat,
  };
}
