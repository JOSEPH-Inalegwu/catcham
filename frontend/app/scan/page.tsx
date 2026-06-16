"use client";

import { useState, useRef, useCallback } from "react";
import { scanFile, type ScanResult } from "@/lib/api";

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setError(null);
    setResult(null);
  }, []);

  const startScan = useCallback(async () => {
    if (!file || scanning) return;

    setScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 2000) * 95, 95);
      setProgress(Math.round(pct));
    }, 50);

    try {
      const scanResult = await scanFile(file);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(scanResult);
      setScanning(false);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Scan failed");
      setScanning(false);
      setProgress(0);
    }
  }, [file, scanning]);

  const isSynthetic = result?.verdict === "synthetic";

  return (
    <main className="mx-auto min-h-[calc(100vh-56px)] max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
          Public Scanner
        </p>
        <h1 className="mt-1 text-2xl font-normal tracking-[-0.6px] text-[#ffffff] sm:text-3xl">
          Check a file for synthetic content
        </h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ─── Result Panel ─── */}
        <div className="order-2 rounded-[8px] border border-[#3d3a39] p-6 lg:order-1">
          {!result && !scanning && (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <p className="text-sm text-[#8b949e]">
                Upload a file and scan to see results
              </p>
            </div>
          )}

          {scanning && !result && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4">
              <div className="relative h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#3d3a39]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#00d992] transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[#bdbdbd]">
                Checking for manipulation... {progress}%
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Verdict</span>
                <span
                  className={`text-sm font-semibold ${
                    isSynthetic ? "text-[#00d992]" : "text-[#f2f2f2]"
                  }`}
                >
                  {isSynthetic ? "Synthetic" : "Authentic"}
                </span>
              </div>

              <div className="h-px bg-[#3d3a39]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Confidence</span>
                <span className="text-sm font-semibold text-[#f2f2f2]">
                  {result.confidence}%
                </span>
              </div>

              <div className="h-px bg-[#3d3a39]" />

              {result.anomaly_type && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8b949e]">Anomaly</span>
                    <span className="text-sm font-semibold text-[#f2f2f2]">
                      {result.anomaly_type}
                    </span>
                  </div>
                  <div className="h-px bg-[#3d3a39]" />
                </>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Media type</span>
                <span className="text-sm font-semibold capitalize text-[#f2f2f2]">
                  {result.media_type}
                </span>
              </div>

              <div className="h-px bg-[#3d3a39]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Report ID</span>
                <span className="text-sm font-semibold text-[#f2f2f2]">
                  {result.id}
                </span>
              </div>

              <div className="h-px bg-[#3d3a39]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Analysed at</span>
                <span className="text-sm font-semibold text-[#f2f2f2]">
                  {new Date(result.analysed_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Upload Panel ─── */}
        <div className="order-1 lg:order-2">
          <div
            className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dotted border-[#3d3a39] px-6 py-16 transition-all duration-300 hover:border-[#00d992]/50"
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

          {!scanning ? (
            <button
              disabled={!file}
              onClick={startScan}
              className="mt-4 h-11 w-full rounded-[6px] border border-[#3d3a39] text-sm font-semibold text-[#f2f2f2] transition-all duration-200 hover:border-[#bdbdbd] disabled:opacity-30"
            >
              Scan file
            </button>
          ) : null}

          {error && (
            <p className="mt-4 text-sm text-[#8b949e]">{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}
