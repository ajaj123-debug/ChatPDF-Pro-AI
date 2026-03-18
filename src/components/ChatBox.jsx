/**
 * ChatBox.jsx
 * The main chat interface: message list + input form.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import MessageBubble, { TypingIndicator } from './MessageBubble';

function EmptyState({ hasPages }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-10">
      <div className="w-12 h-12 rounded-2xl bg-ink-200 flex items-center justify-center">
        <MessageSquare size={22} className="text-ink-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-700">
          {hasPages ? 'Ask anything about the document' : 'Upload a PDF to start chatting'}
        </p>
        <p className="text-xs text-ink-400 mt-1 leading-relaxed">
          {hasPages
            ? 'I\'ll find the answer and tell you exactly which page it\'s on.'
            : 'Drag and drop or click the upload area on the left.'}
        </p>
      </div>
    </div>
  );
}

export default function ChatBox({ messages, isLoading, onSend, hasPages }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading || !hasPages) return;
      onSend(input.trim());
      setInput('');
    },
    [input, isLoading, hasPages, onSend]
  );

  const handleKeyDown = (e) => {
    // Submit on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = input.trim().length > 0 && !isLoading && hasPages;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-ink-200 bg-paper-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-200 flex-shrink-0">
        <MessageSquare size={16} className="text-sage-500" />
        <h3 className="text-sm font-semibold text-ink-800 font-display">Chat</h3>
        {messages.length > 0 && (
          <span className="ml-auto text-xs text-ink-400 font-mono">
            {Math.floor(messages.length / 2)} exchange{messages.length !== 2 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyState hasPages={hasPages} />
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onPageJump={(p) => {
                // Dispatch a custom event that App.jsx listens to
                window.dispatchEvent(new CustomEvent('pdf-jump-page', { detail: p }));
              }}
            />
          ))
        )}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-ink-200 p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasPages ? 'Ask a question about the document…' : 'Upload a PDF first…'}
            disabled={!hasPages || isLoading}
            rows={1}
            className={`
              flex-1 resize-none bg-paper-100 border border-ink-200 rounded-xl
              px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400
              focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
              max-h-32 overflow-y-auto
            `}
            style={{ minHeight: '42px' }}
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              transition-all duration-200
              ${canSend
                ? 'bg-accent-500 text-paper-50 hover:bg-accent-600 shadow-md hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-ink-200 text-ink-400 cursor-not-allowed'
              }
            `}
            title="Send message"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-xs text-ink-400 mt-1.5 px-1">
          Press <kbd className="font-mono bg-ink-100 px-1 rounded">Enter</kbd> to send, <kbd className="font-mono bg-ink-100 px-1 rounded">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
