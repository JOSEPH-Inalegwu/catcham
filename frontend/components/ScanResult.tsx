import Link from "next/link";
import type { ScanResult as ScanResultType } from "@/lib/api";

export default function ScanResult({
  result,
  onReset,
}: {
  result: ScanResultType;
  onReset: () => void;
}) {
  const isSynthetic = result.verdict === "synthetic";

  return (
    <div className="glow-border mb-16 rounded-2xl border border-border-light bg-surface p-6 md:p-8">
      <div className="mb-6 flex flex-col items-center gap-4 text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
            isSynthetic
              ? "bg-red-500/10 text-red-400"
              : "bg-primary-light text-primary"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isSynthetic ? "bg-red-400" : "bg-primary"}`} />
          {isSynthetic ? "Synthetic content detected" : "No synthetic content detected"}
        </div>
        <div className="text-3xl font-semibold md:text-4xl">
          {isSynthetic ? "Synthetic" : "Authentic"}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>Confidence score</span>
          <span className="font-medium text-text-primary">{result.confidence}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-bg-secondary">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isSynthetic ? "bg-red-400" : "bg-primary"
            }`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <div className="mb-6 grid gap-3 text-sm">
        <div className="flex justify-between border-b border-border-light pb-2">
          <span className="text-text-muted">Anomaly type</span>
          <span className="font-medium text-text-primary">
            {result.anomaly_type ?? "None detected"}
          </span>
        </div>
        <div className="flex justify-between border-b border-border-light pb-2">
          <span className="text-text-muted">Media type</span>
          <span className="font-medium capitalize text-text-primary">{result.media_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Report ID</span>
          <span className="font-mono text-xs text-text-primary">{result.id}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onReset}
          className="flex-1 rounded-full border border-primary/50 px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
        >
          Scan another file
        </button>
        <Link
          href={`/report/${result.id}`}
          className="flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          View full report
        </Link>
      </div>
    </div>
  );
}
