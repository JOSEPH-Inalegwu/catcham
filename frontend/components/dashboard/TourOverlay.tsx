"use client";

import { useEffect, useState } from 'react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    target: 'overview',
    title: 'Overview',
    description:
      'Your security command centre. Monitor real-time threat activity, scan volumes, and team performance at a glance.',
  },
  {
    target: 'scanner',
    title: 'Forensic Scanner',
    description:
      'Upload files or paste links for deepfake analysis. Each scan consumes one credit — results include confidence scores and a downloadable forensic report.',
  },
  {
    target: 'monitoring',
    title: 'Monitoring',
    description:
      'Configure web crawler targets to automatically detect synthetic media across public sources, 24/7.',
  },
  {
    target: 'billing',
    title: 'Billing',
    description:
      'Add a payment method to unlock forensic credits and activate enterprise monitoring for your workspace.',
    action: 'Set up billing',
  },
];

export default function TourOverlay({
  step,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onAction,
}: {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onAction?: () => void;
}) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(`[data-tour-index="${step}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [step]);

  const s = tourSteps[step];
  const isLast = step === totalSteps - 1;

  return (
    <>
      {/* Spotlight backdrop — dims everything except the target */}
      {targetRect && (
        <svg className="fixed inset-0 w-full h-full z-40 pointer-events-auto" onClick={onSkip}>
          <defs>
            <mask id="tour-spotlight">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                fill="black"
                rx={8}
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="black" fillOpacity="0.6" mask="url(#tour-spotlight)" />
        </svg>
      )}

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          className="fixed z-40 pointer-events-none rounded-[8px] border-2 border-[#00C170]"
          style={{
            top: targetRect.top - 2,
            left: targetRect.left - 2,
            width: targetRect.width + 4,
            height: targetRect.height + 4,
          }}
        />
      )}

      <div
        className="fixed z-50 w-[380px] bg-[#1A1A1A] border border-[#00C170]/30 rounded-[8px] p-5 shadow-xl"
        style={{
          top: targetRect ? targetRect.top + targetRect.height / 2 : 0,
          left: targetRect ? targetRect.right + 16 : 0,
          transform: 'translateY(-50%)',
        }}
      >
        <div className="text-xs text-[#a0a0a0] font-mono mb-4">
          {String(step + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </div>

        <h3 className="text-sm font-semibold text-[#ffffff] mb-2">{s.title}</h3>
        <p className="text-xs text-[#ffffff] leading-relaxed mb-5">{s.description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-[#a0a0a0] hover:text-[#ffffff] transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-3">
            {!isLast ? (
              <>
                {step > 0 && (
                  <button
                    onClick={onBack}
                    className="px-5 py-2.5 text-sm text-[#a0a0a0] hover:text-[#ffffff] border border-[#3d3a39] rounded-[6px] hover:border-[#5a5a5a] transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onNext}
                  className="px-5 py-2.5 text-sm font-medium text-[#ffffff] bg-[#00C170] rounded-[6px] hover:bg-[#00A35E] transition-colors"
                >
                  Next
                </button>
              </>
            ) : (
              onAction && (
                <button
                  onClick={onAction}
                  className="px-6 py-2.5 text-sm font-medium text-[#ffffff] bg-[#00C170] rounded-[6px] hover:bg-[#00A35E] transition-colors"
                >
                  {s.action}
                </button>
              )
            )}
          </div>
        </div>

        <div
          className="absolute top-1/2 -left-[5px] w-2.5 h-2.5 bg-[#1A1A1A] border-l border-t border-[#00C170]/30 rotate-[-45deg]"
          style={{ marginTop: -5 }}
        />
      </div>
    </>
  );
}
