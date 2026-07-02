"use client";

import { useState, useEffect, useCallback, useRef, type JSX } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/Skeleton';

type OverviewData = {
  metrics: {
    totalScans: number;
    threatsDetected: number;
    filesCleared: number;
    suspiciousCount: number;
    activeMonitoring: number;
  };
  detectionRatio: { authentic: number; suspicious: number; synthetic: number };
  confidenceBands: { high: number; medium: number; low: number };
  flaggedItems: {
    id: string;
    file_name: string;
    file_type: string;
    verdict: string;
    confidence: number;
    anomaly_type: string | null;
    analysed_at: string;
  }[];
};

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const target = value;
    const start = prevRef.current;
    if (start === target) return;
    const duration = 500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prevRef.current = target;
  }, [value]);

  return <>{display}</>;
}

const CARD_ICONS: Record<string, JSX.Element> = {
  'Total Scans': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v6c0 4.97-3.16 9.62-7 10.97C8.16 20.62 5 16.97 5 12V5l7-3z" />
    </svg>
  ),
  'Threats Detected': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-8 14A1 1 0 003 19h18a1 1 0 00.86-1.49l-8-14a1 1 0 00-1.72 0z" />
    </svg>
  ),
  'Files Cleared': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Active Monitoring': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ),
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 group cursor-default shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="shrink-0 text-[#5a5a5a]">{CARD_ICONS[label]}</span>
        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">{label}</p>
      </div>
      <p className="text-3xl font-semibold text-[#ffffff] tracking-tight">
        <AnimatedCounter value={Number(value)} />
      </p>
    </div>
  );
}

