/**
 * MessageBubble.jsx
 * Renders a single chat message with role-based styling.
 * For assistant messages, clickable page citations are rendered inline.
 */

import { BookOpen, User, AlertTriangle } from 'lucide-react';

function renderWithPageCitations(text, onPageJump) {
  if (!onPageJump) return text;

  const parts = text.split(/(\bPages?\s+\d+(?:\s*(?:and|,|&)\s*\d+)*\b)/gi);

  return parts.map((part, idx) => {
    const pageMatch = part.match(/\bPages?\s+(\d+)(?:\s*(?:and|,|&)\s*(\d+))*/i);
    if (pageMatch) {
      const nums = part.match(/\d+/g)?.map(Number) || [];
      return (
        <span key={idx}>
          {nums.map((n, i) => (
            <button
              key={i}
              onClick={() => onPageJump(n)}
              className="page-badge"
              title={`Jump to page ${n}`}
            >
              <BookOpen size={10} />
              {i === 0 ? part.replace(/\d+/g, '').replace(/pages?/i, 'p.').trim() : ''} {n}
            </button>
          ))}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function TypingIndicator({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isDark ? 'bg-zinc-100' : 'bg-stone-900'
        }`}
      >
        <BookOpen size={14} className={isDark ? 'text-black' : 'text-white'} />
      </div>
      <div
        className={`rounded-2xl rounded-bl-sm px-4 py-3 border ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200'
        }`}
      >
        <div className={`flex gap-1 items-center h-4 ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ message, onPageJump, theme = 'dark' }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  const isDark = theme === 'dark';

  if (isUser) {
    return (
      <div className="flex items-end gap-2.5 flex-row-reverse animate-slide-up">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-zinc-100' : 'bg-stone-900'
          }`}
        >
          <User size={14} className={isDark ? 'text-black' : 'text-white'} />
        </div>
        <div
          className={`max-w-[75%] rounded-2xl rounded-br-sm px-4 py-2.5 ${
            isDark ? 'bg-zinc-100 text-black' : 'bg-stone-900 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start gap-2.5 animate-slide-up">
        <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={14} className="text-white" />
        </div>
        <div
          className={`max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 border ${
            isDark ? 'bg-red-950/40 border-red-900' : 'bg-red-50 border-red-200'
          }`}
        >
          <p className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-red-300' : 'text-red-700'}`}>Error</p>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-red-200' : 'text-red-600'}`}>
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      <div
        className={`w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-100 border-stone-200'
        }`}
      >
        <BookOpen size={14} className={isDark ? 'text-zinc-100' : 'text-stone-900'} />
      </div>
      <div
        className={`max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 border ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200'
        }`}
      >
        <p className={`text-sm leading-relaxed ai-prose ${isDark ? 'text-zinc-200' : 'text-stone-700'}`}>
          {renderWithPageCitations(message.content, onPageJump)}
        </p>
        {message.pages?.length > 0 && (
          <div className={`mt-2 pt-2 border-t flex flex-wrap gap-1 ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
            <span className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-stone-500'}`}>
              Referenced:
            </span>
            {message.pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageJump(p)}
                className="page-badge"
                title={`Jump to page ${p}`}
              >
                <BookOpen size={10} /> pg. {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
