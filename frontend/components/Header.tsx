"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";

const freeLinks = [
  { label: "Features", href: "/#features" },
];

const proLinks = [
  { label: "Features", href: "/enterprise#features" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/enterprise#pricing" },
];

export default function Header() {
  const { mode, toggle, setMode } = useMode();

  const links = mode === "free" ? freeLinks : proLinks;
  const ctaHref = mode === "free" ? "/scan" : "/enterprise";
  const ctaLabel = mode === "free" ? "Start Scanning" : "Get Started";

  return (
    <header className="sticky top-0 z-50 border-b border-[#3d3a39] bg-[#101010]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-[#f2f2f2]">
              Catch<span className="text-[#00d992]">Am</span>
            </span>
          </Link>

          <div className="flex items-center rounded-full border border-[#3d3a39] bg-[#101010] p-0.5">
            <button
              onClick={() => setMode("free")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                mode === "free"
                  ? "bg-[#00d992] text-[#101010]"
                  : "text-[#bdbdbd] hover:text-[#f2f2f2]"
              }`}
            >
              Free Scan
            </button>
            <button
              onClick={() => setMode("pro")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                mode === "pro"
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
    </header>
  );
}
