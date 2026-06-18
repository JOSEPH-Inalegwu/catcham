"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RevealWrapper } from 'next-reveal';

type ProfileType = 'Company' | 'Personal Brand';
type StartAction = 'credits' | 'subscribe' | 'explore';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [startAction, setStartAction] = useState<StartAction | null>(null);

  const canAdvanceToStep2 = workspaceName.trim().length > 0 && profileType !== null;

  const handleFinish = (action: StartAction) => {
    setStartAction(action);
    const dashboardPath = action === 'explore'
      ? '/workspace/dashboard?mode=locked'
      : '/workspace/dashboard?mode=credit';
    router.push(`${dashboardPath}&type=${profileType === 'Company' ? 'enterprise' : 'pro'}&workspace=${encodeURIComponent(workspaceName)}`);
  };

  if (step === 1) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 sm:px-6 bg-[#101010]">
        <div className="w-full max-w-[560px]">
          <RevealWrapper origin="bottom" delay={100} duration={600} distance="30px">
            <div className="mb-2">
              <p className="text-[#00C170] font-mono text-xs uppercase tracking-[2.52px] mb-3">Step 1 of 2</p>
              <h1 className="text-2xl sm:text-3xl font-normal text-[#FFFFFF] tracking-tight mb-2">Set up your workspace</h1>
              <p className="text-[#A0A0A0] text-sm">Define your security environment.</p>
            </div>

            <div className="mt-8 sm:mt-10 mb-6 sm:mb-8">
              <label className="block text-xs text-[#a0a0a0] mb-2 font-mono uppercase tracking-[1.5px]">Workspace name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#3d3a39] rounded-[6px] px-4 py-4 text-[#FFFFFF] text-sm focus:border-[#00C170] outline-none transition-colors"
                placeholder="e.g. CatchAm Operations"
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs text-[#a0a0a0] mb-3 font-mono uppercase tracking-[1.5px]">Profile type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Company', 'Personal Brand'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setProfileType(type)}
                    className={`text-left p-5 rounded-[8px] border transition-all ${
                      profileType === type
                        ? 'border-[#00C170] bg-[#1A1A1A]'
                        : 'border-[#3d3a39] bg-[#141414] hover:border-[#5a5a5a]'
                    }`}
                  >
                    <span className="block text-[#FFFFFF] font-semibold mb-1 text-sm sm:text-base">{type}</span>
                    <span className="text-[#A0A0A0] text-xs">
                      {type === 'Company' ? 'Multi-user, enterprise controls' : 'Single-user, personal scans'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!canAdvanceToStep2}
              onClick={() => setStep(2)}
              className="w-full bg-[#00C170] text-[#0A0A0A] py-3.5 rounded-[6px] text-sm font-semibold hover:bg-[#2FD6A1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </RevealWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 sm:px-8 bg-[#101010]">
      <div className="w-full max-w-[960px]">
        <RevealWrapper origin="bottom" delay={100} duration={600} distance="30px">
          <div className="flex items-start gap-4 mb-2">
          <button
            onClick={() => setStep(1)}
            className="mt-1 text-[#a0a0a0] hover:text-[#ffffff] transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <p className="text-[#00C170] font-mono text-xs uppercase tracking-[2.52px] mb-3">Step 2 of 2</p>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#FFFFFF] tracking-tight mb-2">Choose your starting point</h1>
            <p className="text-[#A0A0A0] text-sm">Select how you want to begin securing your media.</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <button
            onClick={() => handleFinish('credits')}
            className="text-left p-5 sm:p-6 rounded-[8px] border border-[#3d3a39] bg-[#141414] hover:border-[#00C170] transition-all group flex flex-col"
          >
            <div className="flex-1">
              <span className="block text-[#FFFFFF] font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Credits</span>
              <p className="text-[#A0A0A0] text-xs sm:text-sm leading-relaxed group-hover:text-[#FFFFFF] transition-colors">
                Buy a flat detection credit packet. Scan on demand, no recurring commitment.
              </p>
            </div>
            <span className="text-[#00C170] text-xs font-mono mt-4 block">&#x20A6;8,000 for 10 reports</span>
          </button>

          <button
            onClick={() => handleFinish('subscribe')}
            className="text-left p-5 sm:p-6 rounded-[8px] border border-[#3d3a39] bg-[#141414] hover:border-[#00C170] transition-all group flex flex-col relative"
          >
            <div className="absolute -top-2.5 right-4 bg-[#00C170] text-[#0A0A0A] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Best value
            </div>
            <div className="flex-1">
              <span className="block text-[#FFFFFF] font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Subscribe</span>
              <p className="text-[#A0A0A0] text-xs sm:text-sm leading-relaxed group-hover:text-[#FFFFFF] transition-colors">
                Full web crawler surveillance, unlimited scans, and priority reporting.
              </p>
            </div>
            <span className="text-[#00C170] text-xs font-mono mt-4 block">Starting at &#x20A6;75,000 / month</span>
          </button>

          <button
            onClick={() => handleFinish('explore')}
            className="text-left p-5 sm:p-6 rounded-[8px] border border-[#3d3a39] bg-[#141414] hover:border-[#5a5a5a] transition-all group flex flex-col md:col-span-2 lg:col-span-1"
          >
            <div className="flex-1">
              <span className="block text-[#FFFFFF] font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Explore</span>
              <p className="text-[#A0A0A0] text-xs sm:text-sm leading-relaxed group-hover:text-[#FFFFFF] transition-colors">
                Preview the dashboard. Upload and scanning will be disabled until you fund your account.
              </p>
            </div>
            <span className="text-[#A0A0A0] text-xs font-mono mt-4 block">Free preview</span>
          </button>
        </div>
          </RevealWrapper>
        </div>
      </div>
  );
}
