"use client";

import Link from "next/link";
import { useState, useRef, type DragEvent } from "react";
import { scanMedia } from "@/app/actions/scan";

const MAX_SIZE = 20 * 1024 * 1024;

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 20MB.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleScan() {
    if (!file) return;
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    const response = await scanMedia(formData);

    setResult(response);
    setLoading(false);
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pt-24 md:pt-28">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="mb-2 text-center text-2xl font-semibold md:text-3xl">
          Scan a file
        </h1>
        <p className="mb-10 text-center text-sm text-text-muted">
          Upload a video or audio file for deepfake analysis.
        </p>

        {!result && (
          <>
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`glow-border flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border-light hover:border-primary/50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                name="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="mb-1 text-sm font-medium text-text-primary">
                Drop a file here or click to browse
              </p>
              <p className="text-xs text-text-muted">Images or video up to 20MB</p>
              {file && (
                <p className="mt-3 text-xs font-medium text-primary">{file.name}</p>
              )}
            </div>

            <button
              onClick={handleScan}
              disabled={!file || loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing Matrices...
                </span>
              ) : (
                "Run Scan"
              )}
            </button>
          </>
        )}

        {result && (
          <div className="glow-border rounded-2xl border border-border-light bg-surface p-6 md:p-8">
            {result.error ? (
              <div className="text-center">
                <p className="text-sm text-red-400">Error: {result.error}</p>
                <button
                  onClick={reset}
                  className="mt-4 rounded-full border border-primary/50 px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col items-center gap-4 text-center">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
                      result.result === "FAKE"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-primary-light text-primary"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        result.result === "FAKE" ? "bg-red-400" : "bg-primary"
                      }`}
                    />
                    {result.result === "FAKE" ? "Synthetic content detected" : "No synthetic content detected"}
                  </span>
                  <div className={`text-3xl font-semibold md:text-4xl ${result.result === "FAKE" ? "text-red-400" : "text-primary"}`}>
                    {result.result === "FAKE" ? "Synthetic" : "Authentic"}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                    <span>Confidence score</span>
                    <span className="font-medium text-text-primary">
                      {(result.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.result === "FAKE" ? "bg-red-400" : "bg-primary"
                      }`}
                      style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>

                <div className="mb-6 text-xs text-text-muted">ID: {result.prediction_id}</div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-full border border-primary/50 px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    Scan another file
                  </button>
                  <Link
                    href={`/report/${result.prediction_id}`}
                    className="flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    View full report
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
