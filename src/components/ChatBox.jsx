import { useRef, useEffect, useState, useCallback } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import MessageBubble, { TypingIndicator } from './MessageBubble';

function EmptyState({ hasPages, theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-10">
      <div
        className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-100 border-stone-200'
        }`}
      >
        <MessageSquare size={22} className={isDark ? 'text-zinc-100' : 'text-stone-900'} />
      </div>
      <div>
        <p className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
          {hasPages ? 'Ask anything about the document' : 'Upload a PDF to start chatting'}
        </p>
        <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
          {hasPages
            ? "I'll find the answer and tell you exactly which page it's on."
            : 'Drag and drop or click the upload area on the left.'}
        </p>
      </div>
    </div>
  );
}

export default function ChatBox({
  messages,
  isLoading,
  onSend,
  hasPages,
  suggestedQuestions = [],
  isGeneratingSuggestions = false,
  theme = 'dark',
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = input.trim().length > 0 && !isLoading && hasPages;

  const fillInput = useCallback((question) => {
    setInput(question);
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'border-zinc-800 bg-zinc-950 shadow-[0_18px_45px_rgba(0,0,0,0.28)]'
          : 'border-stone-200 bg-white shadow-[0_18px_45px_rgba(24,24,27,0.08)]'
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-3 sm:px-4 border-b flex-shrink-0 ${
          isDark ? 'border-zinc-800' : 'border-stone-200'
        }`}
      >
        <MessageSquare size={16} className={isDark ? 'text-zinc-100' : 'text-stone-900'} />
        <h3 className={`text-sm font-semibold font-display ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
          Chat
        </h3>
        {messages.length > 0 && (
          <span className={`ml-auto text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
            {Math.floor(messages.length / 2)} exchange{messages.length !== 2 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 sm:px-4">
        {messages.length === 0 ? (
          <EmptyState hasPages={hasPages} theme={theme} />
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onPageJump={(p) => {
                window.dispatchEvent(new CustomEvent('pdf-jump-page', { detail: p }));
              }}
              theme={theme}
            />
          ))
        )}

        {isLoading && <TypingIndicator theme={theme} />}

        <div ref={messagesEndRef} />
      </div>

      <div className={`flex-shrink-0 border-t p-3 ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
        {hasPages && (
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                Suggested questions
              </p>
              {isGeneratingSuggestions && (
                <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                  Generating...
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => fillInput(question)}
                  className={`rounded-full border px-3 py-1.5 text-left text-xs transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100'
                      : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-500 hover:bg-white hover:text-stone-900'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasPages ? 'Ask a question about the document...' : 'Upload a PDF first...'}
            disabled={!hasPages || isLoading}
            rows={1}
            className={`
              flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm
              focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150 max-h-32 overflow-y-auto
              ${
                isDark
                  ? 'bg-black border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600/30'
                  : 'bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-400/20'
              }
            `}
            style={{ minHeight: '42px' }}
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              transition-all duration-200
              ${
                canSend
                  ? isDark
                    ? 'bg-zinc-100 text-black hover:bg-zinc-300 shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-stone-900 text-white hover:bg-stone-700 shadow-md hover:-translate-y-0.5 active:translate-y-0'
                  : isDark
                    ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }
            `}
            title="Send message"
          >
            <Send size={16} />
          </button>
        </form>
        <p className={`hidden sm:block text-xs mt-1.5 px-1 ${isDark ? 'text-zinc-500' : 'text-stone-500'}`}>
          Press{' '}
          <kbd
            className={`font-mono px-1 rounded ${
              isDark ? 'bg-zinc-900 text-zinc-200' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Enter
          </kbd>{' '}
          to send,{' '}
          <kbd
            className={`font-mono px-1 rounded ${
              isDark ? 'bg-zinc-900 text-zinc-200' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Shift+Enter
          </kbd>{' '}
          for new line
        </p>
      </div>
    </div>
  );
}