function DonutChart({ authentic, suspicious, synthetic }: { authentic: number; suspicious: number; synthetic: number }) {
  const a = authentic || 0;
  const s = suspicious || 0;
  const syn = synthetic || 0;
  const total = a + s + syn;
  const div = total || 1;
  const aPct = Math.round((a / div) * 100);
  const sPct = Math.round((s / div) * 100);
  const synPct = 100 - Math.max(0, aPct) - Math.max(0, sPct);
  const r = 60;
  const circ = 2 * Math.PI * r;
  const gap = 2;

  const aOffset = 0;
  const sOffset = -((aPct / 100) * circ + gap);
  const synOffset = -(((aPct + sPct) / 100) * circ + gap * 2);

  return (
    <div className="relative flex items-center justify-center w-[160px] h-[160px] mx-auto">
      <svg className="w-[160px] h-[160px] -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1A1A1A" strokeWidth="18" />
        {aPct > 0 && (
          <circle cx="70" cy="70" r={r} fill="none" stroke="#00C170" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${(aPct / 100) * circ - gap} ${circ}`} strokeDashoffset={aOffset} className="transition-all duration-700" style={{ filter: 'drop-shadow(0 0 6px rgba(0,193,112,0.35))' }} />
        )}
        {sPct > 0 && (
          <circle cx="70" cy="70" r={r} fill="none" stroke="#fbbf24" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${(sPct / 100) * circ - gap} ${circ}`} strokeDashoffset={sOffset} className="transition-all duration-700" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.35))' }} />
        )}
        {synPct > 0 && (
          <circle cx="70" cy="70" r={r} fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${(synPct / 100) * circ - gap} ${circ}`} strokeDashoffset={synOffset} className="transition-all duration-700" style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.35))' }} />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-[#ffffff]">{<AnimatedCounter value={total} />}</span>
        <span className="text-[10px] font-mono text-[#a0a0a0]">Total scans</span>
      </div>
    </div>
  );
}

export default function OverviewContent() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch(`/api/workspace/${workspaceId}/overview`);
      if (!res.ok) {
        console.error(`Overview API returned ${res.status}`);
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchOverview();
    }, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchOverview(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchOverview]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
            <Skeleton className="h-3 w-28 mb-6" />
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="w-[160px] h-[160px] rounded-full shrink-0" />
              <div className="space-y-3 w-full sm:w-auto">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
            <Skeleton className="h-3 w-36 mb-6" />
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
          <div className="px-5 py-4 border-b border-[#3d3a39]">
            <div className="flex items-center gap-2">
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="divide-y divide-[#3d3a39]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-44" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const m = data?.metrics;
  const dr = data?.detectionRatio ?? { authentic: 0, suspicious: 0, synthetic: 0 };
  const cb = data?.confidenceBands ?? { high: 0, medium: 0, low: 0 };
  const flagged = data?.flaggedItems ?? [];
  const drTotal = (dr.authentic || 0) + (dr.suspicious || 0) + (dr.synthetic || 0) || 1;

  const cbTotal = (cb.high || 0) + (cb.medium || 0) + (cb.low || 0);
  const confidenceBands = [
    { label: 'High (>80%)', count: cb.high || 0, pct: cbTotal > 0 ? Math.round(((cb.high || 0) / cbTotal) * 100) : 0, color: '#00C170' },
    { label: 'Medium (50–80%)', count: cb.medium || 0, pct: cbTotal > 0 ? Math.round(((cb.medium || 0) / cbTotal) * 100) : 0, color: '#fbbf24' },
    { label: 'Low (<50%)', count: cb.low || 0, pct: cbTotal > 0 ? Math.round(((cb.low || 0) / cbTotal) * 100) : 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard label="Total Scans" value={m?.totalScans ?? 0} />
        <MetricCard label="Threats Detected" value={m?.threatsDetected ?? 0} />
        <MetricCard label="Files Cleared" value={m?.filesCleared ?? 0} />
        <MetricCard label="Active Monitoring" value={m?.activeMonitoring ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-4">Detection Ratio</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart authentic={dr.authentic} suspicious={dr.suspicious} synthetic={dr.synthetic} />
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00C170] shrink-0" />
                <span className="text-sm text-[#ffffff]">Authentic</span>
                <span className="text-sm text-[#a0a0a0] ml-auto">{(dr.authentic || 0)} ({drTotal > 0 ? Math.round(((dr.authentic || 0) / drTotal) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shrink-0" />
                <span className="text-sm text-[#ffffff]">Suspicious</span>
                <span className="text-sm text-[#a0a0a0] ml-auto">{(dr.suspicious || 0)} ({drTotal > 0 ? Math.round(((dr.suspicious || 0) / drTotal) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                <span className="text-sm text-[#ffffff]">Synthetic</span>
                <span className="text-sm text-[#a0a0a0] ml-auto">{(dr.synthetic || 0)} ({drTotal > 0 ? Math.round(((dr.synthetic || 0) / drTotal) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-4">Confidence Distribution</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#3d3a39] flex">
            {confidenceBands.filter(b => b.count > 0).length === 0 ? (
              <div className="h-full rounded-full bg-[#3d3a39]" style={{ width: '100%' }} />
            ) : confidenceBands.map((band, i) => (
              band.count > 0 ? (
                <div
                  key={band.label}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${band.pct}%`, backgroundColor: band.color }}
                />
              ) : null
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#a0a0a0]">
            {confidenceBands.map((band) => (
              <span key={band.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: band.count > 0 ? band.color : '#3d3a39' }} />
                {band.label} ({band.count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {flagged.length > 0 && (
        <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <h3 className="text-sm font-semibold text-[#ffffff]">Flagged Items</h3>
            </div>
            <Link
              href={`/workspace/${workspaceId}/usage`}
              className="text-xs text-[#00C170] hover:underline transition-colors"
            >
              View history
            </Link>
          </div>

          <div className="divide-y divide-[#3d3a39]">
            {flagged.map((item) => (
              <div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#262626]/50 transition-colors">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm text-[#ffffff] truncate">{item.file_name}</p>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">
                    {new Date(item.analysed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                    item.verdict === 'Synthetic' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#fbbf24]/20 text-[#fbbf24]'
                  }`}>
                    {item.verdict}
                  </span>
                  <span className="text-xs text-[#a0a0a0]">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/workspace/${workspaceId}/scanner`}
          className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 hover:border-[#00C170]/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all group shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">New Scan</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Upload a file or paste a URL for forensic analysis.</p>
        </Link>
        <Link
          href={`/workspace/${workspaceId}/usage`}
          className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 hover:border-[#00C170]/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all group shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">Usage Report</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Review scan history, credits, and team activity.</p>
        </Link>
      </div>
    </div>
  );
}
