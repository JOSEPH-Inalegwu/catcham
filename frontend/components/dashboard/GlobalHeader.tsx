"use client";

import { useState } from 'react';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';

const workspaces = ['CatchAm Operations', 'Personal Workspace', 'Client Monitoring Hub'];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(workspaces[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] hover:bg-[#1A1A1A] transition-colors text-sm"
      >
        <span className="text-[#ffffff] font-semibold hidden sm:inline">{current}</span>
        <svg className={`w-3.5 h-3.5 text-[#a0a0a0] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 w-[220px] bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-1.5 z-20 shadow-lg">
            {workspaces.map((w) => (
              <button
                key={w}
                onClick={() => { setCurrent(w); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-sm transition-colors ${w === current ? 'bg-[#141414] text-[#ffffff]' : 'text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#141414]/50'
                  }`}
              >
                {w}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GlobalHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="h-[56px] border-b border-[#3d3a39] bg-[#101010] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-[6px] hover:bg-[#1A1A1A] transition-colors"
        >
          <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <img src="/logo (2).png" alt="CatchAm" className="h-7 w-auto" />
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserAvatar />
      </div>
    </header>
  );
}
