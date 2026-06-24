"use client";

import { useToast } from '@/app/context/ToastContext';

const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-[#00C170]/10', border: 'border-[#00C170]/30', icon: '#00C170' },
  error: { bg: 'bg-[#ef4444]/10', border: 'border-[#ef4444]/30', icon: '#ef4444' },
  info: { bg: 'bg-[#3b82f6]/10', border: 'border-[#3b82f6]/30', icon: '#3b82f6' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[380px] w-full pointer-events-none">
      {toasts.map((toast) => {
        const s = typeStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`${s.bg} ${s.border} border rounded-[8px] px-4 py-3 flex items-start gap-3 shadow-lg pointer-events-auto animate-slide-in-right`}
          >
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke={s.icon} strokeWidth={2}>
              {toast.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              ) : toast.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              )}
            </svg>
            <p className="text-sm text-[#ffffff] flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#a0a0a0] hover:text-[#ffffff] transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
