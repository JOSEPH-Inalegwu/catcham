"use client";

import { useState } from 'react';

export default function ForensicScannerContent() {
  const [activeSample, setActiveSample] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="w-full bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] overflow-hidden max-h-[600px] flex items-center justify-center">
            <div className="relative inline-block max-w-full max-h-[600px]">
              <img 
                src={activeSample === 1 ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop'} 
                alt="Scan Target" 
                className="block max-w-full max-h-[600px] object-contain"
              />
              <svg 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <rect 
                  x="35" 
                  y="20" 
                  width="30" 
                  height="40" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2" 
                  className="animate-pulse"
                />
              </svg>

              <div className="absolute" style={{ top: '20%', left: '66%' }}>
                <div className="bg-[#101010]/80 backdrop-blur-sm border border-[#ef4444] px-2 py-1 rounded-[4px]">
                  <span className="text-[#ef4444] text-[10px] font-mono font-bold tracking-wider">AI DETECTED: 98%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#ffffff] mb-4">Detection Metrics</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span className="text-[#a0a0a0]">Synthetic Probability</span>
                <span className="text-[#00C170] font-mono font-semibold">98.4%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-[#a0a0a0]">Face Blend Artifacts</span>
                <span className="text-[#fbbf24] font-mono">High</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-[#a0a0a0]">Compression Inconsistency</span>
                <span className="text-[#ef4444] font-mono">Detected</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-[#a0a0a0]">Audio-Sync Jitter</span>
                <span className="text-[#ffffff] font-mono">N/A</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 flex-1">
            <h3 className="text-sm font-semibold text-[#ffffff] mb-3">Analysis Summary</h3>
            <p className="text-[#a0a0a0] text-xs leading-relaxed">
              The engine detected significant structural anomalies in the facial boundary layer. The transition between the primary subject's jawline and the background exhibits unnatural noise patterns consistent with modern GAN-based deepfake generation techniques. Vector tracking indicates a high probability of synthetic manipulation.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border-2 border-dashed border-[#3d3a39] rounded-[8px] bg-[#141414] hover:bg-[#1a1a1a] transition-colors p-10 flex flex-col items-center justify-center cursor-pointer">
            <svg className="w-8 h-8 text-[#a0a0a0] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-sm text-[#ffffff] font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-[#a0a0a0]">MP4, MOV, JPG, PNG (Max 50MB)</p>
          </div>
        </div>

        <div>
          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 h-full">
            <h3 className="text-sm font-semibold text-[#ffffff] mb-3">Test with Samples</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSample(1)}
                className={`text-left px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${activeSample === 1 ? 'bg-[#00C170] text-[#0A0A0A]' : 'bg-[#101010] text-[#a0a0a0] hover:text-[#ffffff] border border-[#3d3a39]'}`}
              >
                Sample 1: Political Speech (Deepfake)
              </button>
              <button 
                onClick={() => setActiveSample(2)}
                className={`text-left px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${activeSample === 2 ? 'bg-[#00C170] text-[#0A0A0A]' : 'bg-[#101010] text-[#a0a0a0] hover:text-[#ffffff] border border-[#3d3a39]'}`}
              >
                Sample 2: News Broadcast (Authentic)
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
