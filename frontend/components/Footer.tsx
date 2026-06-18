"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";

export default function Footer() {
  const { mode } = useMode();

  return (
    <footer className="border-t border-[#3d3a39] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="text-sm font-semibold tracking-tight text-[#f2f2f2]">
              Catch<span className="text-[#00d992]">Am</span>
            </Link>
            <p className="mt-1.5 text-xs text-[#a0a0a0]">
              Your shield against synthetic identity fraud
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[1px] text-[#5a5a5a]">
                Product
              </span>
              <nav className="mt-3 flex flex-row gap-4 text-sm text-[#a0a0a0]">
                {mode === "pro" ? (
                  <>
                    <a href="#features" className="transition-colors hover:text-[#f2f2f2]">
                      Features
                    </a>
                    <a href="#enterprise-target" className="transition-colors hover:text-[#f2f2f2]">
                      Enterprise
                    </a>
                    <a href="#pricing" className="transition-colors hover:text-[#f2f2f2]">
                      Pricing
                    </a>
                  </>
                ) : (
                  <>
                    <Link href="/scan" className="transition-colors hover:text-[#f2f2f2]">
                      Scanner
                    </Link>
                    <Link href="/#features" className="transition-colors hover:text-[#f2f2f2]">
                      Features
                    </Link>
                    <Link href="/#how-it-works" className="transition-colors hover:text-[#f2f2f2]">
                      How It Works
                    </Link>
                  </>
                )}
              </nav>
            </div>

          </div>
        </div>
        <div className="mt-10 border-t border-[#3d3a39] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-xs text-[#5a5a5a]">
              &copy; {new Date().getFullYear()} CatchAm AI. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#5a5a5a]">
              <Link href="/privacy" className="transition-colors hover:text-[#a0a0a0]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-[#a0a0a0]">
                Terms of Service
              </Link>
              <Link href="/data-policy" className="transition-colors hover:text-[#a0a0a0]">
                Data Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
