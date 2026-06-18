"use client";

import Link from "next/link";
import { RevealWrapper } from 'next-reveal';

export default function CtaBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
          <div className="rounded-[8px] border border-[#3d3a39] bg-[#141414] px-6 py-14 text-center sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              Try It Now
            </p>
            <h2 className="mx-auto mt-2 max-w-xl text-2xl font-normal text-[#ffffff] sm:text-3xl">
              Upload a file and know if it is real or fake in seconds
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[#a0a0a0]">
              No account needed. Your files are never stored.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/scan"
                className="rounded-[6px] bg-[#00d992] px-6 py-3 text-base font-semibold text-[#101010] transition-opacity hover:opacity-90"
              >
                Scan a file
              </Link>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
