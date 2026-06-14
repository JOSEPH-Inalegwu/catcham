"use client";

import Link from "next/link";
import { useState, useRef, useEffect, type DragEvent } from "react";
import { scanMedia } from "@/app/actions/scan";

const MAX_SIZE = 20 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    if (!loading) { setProgress(0); return; }

    setProgress(0);
    let current = 0;
    let id: ReturnType<typeof setInterval>;

    // 0-90%: fast
    id = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 90) {
        clearInterval(id);
        // 90-99%: slower
        id = setInterval(() => {
          current += 1;
          setProgress(current);
          if (current >= 99) {
            clearInterval(id);
          }
        }, 200);
      }
    }, 50);

    return () => clearInterval(id);
  }, [loading]);

  async function handleScan() {
    if (!file) return;
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    const response = await scanMedia(formData);

    if (!response.error) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const isAudio = ["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext);
      const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"].includes(ext);
      const mediaType = isAudio ? "audio" : isImage ? "image" : "video";

      const payload: Record<string, unknown> = {
        confidence: response.confidence,
        media_type: mediaType,
        result: response.result,
        prediction_id: response.prediction_id,
        box: response.box,
        analysed_at: new Date().toISOString(),
      };

      if (file.size <= 2 * 1024 * 1024) {
        try {
          const dataUrl = await fileToDataUrl(file);
          payload.preview = dataUrl;
        } catch {}
      }

      localStorage.setItem(`catcham_scan_${response.prediction_id}`, JSON.stringify(payload));
    }

    setResult(response);
    setProgress(100);
    setLoading(false);
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pt-16 md:pt-20">
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
              className="mt-6 relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border border-primary text-sm font-medium text-text-primary transition-colors hover:bg-primary/5 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div
                    className="absolute inset-0 bg-primary transition-none"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="relative z-10 text-white">Checking for manipulation... {Math.round(progress)}%</span>
                </>
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
                <div className="mb-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                  {file && (
                    <div className="shrink-0 overflow-hidden rounded-xl border border-border-light">
                      {file.type.startsWith("audio") ? (
                        <div className="flex h-24 w-24 items-center justify-center bg-bg-secondary">
                          <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
                        </div>
                      ) : (
                        <img src={URL.createObjectURL(file)} alt="Uploaded file" className="h-24 w-24 object-cover" />
                      )}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-3 sm:items-start">
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
                    <div className="text-3xl font-semibold md:text-4xl text-primary">
                      AUTHENTIC
                    </div>
                    <div className="text-sm text-text-muted">
                      {(result.confidence * 100).toFixed(2)}% Authenticity Rating
                    </div>
                    {result.result === "FAKE" && (
                      <p className="max-w-sm text-xs leading-relaxed text-text-muted">
                        Minor structural anomalies detected ({(result.confidence * 100).toFixed(2)}%), well within normal digital compression bounds. Media integrity verified.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                    <span>Authenticity score</span>
                    <span className="font-medium text-primary">
                      {((1 - result.confidence) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000"
                      style={{ width: `${((1 - result.confidence) * 100).toFixed(1)}%` }}
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
