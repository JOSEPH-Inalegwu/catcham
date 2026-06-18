"use client";

import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';

export default function ExpertEscalation() {
  return (
    <section className="py-20 bg-[#101010]/50 border-y border-[#3d3a39]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          
          <div className="flex-1 w-full max-w-xl">
            <RevealWrapper origin="right" delay={200} duration={800} distance="40px">
              <div className="relative rounded-2xl border border-[#3d3a39] bg-[#141414] p-8 shadow-2xl overflow-hidden">
                {/* Background glow */}
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#00d992]/10 blur-[60px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-[#3d3a39] pb-4">
                    <h3 className="font-semibold text-[#ffffff]">Escalation Request #4920</h3>
                    <span className="rounded-full bg-[#eab308]/20 px-3 py-1 text-xs font-bold text-[#eab308]">
                      Pending Review
                    </span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#a0a0a0]">Automated Confidence</span>
                      <span className="text-sm font-semibold text-[#ffffff]">82% (Borderline)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#a0a0a0]">Assigned Analyst</span>
                      <span className="text-sm font-semibold text-[#ffffff]">Forensic Team Alpha</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#a0a0a0]">Estimated SLA</span>
                      <span className="text-sm font-semibold text-[#00d992]">Under 15 minutes</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] p-4 border border-[#3d3a39]">
                    <div className="flex h-2 w-2 rounded-full bg-[#eab308] animate-pulse"></div>
                    <span className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">
                      Human Analyst examining frequency graphs...
                    </span>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          </div>

          <div className="flex-1">
            <RevealWrapper origin="left" delay={100} duration={800} distance="40px">
              <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
                Human-in-the-Loop
              </p>
              <h2 className="mt-4 text-3xl font-normal text-[#ffffff] sm:text-4xl">
                Expert escalation for high-stakes decisions
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#a0a0a0]">
                CatchAm AI is designed to support, not replace, human judgement. For borderline cases or massive financial transactions, our platform allows you to escalate flagged media directly to our certified human forensic analysts.
              </p>
              
              <ul className="mt-10 space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00d992]/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#ffffff]">Manual Verification</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#a0a0a0]">
                      Disputed or borderline results are routed securely to human experts who manually review waveform signatures and spatial depth.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00d992]/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#ffffff]">Model Retraining</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#a0a0a0]">
                      Every escalated human review feeds directly back into our architecture, continuously improving detection accuracy.
                    </p>
                  </div>
                </li>
              </ul>
            </RevealWrapper>
          </div>

        </div>
      </div>
    </section>
  );
}
