import { Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function parseBullets(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/^[\s\u2022\-\*\d\.]+/, '').trim())
    .filter(Boolean);
}

function LoadingSkeleton({ theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-2.5 animate-pulse">
      {[80, 65, 90, 70, 75].map((w, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isDark ? 'bg-zinc-700' : 'bg-stone-300'}`} />
          <div
            className={`h-3.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-stone-200'}`}
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function SummaryPanel({
  onAnalyze,
  isSummarizing,
  summary,
  summaryError,
  isDisabled,
  theme = 'dark',
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bullets = summary ? parseBullets(summary) : [];
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'border-zinc-800 bg-zinc-950 shadow-[0_18px_45px_rgba(0,0,0,0.28)]'
          : 'border-stone-200 bg-white shadow-[0_18px_45px_rgba(24,24,27,0.08)]'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 px-3 py-3 sm:px-4 border-b ${
          isDark ? 'border-zinc-800' : 'border-stone-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className={isDark ? 'text-zinc-100' : 'text-stone-900'} />
          <h3 className={`text-sm font-semibold font-display ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
            Document Summary
          </h3>
        </div>
        {summary && (
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {!summary && !isSummarizing && (
          <button
            onClick={onAnalyze}
            disabled={isDisabled}
            className={`
              w-full flex items-center justify-center gap-2
              py-2.5 px-4 rounded-xl text-sm font-semibold
              transition-all duration-200
              ${
                isDisabled
                  ? isDark
                    ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-zinc-100 text-black hover:bg-zinc-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-stone-900 text-white hover:bg-stone-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            <Sparkles size={15} />
            Analyze Document
          </button>
        )}

        {isSummarizing && (
          <div className="space-y-3">
            <p className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
              <span
                className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin inline-block ${
                  isDark ? 'border-zinc-100' : 'border-stone-900'
                }`}
              />
              Analyzing document...
            </p>
            <LoadingSkeleton theme={theme} />
          </div>
        )}

        {summaryError && !isSummarizing && (
          <div
            className={`flex items-start gap-2 p-3 rounded-xl ${
              isDark ? 'bg-red-950/40 border border-red-900' : 'bg-red-50 border border-red-200'
            }`}
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                Analysis failed
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                {summaryError}
              </p>
            </div>
          </div>
        )}

        {summary && !isCollapsed && (
          <ul className="space-y-2.5 animate-slide-up">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isDark ? 'bg-zinc-200' : 'bg-stone-900'}`} />
                <span className={`text-sm leading-relaxed ${isDark ? 'text-zinc-200' : 'text-stone-700'}`}>
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}

        {summary && !isCollapsed && (
          <button
            onClick={onAnalyze}
            disabled={isSummarizing}
            className={`mt-4 w-full py-1.5 text-xs font-medium border border-dashed rounded-xl transition-all ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-100 border-zinc-800 hover:border-zinc-500'
                : 'text-stone-500 hover:text-stone-900 border-stone-300 hover:border-stone-500'
            }`}
          >
            Re-analyze
          </button>
        )}
      </div>
    </div>
  );
}
