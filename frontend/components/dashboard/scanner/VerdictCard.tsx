"use client";

import { useState, useEffect } from 'react';
import { ScanResult, getTheme } from './types';

export default function VerdictCard({ result }: { result: ScanResult }) {
  const theme = getTheme(result.verdict, result.confidence);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const verdictLabel = result.verdict === 'synthetic'
    ? 'Synthetic'
    : result.verdict === 'suspicious'
      ? 'Suspicious'
      : 'Authentic';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setExplanation(null);

    fetch('/api/groq/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verdict: result.verdict,
        confidence: result.confidence,
        anomaly_type: result.anomaly_type,
        ai_generated_score: result.ai_generated_score,
        generation_sources: result.generation_sources,
        faces: result.faces,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setExplanation(data.explanation ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExplanation(null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [result]);

  const gaugePosition = Math.min(Math.max(result.confidence, 0), 100);

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

      {/* ─── Severity Gauge ─── */}
      <div className="mb-4">
        <div className="relative h-[6px] w-full rounded-full overflow-hidden bg-[#3d3a39]">
          <div className="absolute inset-0 flex">
            <div className="h-full w-[40%] bg-[#00C170]/30" />
            <div className="h-full w-[30%] bg-[#fbbf24]/30" />
            <div className="h-full w-[30%] bg-[#ef4444]/30" />
          </div>
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full bg-[#ffffff] border-[3px] transition-all duration-500 shadow-[0_0_6px_rgba(255,255,255,0.4)]"
            style={{
              left: `${gaugePosition}%`,
              transform: `translate(-50%, -50%)`,
              borderColor: gaugePosition >= 70 ? '#ef4444' : gaugePosition >= 40 ? '#fbbf24' : '#00C170',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[#5a5a5a]">Safe</span>
          <span className="text-xs text-[#5a5a5a]">Suspicious</span>
          <span className="text-xs text-[#5a5a5a]">Fake</span>
        </div>
      </div>

      {/* ─── Recommendation (from Groq) ─── */}
      {result.verdict === 'synthetic' || result.verdict === 'suspicious' ? (
        <div className="flex items-start gap-2 p-3 rounded-[6px] border border-[#ef4444]/20 bg-[#ef4444]/5">
          <svg className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M12 2l10 17H2L12 2z" />
          </svg>
          {loading ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className="text-xs text-[#ef4444]/90 leading-relaxed">{explanation ?? "This file shows signs of AI generation."}</p>
          )}
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-[6px] border border-[#00C170]/20 bg-[#00C170]/5">
          <svg className="w-4 h-4 text-[#00C170] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {loading ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C170]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C170]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C170]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className="text-xs text-[#00C170]/90 leading-relaxed">{explanation ?? "This file appears to be authentic."}</p>
          )}
        </div>
      )}
    </div>
  );
}
