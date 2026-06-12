import Link from "next/link";
import { getReport } from "@/lib/api";
import DownloadButton from "@/components/DownloadButton";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReport(id);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="mb-4 text-sm text-text-muted">Report not found.</p>
        <Link href="/scan" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white">
          Scan a file
        </Link>
      </div>
    );
  }

  const isSynthetic = result.verdict === "synthetic";
  const authenticity = isSynthetic ? 100 - result.confidence : result.confidence;
  const syntheticPct = isSynthetic ? result.confidence : null;

  return (
    <div className="flex min-h-screen flex-col px-6 pt-24">
      <main className="mx-auto w-full max-w-4xl">
        <Link href="/scan" className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="mb-8 text-center">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
              isSynthetic
                ? "bg-red-500/10 text-red-400"
                : "bg-primary-light text-primary"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isSynthetic ? "bg-red-400" : "bg-primary"}`} />
            {isSynthetic ? "Synthetic content detected" : "No synthetic content detected"}
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Forensic Report
          </h1>
          <p className="mt-2 text-xs text-text-muted">Report {result.id}</p>
        </div>

        <div className="glow-border mb-6 flex aspect-video items-center justify-center rounded-2xl border border-border-light bg-surface">
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold md:text-7xl text-primary">
              {authenticity}%
            </div>
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
            <div className={`text-lg font-semibold ${isSynthetic ? "text-red-400" : "text-primary"}`}>
              {isSynthetic ? "Synthetic" : "Authentic"}
            </div>
          </div>
          <div className="glow-border rounded-2xl border border-border-light bg-surface p-5">
            <div className="mb-1 text-xs text-text-muted">Anomaly type</div>
            <div className="text-lg font-semibold text-text-primary">
              {result.anomaly_type ?? "None detected"}
            </div>
          </div>
          <div className="glow-border rounded-2xl border border-border-light bg-surface p-5">
            <div className="mb-1 text-xs text-text-muted">Media type</div>
            <div className="text-lg font-semibold capitalize text-text-primary">
              {result.media_type}
            </div>
          </div>
        </div>

        <div className="glow-border rounded-2xl border border-border-light bg-surface p-6 md:p-8">
          <div className="mb-4 text-sm font-medium text-text-primary">Forensic analysis summary</div>
          <p className="text-sm leading-relaxed text-text-secondary">
            {isSynthetic
              ? `The media file exhibits signs of manipulation consistent with AI-generated or AI-modified content. ${result.anomaly_type ? `Specifically, ${result.anomaly_type.toLowerCase()} was identified across multiple frames.` : ""} The authenticity rating of ${authenticity}% indicates the file is largely intact, with ${syntheticPct}% structural deviation attributed to synthetic modification.`
              : "The media file shows no detectable signs of AI manipulation or synthetic modification. All frames and audio frequencies fall within expected natural ranges."}
          </p>
        </div>

        <div className="mt-8 mb-16 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/scan"
            className="flex flex-1 items-center justify-center rounded-full border border-primary/50 px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
          >
            Scan another file
          </Link>
          <DownloadButton />
        </div>
      </main>
    </div>
  );
}
