"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function Dropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  title,
  description,
  onClick,
}: {
  href: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 transition-colors hover:bg-bg-primary"
    >
      <div className="text-sm font-medium text-text-primary">{title}</div>
      <div className="mt-0.5 text-xs text-text-muted">{description}</div>
    </Link>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function close() { setIsOpen(false); setOpenMobileSection(null); }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-light bg-bg-primary/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary" onClick={close}>
            Catch<span className="text-primary">Am</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Dropdown
              label="Product"
            >
              <DropdownLink
                href="/scan"
                title="Scanner"
                description="Upload a file or paste a link. Get a result."
                onClick={() => setOpen(false)}
              />
              <DropdownLink
                href="/pro"
                title="Pro Credits"
                description="10 forensic reports for NGN 8,000."
                onClick={() => setOpen(false)}
              />
              <DropdownLink
                href="/enterprise"
                title="Enterprise"
                description="24/7 monitoring for brands and organisations."
                onClick={() => setOpen(false)}
              />
            </Dropdown>

            <Dropdown
              label="Company"
            >
              <DropdownLink
                href="#about"
                title="About"
                description="The team and mission behind CatchAm."
                onClick={() => setOpen(false)}
              />
              <DropdownLink
                href="#contact"
                title="Contact"
                description="Get in touch with the team."
                onClick={() => setOpen(false)}
              />
              <DropdownLink
                href="#privacy"
                title="Privacy Policy"
                description="How we handle your data."
                onClick={() => setOpen(false)}
              />
            </Dropdown>

            <Link href="/auth/login" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              Log in
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
        <div className="fixed inset-0 z-40 flex flex-col bg-bg-primary/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <button
              onClick={() => setOpenMobileSection(openMobileSection === "product" ? null : "product")}
              className="flex items-center gap-2 text-2xl font-medium text-text-primary transition-colors hover:text-primary"
            >
              Product
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${openMobileSection === "product" ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMobileSection === "product" && (
              <div className="flex flex-col items-center gap-4 pb-4">
                <Link href="/scan" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  Scanner
                </Link>
                <Link href="/pro" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  Pro Credits
                </Link>
                <Link href="/enterprise" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  Enterprise
                </Link>
              </div>
            )}

            <button
              onClick={() => setOpenMobileSection(openMobileSection === "company" ? null : "company")}
              className="flex items-center gap-2 text-2xl font-medium text-text-primary transition-colors hover:text-primary"
            >
              Company
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${openMobileSection === "company" ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMobileSection === "company" && (
              <div className="flex flex-col items-center gap-4 pb-4">
                <Link href="#about" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  About
                </Link>
                <Link href="#contact" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  Contact
                </Link>
                <Link href="#privacy" onClick={close} className="text-lg text-text-secondary transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </div>
            )}

            <Link href="/auth/login" onClick={close} className="mt-2 text-2xl font-medium text-text-primary transition-colors hover:text-primary">
              Log in
            </Link>
            <Link href="/scan" onClick={close} className="mt-4 rounded-full bg-primary px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90">
              Scan a File
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
