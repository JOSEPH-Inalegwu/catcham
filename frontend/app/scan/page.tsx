"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { scanFile, scanUrl, scanVideoViaStorage, checkScanLimits, RateLimitError, type ScanResult, type ScanLimits } from "@/lib/api";
import Toast from "@/components/Toast";
import Header from "@/components/Header";
const dottedSvg = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%233d3a39' stroke-width='1.5' stroke-dasharray='2%2c 16' stroke-linecap='round' rx='8' /%3e%3c/svg%3e")`;

const MEDIA_RULES: { kind: "Image" | "Video" | "Audio"; exts: string[]; maxBytes: number }[] = [
  { kind: "Image", exts: ["jpg", "jpeg", "png", "webp", "gif", "bmp"], maxBytes: 10 * 1024 * 1024 },
  { kind: "Video", exts: ["mp4", "mov", "avi", "webm"], maxBytes: 100 * 1024 * 1024 },
  { kind: "Audio", exts: ["mp3", "wav", "m4a", "ogg"], maxBytes: 50 * 1024 * 1024 },
];

function classifyFile(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return MEDIA_RULES.find((rule) => rule.exts.includes(ext)) ?? null;
}

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [limits, setLimits] = useState<ScanLimits | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlPreviewFailed, setUrlPreviewFailed] = useState(false);

  const fetchLimits = useCallback(async () => {
    try {
      const l = await checkScanLimits();
      setLimits(l);
    } catch {
      setLimits({ remaining: 3, total: 3, window_end: null });
    }
  }, []);

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);

  const handleFile = useCallback((f: File) => {
    const rule = classifyFile(f.name);
    if (!rule) {
      setError("Unsupported file format. Upload an image (jpg, png, webp), video (mp4, mov, avi, webm), or audio (mp3, wav, m4a, ogg) file.");
      return;
    }
    if (f.size > rule.maxBytes) {
      setError(`File too large. ${rule.kind} files must be under ${Math.round(rule.maxBytes / (1024 * 1024))}MB.`);
      return;
    }
    if (rule.kind === "Video") {
      const url = URL.createObjectURL(f);
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (vid.duration > 60) {
          setError(`Video must be under 60 seconds. Your video is ${Math.round(vid.duration)}s.`);
        } else {
          setFile(f);
          setError(null);
          setResult(null);
          setPreview(url);
        }
      };
      vid.onerror = () => {
        URL.revokeObjectURL(url);
        setFile(f);
        setError(null);
        setResult(null);
        setPreview(url);
      };
      vid.src = url;
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(f));
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
      const expectedMs = file.type.startsWith("image/") ? 2000 : 15000;
      const pct = Math.min((elapsed / expectedMs) * 95, 95);
      setProgress(Math.round(pct));
    }, 50);

    try {
      const scanResult = file.type.startsWith("video/")
        ? await scanVideoViaStorage(file)
        : await scanFile(file);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(scanResult);
      setScanning(false);

      if (limits && limits.remaining > 0) {
        const updated = { ...limits, remaining: limits.remaining - 1 };
        setLimits(updated);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
      setProgress(0);

      if (err instanceof RateLimitError) {
        setLimits({ remaining: 0, total: 3, window_end: err.retryAfter });
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Scan failed");
      }
    }
  }, [file, scanning, limits, preview]);

  const startUrlScan = useCallback(async () => {
    const trimmed = urlInput.trim();
    if (!trimmed || scanning) return;

    if (!/^https?:\/\//i.test(trimmed)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }

    setScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 15000) * 95, 95);
      setProgress(Math.round(pct));
    }, 50);

    try {
      const scanResult = await scanUrl(trimmed);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(scanResult);
      setScanning(false);

      if (limits && limits.remaining > 0) {
        setLimits({ ...limits, remaining: limits.remaining - 1 });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
      setProgress(0);

      if (err instanceof RateLimitError) {
        setLimits({ remaining: 0, total: 3, window_end: err.retryAfter });
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Scan failed");
      }
    }
  }, [urlInput, scanning, limits]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const isSynthetic = result?.verdict === "synthetic";
  const isImage = file?.type.startsWith("image/");
  const isVideo = file?.type.startsWith("video/");
  const isAudio = file?.type.startsWith("audio/");
  const fileKind = file ? classifyFile(file.name)?.kind ?? "File" : null;
  const looksLikeImageUrl = /^https?:\/\/.+\.(jpe?g|png|webp|gif)(\?.*)?(#.*)?$/i.test(urlInput.trim());

  const allSources = result?.generation_sources ?? [];
  const audioPass = allSources.find(
    (s) => s.source === "not_ai_generated_audio"
  );

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-112px)] max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
          Public Scanner
        </p>
        <h1 className="mt-1 text-2xl font-normal tracking-[-0.6px] text-[#ffffff] sm:text-3xl">
          Check a file for synthetic content
        </h1>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ─── Upload Panel (Left) ─── */}
        <div className="rounded-[8px] border border-[#3d3a39] p-6">
          {!scanning && (
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-[8px] border border-[#3d3a39] p-1">
              <button
                onClick={() => { setMode("upload"); setError(null); }}
                className={`rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
                  mode === "upload" ? "bg-[#00d992] text-[#101010]" : "text-[#bdbdbd] hover:text-[#f2f2f2]"
                }`}
              >
                Upload file
              </button>
              <button
                onClick={() => { setMode("url"); setError(null); }}
                className={`rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
                  mode === "url" ? "bg-[#00d992] text-[#101010]" : "text-[#bdbdbd] hover:text-[#f2f2f2]"
                }`}
              >
                Scan by URL
              </button>
            </div>
          )}

          {mode === "upload" && !file && !scanning && (
            <div
              className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[8px] px-6 py-14 transition-colors hover:bg-[#1a1a1a]/50"
              style={{ backgroundImage: dottedSvg }}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bdbdbd"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-[#bdbdbd]">
                Drop a file here or click to browse
              </p>
              <p className="text-xs text-[#8b949e]">
                Supports video, image, and audio files
              </p>
            </div>
          )}

          {mode === "url" && (
            <div className="flex min-h-[300px] flex-col gap-4">
              <div>
                <label htmlFor="scan-url" className="text-xs font-semibold text-[#f2f2f2]">
                  Media URL
                </label>
                <input
                  id="scan-url"
                  type="url"
                  value={urlInput}
                  disabled={scanning}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlPreviewFailed(false);
                    setError(null);
                  }}
                  placeholder="Paste a direct image or video URL"
                  className="mt-2 w-full rounded-[6px] border border-[#3d3a39] bg-[#141414] px-4 py-3 text-sm text-[#f2f2f2] placeholder-[#8b949e] outline-none transition-colors focus:border-[#00d992] disabled:opacity-50"
                />
                <p className="mt-2 text-xs leading-5 text-[#8b949e]">
                  Tip: Right-click any image → Copy image address, then paste here.
                  <br />
                  Social media links (YouTube, Facebook, Instagram) are not supported —
                  download the file and upload it directly.
                </p>
              </div>

              {looksLikeImageUrl && urlInput.trim() && !urlPreviewFailed && (
                <div className="overflow-hidden rounded-[6px] border border-[#3d3a39]">
                  <img
                    src={urlInput.trim()}
                    alt="URL preview"
                    className="w-full object-contain"
                    style={{ maxHeight: "260px" }}
                    onError={() => setUrlPreviewFailed(true)}
                  />
                </div>
              )}
              {looksLikeImageUrl && urlInput.trim() && urlPreviewFailed && (
                <p className="text-xs text-[#8b949e]">
                  Preview unavailable. You can still scan this URL.
                </p>
              )}

              <button
                disabled={scanning || !urlInput.trim()}
                onClick={startUrlScan}
                className="mt-auto rounded-[6px] bg-[#00d992] px-4 py-2.5 text-sm font-semibold text-[#101010] transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {scanning ? "Scanning..." : "Start scan"}
              </button>
            </div>
          )}

          {mode === "upload" && file && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#f2f2f2]">
                {fileKind} selected: <span className="font-normal text-[#a1a1aa]">{file.name}</span>
              </p>
              <div className="relative overflow-hidden rounded-[6px]">
                {isImage && preview && (
                  <img
                    src={preview}
                    alt={file.name}
                    className="h-full w-full object-contain"
                    style={{ maxHeight: "350px" }}
                  />
                )}
                {isVideo && preview && (
                  <video
                    src={preview}
                    className="h-full w-full"
                    style={{ maxHeight: "350px" }}
                    controls
                  />
                )}
                {isAudio && preview && (
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                    <audio src={preview} controls className="w-full" />
                    <p className="text-sm text-[#bdbdbd]">{file.name}</p>
                  </div>
                )}
                {!isImage && !isVideo && !isAudio && (
                  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bdbdbd"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    <p className="text-sm text-[#bdbdbd]">{file.name}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 flex-1 rounded-[6px] border border-[#3d3a39] px-4 py-2 text-sm font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload
                </button>
                <button
                  disabled={scanning}
                  onClick={startScan}
                  className="flex-1 rounded-[6px] bg-[#00d992] px-4 py-2 text-sm font-semibold text-[#101010] transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {scanning ? "Scanning..." : "Start scan"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <Toast message={error} onClose={() => setError(null)} />
          )}

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
        </div>

        {/* ─── Result Panel (Right) ─── */}
        <div className="max-h-[500px] overflow-y-auto rounded-[8px] border border-[#3d3a39] p-6">
          {!result && !scanning && (
            <div className="text-right">
              <p className="text-sm font-semibold text-[#f2f2f2]">Result</p>
            </div>
          )}

          {scanning && !result && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
              <div className="relative flex items-center justify-center">
                <svg width="72" height="72" viewBox="0 0 72 72" className="animate-spin-slow">
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke="#3d3a39"
                    strokeWidth="3"
                  />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke="#00d992"
                    strokeWidth="3"
                    strokeDasharray={`${(progress / 100) * 188.5} 188.5`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                    className="transition-all duration-100"
                  />
                </svg>
                <span className="absolute text-sm font-semibold text-[#f2f2f2]">
                  {progress}%
                </span>
              </div>
              <p className="text-sm text-[#bdbdbd]">
                Checking for manipulation...
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">Verdict</span>
                <span
                  className={`text-sm font-semibold ${isSynthetic ? "text-[#f87171]" : "text-[#00d992]"
                    }`}
                >
                  {isSynthetic ? "Synthetic" : "Authentic"}
                </span>
              </div>
              <div className="h-px bg-[#3d3a39]" />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-[#8b949e]">Confidence</span>
                  <span className="text-sm font-semibold text-[#f2f2f2]">
                    {result.confidence}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3d3a39]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${result.confidence}%`,
                      backgroundColor: isSynthetic ? "#f87171" : "#00d992",
                    }}
                  />
                </div>
              </div>
              <div className="h-px bg-[#3d3a39]" />

              {result.anomaly_type && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8b949e]">Detection</span>
                    <span
                      className={`text-sm font-semibold ${isSynthetic ? "text-[#f87171]" : "text-[#00d992]"
                        }`}
                    >
                      {result.anomaly_type}
                    </span>
                  </div>
                  <div className="h-px bg-[#3d3a39]" />
                </>
              )}

              {result.classification_tag && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8b949e]">Classification</span>
                    <span
                      className={`rounded-[4px] px-2 py-0.5 text-xs font-semibold ${result.classification_tag === "Full Synthetic Generation"
                        ? "bg-[#f87171]/20 text-[#f87171]"
                        : result.classification_tag?.includes("Edited")
                          ? "bg-[#fbbf24]/20 text-[#fbbf24]"
                          : "bg-[#00d992]/20 text-[#00d992]"
                        }`}
                    >
                      {result.classification_tag}
                    </span>
                  </div>
                  <div className="h-px bg-[#3d3a39]" />
                </>
              )}

              <div>
                <span className="mb-3 block text-sm text-[#8b949e]">
                  Generation Sources
                </span>
                <div className="rounded-[6px] border border-[#3d3a39] divide-y divide-[#3d3a39]">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm font-semibold text-[#f2f2f2]">
                      AI-Generated
                    </span>
                    <span className="font-mono text-sm font-bold text-[#f2f2f2]">
                      {result.ai_generated_score}
                    </span>
                  </div>
                  {allSources.map((s) => (
                    <div
                      key={s.source}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span className="text-sm text-[#a1a1aa]">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#f2f2f2]">
                        {s.probability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px bg-[#3d3a39]" />

              {result.media_type === "video" && audioPass && (
                <>
                  <div>
                    <span className="mb-3 block text-sm text-[#8b949e]">
                      Safety Verification Pass
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 rounded-[6px] border border-[#3d3a39] bg-[#141414] px-3 py-2.5">
                        <svg
                          width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="#00d992" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#f2f2f2]">Audio</span>
                          <span className="text-[10px] text-[#a1a1aa]">
                            {audioPass.label}
                          </span>
                        </div>
                      </div>
                    </div>
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
      </div>
    </main>

    </>
  );
}
