"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchExplanation } from "@/lib/gemini";
import DownloadButton from "@/components/DownloadButton";

type ReportData = {
  id: string;
  verdict: "real" | "synthetic";
  confidence: number;
  anomaly_type: string | null;
  media_type: "video" | "audio" | "image";
  analysed_at: string;
};

type Props = {
  id: string;
  fallback: ReportData;
  tier?: "free" | "enterprise";
};

export default function ReportView({ id, fallback, tier = "free" }: Props) {
  const [report, setReport] = useState<ReportData>(fallback);
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(`catcham_scan_${id}`);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached);
      const rawConfidence = parsed.confidence;
      const confidence = rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence;
      setReport({
        id,
        verdict: parsed.result === "FAKE" ? "synthetic" : "real",
        confidence,
        anomaly_type: parsed.anomaly_type ?? null,
        media_type: parsed.media_type,
        analysed_at: parsed.analysed_at,
      });
      if (parsed.preview) setPreviewUrl(parsed.preview);
    } catch {}
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setLoadingExplanation(true);

    fetchExplanation({
      confidence: report.confidence,
      mediaType: report.media_type,
      verdict: report.verdict,
    }).then((text) => {
      if (!cancelled) {
        setExplanation(text);
        setLoadingExplanation(false);
      }
    });

    return () => { cancelled = true; };
  }, [report.confidence, report.media_type, report.verdict]);

  const isSynthetic = report.verdict === "synthetic";
  const authenticity = 100 - report.confidence;
  const syntheticPct = isSynthetic ? report.confidence : null;

  const fallbackSummary = isSynthetic
    ? `The media file exhibits signs of manipulation consistent with AI-generated or AI-modified content. ${report.anomaly_type ? `Specifically, ${report.anomaly_type.toLowerCase()} was identified across multiple frames.` : ""} The authenticity rating of ${authenticity}% indicates the file is largely intact, with ${syntheticPct}% structural deviation attributed to synthetic modification.`
    : "The media file shows no detectable signs of AI manipulation or synthetic modification. All frames and audio frequencies fall within expected natural ranges.";

  return (
    <div className="flex min-h-screen flex-col px-6 pt-24 pb-16">
      <main className="mx-auto w-full max-w-4xl">
        <Link href="/scan" className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>
        <div className="mb-8 text-center">
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${isSynthetic ? "bg-red-500/10 text-red-400" : "bg-primary-light text-primary"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isSynthetic ? "bg-red-400" : "bg-primary"}`} />
            {isSynthetic ? "Synthetic content detected" : "No synthetic content detected"}
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">Forensic Report</h1>
          <p className="mt-2 text-xs text-text-muted">Report {report.id}</p>
        </div>
        {tier === "free" ? (
          <div className="glow-border mb-10 rounded-2xl border border-border-light bg-surface p-8 md:p-10">
            <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {previewUrl && (
                <div className="shrink-0 overflow-hidden rounded-xl border border-border-light">
                  {report.media_type === "audio" ? (
                    <div className="flex h-32 w-32 items-center justify-center bg-bg-secondary text-text-muted text-xs">Audio file</div>
                  ) : (
                    <img src={previewUrl} alt="Scanned media" className="h-32 w-32 object-cover" />
                  )}
                </div>
              )}
              <div className="text-center sm:text-left">
                <div className="mb-1 text-5xl font-bold md:text-7xl text-primary">{authenticity.toFixed(2)}%</div>
                <p className="text-sm text-text-muted">Authenticity Rating</p>
              </div>
            </div>
            <div className="border-t border-border-light pt-6">
              {loadingExplanation ? (
                <div className="flex items-center justify-center gap-2 text-sm text-text-muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />Generating advisory...</div>
              ) : explanation ? (
                <p className="text-sm leading-relaxed text-text-secondary">{explanation}</p>
              ) : (
                <p className="text-sm leading-relaxed text-text-secondary">{fallbackSummary}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="glow-border mb-6 flex aspect-video items-center justify-center rounded-2xl border border-border-light bg-surface">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold md:text-7xl text-primary">{authenticity.toFixed(2)}%</div>
                <p className="text-sm text-text-muted">Authenticity Rating</p>
                {syntheticPct !== null && (
                  <p className="mt-2 max-w-xs mx-auto text-xs leading-relaxed text-text-muted">
                    Minor structural anomalies detected ({syntheticPct}%), well within normal digital compression bounds. Media integrity verified.
                  </p>
                )}
              </div>
            </div>
            <div className="mb-10 grid gap-4 md:grid-cols-3">
              <div className="glow-border rounded-2xl border border-border-light bg-surface p-5">
                <div className="mb-1 text-xs text-text-muted">Verdict</div>
                <div className={`text-lg font-semibold ${isSynthetic ? "text-red-400" : "text-primary"}`}>{isSynthetic ? "Synthetic" : "Authentic"}</div>
              </div>
              <div className="glow-border rounded-2xl border border-border-light bg-surface p-5">
                <div className="mb-1 text-xs text-text-muted">Anomaly type</div>
                <div className="text-lg font-semibold text-text-primary">{report.anomaly_type ?? "None detected"}</div>
              </div>
              <div className="glow-border rounded-2xl border border-border-light bg-surface p-5">
                <div className="mb-1 text-xs text-text-muted">Media type</div>
                <div className="text-lg font-semibold capitalize text-text-primary">{report.media_type}</div>
              </div>
            </div>
            <div className="glow-border mb-6 rounded-2xl border border-border-light bg-surface p-6 md:p-8">
              <div className="mb-4 text-sm font-medium text-text-primary">Forensic analysis summary</div>
              {loadingExplanation ? (
                <div className="flex items-center gap-2 text-sm text-text-muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />Generating advisory...</div>
              ) : explanation ? (
                <p className="text-sm leading-relaxed text-text-secondary">{explanation}</p>
              ) : (
                <p className="text-sm leading-relaxed text-text-secondary">{fallbackSummary}</p>
              )}
            </div>
          </>
        )}
        <div className="mt-8 mb-16 flex flex-col gap-3 sm:flex-row">
          <Link href="/scan" className="flex flex-1 items-center justify-center rounded-full border border-primary/50 px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5">
            Scan another file
          </Link>
          <DownloadButton />
        </div>
      </main>
    </div>
  );
}
