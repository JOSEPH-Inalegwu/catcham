"use client";

import Link from "next/link";
import { RevealWrapper } from 'next-reveal';

export default function ProHero() {
  return (
    <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-6">
        <RevealWrapper origin="left" delay={100} duration={800} distance="40px">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-normal leading-[1.05] tracking-[-0.65px] text-[#ffffff] sm:text-6xl lg:text-[60px] lg:leading-[64px]">
              Stop deepfakes before they go <span className="text-[#00d992]">viral.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#bdbdbd] lg:mx-0">
              Protect your brand with 24/7 proactive web crawling across Nigerian digital spaces. Get instant alerts, or purchase forensic report buckets for detailed, enterprise-grade file analysis.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/enterprise#pricing"
                className="rounded-[6px] bg-[#00d992] px-6 py-3 text-base font-semibold text-[#101010] transition-opacity hover:opacity-90"
              >
                View Plans
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-[6px] border border-[#3d3a39] px-6 py-3 text-base font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
              >
                Buy Report Buckets
              </Link>
            </div>
          </div>
        </RevealWrapper>
        <RevealWrapper origin="right" delay={300} duration={800} distance="40px">
          <div className="flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-[460px]">
              {/* Main Center Image */}
              <div className="relative z-10 mx-auto w-[85%]">
                <img
                  src="/fakenews2.jpg"
                  alt="CatchAm AI Enterprise Dashboard"
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl border border-[#3d3a39]"
                />
              </div>

              {/* Floating Element 1 - Top Right - Radar */}
              <div className="absolute -right-4 -top-8 z-20 w-[60%] sm:-right-8 sm:-top-12">
                <RevealWrapper origin="bottom" delay={600} duration={800} distance="30px">
                  <div className="flex items-center gap-3 rounded-xl border border-[#3d3a39] bg-[#101010]/95 p-3 backdrop-blur-md shadow-2xl">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d992] opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00d992]"></span>
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#f2f2f2]">Crawler Active</span>
                      <span className="text-[10px] text-[#00d992]">Scanning Nigerian portals...</span>
                    </div>
                  </div>
                </RevealWrapper>
              </div>

              {/* Floating Element 2 - Bottom Left - Alert */}
              <div className="absolute -bottom-6 -left-4 z-30 w-[65%] sm:-bottom-10 sm:-left-8">
                <RevealWrapper origin="top" delay={800} duration={800} distance="30px">
                  <div className="flex items-center gap-3 rounded-xl border border-[#ef4444]/40 bg-[#101010]/95 p-3 backdrop-blur-md shadow-2xl">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ef4444]/20 text-[#ef4444]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#f2f2f2]">Threat Alert</span>
                      <span className="text-[10px] text-[#ef4444]">Synthetic voice matched to profile.</span>
                    </div>
                  </div>
                </RevealWrapper>
              </div>

              {/* Floating Element 3 - UI Badge Top Left */}
              <div className="absolute top-1/3 -left-8 z-20 sm:-left-16">
                <RevealWrapper origin="right" delay={1000} duration={800} distance="30px">
                  <div className="flex items-center gap-3 rounded-full border border-[#00d992]/40 bg-[#101010]/90 px-4 py-2.5 backdrop-blur-md shadow-2xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span className="text-xs font-bold uppercase tracking-wide text-[#f2f2f2]">
                      Profile Secured
                    </span>
                  </div>
                </RevealWrapper>
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
