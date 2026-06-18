"use client";

import { RevealWrapper } from 'next-reveal';

export default function ExplainableAI() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          
          <div className="flex-1 lg:order-2">
            <RevealWrapper origin="right" delay={100} duration={800} distance="40px">
              <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
                Visual Forensic Proof Engine
              </p>
              <h2 className="mt-4 text-3xl font-normal text-[#ffffff] sm:text-4xl">
                Explainable AI you can take to court
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#a0a0a0]">
                A raw probability score is insufficient to justify legal action or an emergency PR response. CatchAm translates complex neural network outputs into instantly actionable visual evidence.
              </p>
              
              <ul className="mt-10 space-y-8">
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#00d992]/30 bg-[#00d992]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#ffffff]">Precise Forensic Heatmaps</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#a0a0a0]">
                      Red indicator bounding boxes are drawn exactly around unnatural lip-sync tearing, spatial deepfake artifacts, or audio frequency spikes.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#00d992]/30 bg-[#00d992]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#ffffff]">Immutable Audit Reports</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#a0a0a0]">
                      Generate downloadable forensic PDFs that any non-technical stakeholder—from board members to legal counsel—can understand at a glance.
                    </p>
                  </div>
                </li>
              </ul>
            </RevealWrapper>
          </div>

          <div className="w-full max-w-xl flex-1 lg:order-1">
            <RevealWrapper origin="left" delay={200} duration={800} distance="40px">
              <div className="relative rounded-2xl border border-[#3d3a39] bg-[#141414] p-3 shadow-2xl overflow-hidden">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#ef4444]/10 blur-[80px]"></div>
                <div className="relative z-10">
                  <img
                    src="/face_swap1.jpg" 
                    alt="Explainable AI Heatmap"
                    className="h-auto w-full rounded-xl object-cover"
                  />
                  {/* Fake Red Bounding Box Overlay for UI mockup */}
                  <div className="absolute top-[15%] left-[25%] h-[45%] w-[45%] rounded-lg border-[3px] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <div className="absolute -top-7 left-0 flex items-center gap-1.5 rounded bg-[#ef4444] px-2 py-1 shadow-lg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Morphing Anomaly: 98%
                      </span>
                    </div>
                  </div>
                  {/* Scanner overlay effect line */}
                  <div className="absolute left-0 top-[35%] h-0.5 w-full bg-[#ef4444]/60 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                </div>
              </div>
            </RevealWrapper>
          </div>

        </div>
      </div>
    </section>
  );
}
