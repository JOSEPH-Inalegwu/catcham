"use client";

import { useState } from 'react';
import { samples } from './samples';

export default function SampleButtons({
  onSelectSample,
}: {
  onSelectSample: (sampleId: string) => Promise<void>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleClick = async (id: string) => {
    if (loadingId) return;
    setLoadingId(id);
    try {
      await onSelectSample(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
      <h3 className="text-sm font-semibold text-[#ffffff] mb-3">Test with Samples</h3>
      <p className="text-xs text-[#a0a0a0] mb-4 leading-relaxed">
        Try CatchAm with pre-loaded media files. No upload required.
      </p>
      <div className="flex flex-col gap-2.5">
        {samples.map((s) => (
          <button
            key={s.id}
            onClick={() => handleClick(s.id)}
            disabled={loadingId !== null}
            className="text-left px-4 py-3 rounded-[6px] bg-[#101010] border border-[#3d3a39] hover:border-[#00C170]/50 disabled:opacity-60 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-[#ffffff] group-hover:text-[#00C170] transition-colors">
                  {s.label}
                </span>
                <span className="block text-[10px] text-[#a0a0a0] mt-0.5">{s.description}</span>
              </div>
              {loadingId === s.id ? (
                <svg className="w-4 h-4 text-[#00C170] animate-spin shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#a0a0a0] group-hover:text-[#00C170] shrink-0 mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
