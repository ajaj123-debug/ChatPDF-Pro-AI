import { useState, useCallback, useRef } from 'react';
import {
  answerQuestion,
  summarizeDocument,
  suggestQuestions,
} from '../services/llmService';
import { extractPageNumbers } from '../utils/extractText';

/** @typedef {{ id: string, role: 'user'|'assistant'|'error', content: string, pages?: number[] }} Message */

let msgIdCounter = 0;
const uid = () => `msg_${++msgIdCounter}_${Date.now()}`;
const fallbackSuggestions = [
  'What is this document mainly about?',
  'What are the key points in this PDF?',
  'Are there any important deadlines or dates?',
  'What action items or requirements are mentioned?',
];

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
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

  const generateSuggestedQuestions = useCallback(async (fullText) => {
    if (!fullText.trim() || isGeneratingSuggestions) return;

    setIsGeneratingSuggestions(true);

    try {
      const result = await suggestQuestions(fullText);
      setSuggestedQuestions(result.length ? result : fallbackSuggestions);
    } catch (err) {
      setSuggestedQuestions(fallbackSuggestions);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [isGeneratingSuggestions]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSummary(null);
    setSummaryError(null);
    setSuggestedQuestions([]);
    setIsGeneratingSuggestions(false);
  }, []);

  return {
    messages,
    isLoading,
    summary,
    isSummarizing,
    summaryError,
    suggestedQuestions,
    isGeneratingSuggestions,
    sendMessage,
    generateSummary,
    generateSuggestedQuestions,
    clearChat,
  };
}
