"use client";

import { useState, useCallback } from 'react';
import { ScanResult } from './types';
import { useToast } from '@/app/context/ToastContext';

export default function MetricsPanel({ result, onGeneratePdf, isSandbox }: { result: ScanResult; onGeneratePdf?: () => void; isSandbox?: boolean }) {
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const isRed = result.verdict === 'synthetic';

  const copyReportLink = useCallback(() => {
    const url = `${window.location.origin}/report/${result.id}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Report link copied', 'success');
    }).catch(() => {
      addToast('Failed to copy link', 'error');
    });
  }, [result.id, addToast]);

  const hasFaces = result.faces && result.faces.length > 0 && result.face_crops && result.face_crops.length > 0;

  return (
    <>
      {hasFaces && (
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Faces Detected</h4>
          <div className="grid grid-cols-3 gap-3">
            {result.face_crops!.map((crop, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-full aspect-square rounded-[6px] overflow-hidden border border-[#3d3a39] bg-[#101010]">
                  <img
                    src={`data:image/jpeg;base64,${crop}`}
                    alt={`Face ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-[#5a5a5a]">
                  {Math.round((result.faces?.[i]?.score ?? 0) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Sources</h4>
          <div className="rounded-[6px] border border-[#3d3a39] divide-y divide-[#3d3a39]">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm text-[#f2f2f2]">AI-Generated</span>
              <span className="text-sm text-[#f2f2f2]">{result.ai_generated_score}</span>
            </div>
            {result.generation_sources?.map((s) => (
              <div key={s.source} className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-[#a1a1aa]">{s.label}</span>
                <span className="text-xs text-[#f2f2f2]">{s.probability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {result.anomaly_type && (
            <span className={`block text-sm ${isRed ? 'text-[#ef4444]/80' : 'text-[#a0a0a0]'}`}>
              {result.anomaly_type}
            </span>
          )}
          {result.classification_tag && (
            <span className={`inline-block rounded-[4px] px-2 py-0.5 text-sm ${isRed ? 'bg-[#ef4444]/10 text-[#ef4444]/80' : 'bg-[#a0a0a0]/10 text-[#a0a0a0]'}`}>
              {result.classification_tag}
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-[#5a5a5a] hover:text-[#a0a0a0] transition-colors"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Details
        </button>

        {expanded && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5a5a5a]">Media</span>
              <span className="text-sm text-[#f2f2f2] capitalize">{result.media_type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5a5a5a]">ID</span>
              <span className="text-sm text-[#f2f2f2]">{result.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5a5a5a]">Analysed</span>
              <span className="text-sm text-[#f2f2f2]">{new Date(result.analysed_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyReportLink}
          className="flex-1 px-3 py-2 text-sm font-medium text-[#a0a0a0] border border-[#3d3a39] rounded-[6px] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors"
        >
          Copy link
        </button>
        <button
          onClick={() => onGeneratePdf?.()}
          disabled={isSandbox}
          className="flex-1 px-3 py-2 text-sm font-medium text-[#a0a0a0] border border-[#3d3a39] rounded-[6px] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Download PDF
        </button>
      </div>
    </>
  );
}
