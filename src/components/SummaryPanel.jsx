/**
 * SummaryPanel.jsx
 * Displays the Analyze button and the resulting document summary.
 */

import { Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

/**
 * Parses bullet-point summary text into an array of strings.
 * Handles • , -, *, and numbered lists.
 */
function parseBullets(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/^[\s•\-\*\d\.]+/, '').trim())
    .filter(Boolean);
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2.5 animate-pulse">
      {[80, 65, 90, 70, 75].map((w, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-ink-300 mt-1.5 flex-shrink-0" />
          <div
            className="h-3.5 bg-ink-200 rounded-full"
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
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bullets = summary ? parseBullets(summary) : [];

  return (
    <div className="rounded-2xl border border-ink-200 bg-paper-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-200">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-500" />
          <h3 className="text-sm font-semibold text-ink-800 font-display">Document Summary</h3>
        </div>
        {summary && (
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className="p-1 text-ink-400 hover:text-ink-700 rounded transition-colors"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Analyze button */}
        {!summary && !isSummarizing && (
          <button
            onClick={onAnalyze}
            disabled={isDisabled}
            className={`
              w-full flex items-center justify-center gap-2 
              py-2.5 px-4 rounded-xl text-sm font-semibold
              transition-all duration-200
              ${isDisabled
                ? 'bg-ink-200 text-ink-400 cursor-not-allowed'
                : 'bg-accent-500 text-paper-50 hover:bg-accent-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            <Sparkles size={15} />
            Analyze Document
          </button>
        )}

        {/* Loading skeleton */}
        {isSummarizing && (
          <div className="space-y-3">
            <p className="text-xs text-ink-400 flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-accent-500 border-t-transparent rounded-full animate-spin inline-block" />
              Analyzing document…
            </p>
            <LoadingSkeleton />
          </div>
        )}

        {/* Error */}
        {summaryError && !isSummarizing && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-red-700">Analysis failed</p>
              <p className="text-xs text-red-500 mt-0.5">{summaryError}</p>
            </div>
          </div>
        )}

        {/* Summary bullets */}
        {summary && !isCollapsed && (
          <ul className="space-y-2.5 animate-slide-up">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />
                <span className="text-sm text-ink-700 leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Re-analyze option after summary */}
        {summary && !isCollapsed && (
          <button
            onClick={onAnalyze}
            disabled={isSummarizing}
            className="mt-4 w-full py-1.5 text-xs text-ink-400 hover:text-accent-600 font-medium border border-dashed border-ink-200 hover:border-accent-400 rounded-xl transition-all"
          >
            Re-analyze
          </button>
        )}
      </div>
    </div>
  );
}
