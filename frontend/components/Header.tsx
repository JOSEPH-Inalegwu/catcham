"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function close() { setIsOpen(false); }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-light bg-bg-primary/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary" onClick={close}>
            Catch<span className="text-primary">Am</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/scan" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              Scanner
            </Link>
            <Link href="/dashboard" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              Enterprise
            </Link>
            <Link href="/scan" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Scan a File
            </Link>
          </nav>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className={`h-0.5 w-5 rounded-full bg-text-primary transition-all duration-200 ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-text-primary transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-text-primary transition-all duration-200 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg-primary/95 backdrop-blur-lg md:hidden">
          <Link href="/scan" onClick={close} className="text-2xl font-medium text-text-primary transition-colors hover:text-primary">
            Scanner
          </Link>
          <Link href="/dashboard" onClick={close} className="text-2xl font-medium text-text-primary transition-colors hover:text-primary">
            Enterprise
          </Link>
          <Link href="/scan" onClick={close} className="mt-4 rounded-full bg-primary px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90">
            Scan a File
          </Link>
        </div>
      )}
    </>
  );
}
