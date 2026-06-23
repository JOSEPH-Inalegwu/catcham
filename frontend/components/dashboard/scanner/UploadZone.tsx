"use client";

import { useRef } from 'react';

export default function UploadZone({ onFileSelect }: { onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#3d3a39] rounded-[8px] bg-[#141414] hover:bg-[#1a1a1a] transition-colors p-16 flex flex-col items-center justify-center cursor-pointer min-h-[400px]"
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={onFileSelect}
          />
          <svg className="w-12 h-12 text-[#a0a0a0] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <h2 className="text-xl text-[#ffffff] font-medium mb-2">Initialize Forensic Scan</h2>
          <p className="text-sm text-[#a0a0a0]">Click to upload or drag and drop an asset (MP4, MOV, JPG, PNG)</p>
        </div>
      </div>

      <div>
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-6 h-full flex flex-col justify-center">
          <h3 className="text-base font-semibold text-[#ffffff] mb-4">Test with Samples</h3>
          <div className="flex flex-col gap-3">
            <button
              className="text-left px-4 py-3 rounded-[6px] text-sm font-medium bg-[#101010] text-[#a0a0a0] hover:text-[#ffffff] border border-[#3d3a39] hover:border-[#5a5a5a] transition-colors"
            >
              Sample 1: Political Speech (Deepfake)
            </button>
            <button
              className="text-left px-4 py-3 rounded-[6px] text-sm font-medium bg-[#101010] text-[#a0a0a0] hover:text-[#ffffff] border border-[#3d3a39] hover:border-[#5a5a5a] transition-colors"
            >
              Sample 2: News Broadcast (Authentic)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
