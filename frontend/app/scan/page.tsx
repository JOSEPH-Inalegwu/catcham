"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { scanFile } from "@/lib/api";

export default function ScanPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setError(null);
  }, []);

  const startScan = useCallback(async () => {
    if (!file || scanning) return;

    setScanning(true);
    setProgress(0);
    setError(null);

    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 2000) * 95, 95);
      setProgress(Math.round(pct));
    }, 50);

    try {
      const result = await scanFile(file);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        router.push(`/report/${result.id}`);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Scan failed");
      setScanning(false);
      setProgress(0);
    }
  }, [file, scanning, router]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-lg flex-col items-center justify-center px-4 sm:px-6">
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
          Public Scanner
        </p>
      </div>

      <h1 className="text-center text-2xl font-normal tracking-[-0.6px] text-[#ffffff] sm:text-3xl">
        Check a file for synthetic content
      </h1>

      <div
        className="group relative mt-10 flex w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dotted border-[#3d3a39] px-6 py-16 transition-all duration-300 hover:border-[#00d992]/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "#00d992";
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = "#3d3a39";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[8px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: "inset 0 0 30px rgba(0, 217, 146, 0.06)",
          }}
        />
        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*,image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#bdbdbd"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 transition-colors duration-300 group-hover:stroke-[#00d992]"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-[#bdbdbd] transition-colors duration-300 group-hover:text-[#f2f2f2]">
          {file ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00d992]" />
              {file.name}
            </span>
          ) : (
            "Drop a file here or click to browse"
          )}
        </p>
        {!file && (
          <p className="mt-2 text-xs text-[#8b949e]">
            Supports video, image, and audio files
          </p>
        )}
      </div>

      <div className="mt-8 h-11 w-full max-w-xs">
        {scanning ? (
          <div className="relative flex h-full w-full items-center overflow-hidden rounded-[6px] border border-[#3d3a39] bg-[#101010]">
            <div
              className="absolute inset-y-0 left-0 rounded-[6px] transition-all duration-100"
              style={{
                width: `${progress}%`,
                backgroundColor: "#00d992",
              }}
            />
            <span className="relative z-10 w-full text-center text-sm font-semibold text-[#f2f2f2]">
              {progress < 95
                ? `Checking for manipulation... ${progress}%`
                : `Analysing with model... ${progress}%`}
            </span>
          </div>
        ) : (
          <button
            disabled={!file}
            onClick={startScan}
            className="h-full w-full rounded-[6px] border border-[#3d3a39] text-sm font-semibold text-[#f2f2f2] transition-all duration-200 hover:border-[#bdbdbd] disabled:opacity-30"
          >
            Scan file
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#8b949e]">{error}</p>
      )}
    </main>
  );
}
