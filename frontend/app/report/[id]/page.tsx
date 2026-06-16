"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getReport, type ScanResult } from "@/lib/api";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getReport(id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-2xl flex-col items-center justify-center px-4 sm:px-6">
        <p className="text-sm text-[#8b949e]">Loading report...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-2xl flex-col items-center justify-center px-4 sm:px-6">
        <p className="text-sm text-[#8b949e]">{error ?? "Report not found"}</p>
        <Link
          href="/scan"
          className="mt-4 rounded-[6px] border border-[#3d3a39] px-4 py-2 text-sm font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
        >
          Scan another file
        </Link>
      </main>
    );
  }

  const isSynthetic = data.verdict === "synthetic";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
          Forensic Report
        </p>
      </div>

      <h1 className="text-center text-2xl font-normal tracking-[-0.6px] text-[#ffffff] sm:text-3xl">
        {isSynthetic ? "Synthetic content detected" : "No synthetic content found"}
      </h1>

      <div className="mt-10 space-y-4">
        <div className="rounded-[8px] border border-[#3d3a39] p-6">
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
        </div>

        <div className="rounded-[8px] border border-[#3d3a39] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Confidence</span>
            <span className="text-sm font-semibold text-[#f2f2f2]">
              {data.confidence}%
            </span>
          </div>
        </div>

        {data.anomaly_type && (
          <div className="rounded-[8px] border border-[#3d3a39] p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8b949e]">Anomaly</span>
              <span className="text-sm font-semibold text-[#f2f2f2]">
                {data.anomaly_type}
              </span>
            </div>
          </div>
        )}

        <div className="rounded-[8px] border border-[#3d3a39] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Media type</span>
            <span className="text-sm font-semibold text-[#f2f2f2] capitalize">
              {data.media_type}
            </span>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#3d3a39] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Report ID</span>
            <span className="text-sm font-semibold text-[#f2f2f2]">{data.id}</span>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#3d3a39] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Analysed at</span>
            <span className="text-sm font-semibold text-[#f2f2f2]">
              {new Date(data.analysed_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/scan"
          className="rounded-[6px] border border-[#3d3a39] px-5 py-2.5 text-sm font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
        >
          Scan another file
        </Link>
      </div>
    </main>
  );
}
