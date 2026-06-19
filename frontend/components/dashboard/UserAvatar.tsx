"use client";

import { useState } from 'react';

export default function UserAvatar({ onAddWorkspace }: { onAddWorkspace?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] hover:bg-[#1A1A1A] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#00C170]/20 border border-[#3d3a39] flex items-center justify-center text-xs font-semibold text-[#00C170] flex-shrink-0">
          JD
        </div>
        <span className="text-sm text-[#ffffff] hidden sm:inline">Joseph Jonah</span>
        <svg className={`w-3.5 h-3.5 text-[#a0a0a0] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-[280px] bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-1.5 z-20 shadow-lg">
            
            <div className="px-3 py-3 bg-[#141414] rounded-[6px] mb-1.5 border border-[#3d3a39]">
              <p className="text-xs text-[#a0a0a0] mb-1">Current Plan</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#ffffff]">Sandbox</span>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#00C170] hover:text-[#00A35E] transition-colors">
                  Upgrade
                </button>
              </div>
            </div>

            <button 
              onClick={() => { setOpen(false); onAddWorkspace?.(); }}
              className="w-full flex items-center gap-3 px-3 py-4 rounded-[6px] text-sm text-[#ffffff] hover:bg-[#141414]/50 transition-colors"
            >
              <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Organization Workspace
            </button>

            <div className="mx-3 my-1.5 border-t border-[#3d3a39]" />

            {['Profile', 'Log out'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 rounded-[6px] text-sm text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#141414]/50 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
