"use client";

import Link from "next/link";
import { RevealWrapper } from 'next-reveal';

export default function FreeHero() {
  return (
    <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-6">
        <RevealWrapper origin="left" delay={100} duration={800} distance="40px">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-normal leading-[1.05] tracking-[-0.65px] text-[#ffffff] sm:text-6xl lg:text-[60px] lg:leading-[64px]">
              Your eyes can miss a deepfake.
              <br />
              <span className="text-[#00d992]">Our engines cannot.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#bdbdbd] lg:mx-0">
              AI-generated deepfake videos and images easily bypass standard bank security checks.
              Upload a file to our free scanner and know if it is real or fake before it is too late.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/scan"
                className="rounded-[6px] bg-[#00d992] px-6 py-3 text-base font-semibold text-[#101010] transition-opacity hover:opacity-90"
              >
                Scan a file
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-[6px] border border-[#3d3a39] px-6 py-3 text-base font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
              >
                Explore Pro Tier
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
                  src="/hero.jpg"
                  alt="CatchAm AI hero"
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl border border-[#3d3a39]"
                />
              </div>

              {/* Floating Element 1 - Top Right */}
              <div className="absolute -right-4 -top-8 z-20 w-[45%] sm:-right-8 sm:-top-12">
                <RevealWrapper origin="bottom" delay={600} duration={800} distance="30px">
                  <div className="rounded-xl border border-[#3d3a39] bg-[#141414] p-1.5 shadow-2xl">
                    <img
                      src="/ai_voice2.jpg"
                      alt="Voice Analysis"
                      className="h-auto w-full rounded-lg object-cover"
                    />
                  </div>
                </RevealWrapper>
              </div>

              {/* Floating Element 2 - Bottom Left */}
              <div className="absolute -bottom-6 -left-4 z-20 w-[45%] sm:-bottom-10 sm:-left-8">
                <RevealWrapper origin="top" delay={800} duration={800} distance="30px">
                  <div className="rounded-xl border border-[#3d3a39] bg-[#141414] p-1.5 shadow-2xl">
                    <img
                      src="/face_swap1.jpg"
                      alt="Face Swap Detection"
                      className="h-auto w-full rounded-lg object-cover"
                    />
                  </div>
                </RevealWrapper>
              </div>

              {/* Floating Element 3 - UI Badge Top Left */}
              <div className="absolute top-1/3 -left-8 z-30 sm:-left-16">
                <RevealWrapper origin="right" delay={1000} duration={800} distance="30px">
                  <div className="flex items-center gap-3 rounded-full border border-[#00d992]/40 bg-[#101010]/90 px-4 py-2.5 backdrop-blur-md shadow-2xl">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d992] opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00d992]"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-[#f2f2f2]">
                      Fake Detected
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
