/**
 * MessageBubble.jsx
 * Renders a single chat message with role-based styling.
 * For assistant messages, clickable page citations are rendered inline.
 */

import { BookOpen, User, AlertTriangle } from 'lucide-react';

/**
 * Replaces "Page X" mentions in text with clickable badge elements.
 * @param {string} text
 * @param {function} onPageJump
 */
function renderWithPageCitations(text, onPageJump) {
  if (!onPageJump) return text;

  // Split on page references to inject interactive badges
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

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <div className="w-7 h-7 rounded-xl bg-sage-500 flex items-center justify-center flex-shrink-0">
        <BookOpen size={14} className="text-paper-50" />
      </div>
      <div className="bg-paper-200 border border-ink-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ message, onPageJump }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  if (isUser) {
    return (
      <div className="flex items-end gap-2.5 flex-row-reverse animate-slide-up">
        <div className="w-7 h-7 rounded-xl bg-accent-500 flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-paper-50" />
        </div>
        <div className="max-w-[75%] bg-accent-500 text-paper-50 rounded-2xl rounded-br-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start gap-2.5 animate-slide-up">
        <div className="w-7 h-7 rounded-xl bg-red-400 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={14} className="text-white" />
        </div>
        <div className="max-w-[80%] bg-red-50 border border-red-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
          <p className="text-xs font-semibold text-red-600 mb-0.5">Error</p>
          <p className="text-sm text-red-700 leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      <div className="w-7 h-7 rounded-xl bg-sage-500 flex items-center justify-center flex-shrink-0">
        <BookOpen size={14} className="text-paper-50" />
      </div>
      <div className="max-w-[80%] bg-paper-200 border border-ink-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <p className="text-sm text-ink-700 leading-relaxed ai-prose">
          {renderWithPageCitations(message.content, onPageJump)}
        </p>
        {message.pages?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-ink-200 flex flex-wrap gap-1">
            <span className="text-xs text-ink-400 font-medium">Referenced:</span>
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
