"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";

const freeLinks = [
  { label: "Features", href: "/#features" },
];

const proLinks = [
  { label: "Features", href: "#features" },
  { label: "Enterprise", href: "#enterprise-target" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const { mode, toggle, setMode } = useMode();

  const links = mode === "free" ? freeLinks : proLinks;
  const ctaHref = mode === "free" ? "/scan" : "/auth/signup";
  const ctaLabel = mode === "free" ? "Start Scanning" : "Get Started";

  return (
    <div className="h-28">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#3d3a39] bg-[#101010]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1">
              <img src="/logo (2).png" alt="CatchAm Logo" className="h-10 w-auto" />
              <span className="text-lg font-bold tracking-tight text-[#f2f2f2]">
                CatchAm
              </span>
            </Link>

            <div className="flex items-center rounded-full border border-[#3d3a39] bg-[#101010] p-0.5">
              <button
                onClick={() => setMode("free")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${mode === "free"
                  ? "bg-[#00d992] text-[#101010]"
                  : "text-[#bdbdbd] hover:text-[#f2f2f2]"
                  }`}
              >
                Free Scan
              </button>
              <button
                onClick={() => setMode("pro")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors hidden ${mode === "pro"
                  ? "bg-[#00d992] text-[#101010]"
                  : "text-[#bdbdbd] hover:text-[#f2f2f2]"
                  }`}
              >
                Pro Scan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#bdbdbd] transition-colors hover:text-[#f2f2f2]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {mode === "pro" && (
              <Link
                href="/auth/login"
                className="hidden text-sm text-[#bdbdbd] transition-colors hover:text-[#f2f2f2] md:block"
              >
                Login
              </Link>
            )}

            <Link
              href={ctaHref}
              className="rounded-[6px] bg-[#00d992] px-4 py-1.5 text-sm font-semibold text-[#101010] transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
        <div className="border-t border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1.5 text-center">
          <p className="text-xs font-medium text-[#f59e0b]">
            Advanced forensic analysis coming soon.
          </p>
        </div>
      </header>
    </div>
  );
}
