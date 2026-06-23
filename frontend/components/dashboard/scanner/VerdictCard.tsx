"use client";

import { ScanResult, getTheme } from './types';

export default function VerdictCard({ result }: { result: ScanResult }) {
  const theme = getTheme(result.verdict, result.confidence);
  const verdictLabel = result.verdict === 'synthetic'
    ? 'Synthetic'
    : result.verdict === 'suspicious'
      ? 'Suspicious'
      : 'Authentic';

  // Explain what happened in plain language based on the outcome.
  const summary = result.verdict === 'synthetic'
    ? `The engine intercepted severe anomalies indicative of synthetic manipulation. Global confidence reached ${result.confidence}%, triggering a secondary spatial scan ${result.faces && result.faces.length > 0 ? 'which successfully mapped the target boundary coordinates.' : 'but no specific facial boundaries were isolated.'}`
    : result.verdict === 'suspicious'
      ? `The engine detected near-breach manipulation signatures. Global confidence reached ${result.confidence}%. ${result.faces && result.faces.length > 0 ? 'Spatial mapping isolated the target boundary coordinates.' : 'No specific facial boundaries were isolated.'}`
      : `Asset passed integrity scans. Global confidence in authenticity is ${result.confidence}%. No spatial extraction was triggered.`;

  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-[1.5px] text-[#8b949e]">Verdict</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.bgLight} ${theme.text}`}>
          {verdictLabel}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-semibold text-[#ffffff] tracking-tight">{result.confidence}%</span>
          <span className="text-xs text-[#8b949e]">confidence</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3d3a39]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${theme.bg}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <p className="text-[#a0a0a0] text-xs leading-relaxed">{summary}</p>
    </div>
  );
}
