"use client";

import { useEffect, useRef, ReactNode } from 'react';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  danger,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  danger?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      />
      <div className="relative w-full max-w-[440px] bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] shadow-2xl">
        <div className={`flex items-center justify-between px-6 py-4 border-b border-[#3d3a39]`}>
          <div>
            <h3 className={`text-sm font-semibold ${danger ? 'text-[#ef4444]' : 'text-[#ffffff]'}`}>
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#a0a0a0] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#262626] rounded-[6px] transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children && <div className="px-6 py-4">{children}</div>}

        {actions && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3d3a39]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
