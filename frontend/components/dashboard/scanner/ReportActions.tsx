"use client";

import { useRef } from 'react';
import SampleButtons from './SampleButtons';

export default function ReportActions({
  onFileSelect,
  onGeneratePdf,
  onSelectSample,
  isSandbox,
  isGeneratingPdf,
}: {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGeneratePdf: () => void;
  onSelectSample: (sampleId: string) => Promise<void>;
  isSandbox: boolean;
  isGeneratingPdf: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3.5 rounded-[8px] font-semibold text-sm border border-[#3d3a39] bg-transparent text-[#a0a0a0] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          Scan Another Asset
        </span>
      </button>
      <button
        onClick={onGeneratePdf}
        disabled={isSandbox || isGeneratingPdf}
        className={`w-full py-3.5 rounded-[8px] font-semibold text-sm transition-all ${
          isSandbox
            ? 'bg-[#1A1A1A] border border-[#3d3a39] text-[#a0a0a0] cursor-not-allowed'
            : 'bg-[#00C170] text-[#0A0A0A] hover:opacity-90 shadow-[0_0_15px_rgba(0,193,112,0.3)]'
        }`}
      >
        {isGeneratingPdf ? 'Compiling PDF...' : 'Generate Forensic Report'}
      </button>
      {isSandbox && (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider">Upgrade to Pro</span>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={onFileSelect}
      />

      <div className="mt-2 pt-3 border-t border-[#3d3a39]">
        <SampleButtons onSelectSample={onSelectSample} />
      </div>
    </div>
  );
}
