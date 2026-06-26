"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/Skeleton';

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

type RangePreset = 'today' | '7d' | '30d' | 'custom';

interface UsageRow {
  id: string;
  date: string;
  type: string;
  details: string;
  credits: number;
  status: 'completed' | 'failed' | 'pending';
  verdict?: string | null;
  confidence?: number | null;
}

interface UsageData {
  scans: UsageRow[];
  credits: { used: number; purchased: number; balance: number };
  scansToday: number;
  plan: string;
  teamSize: number;
}

const rangePresets: { id: RangePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'custom', label: 'Custom' },
];

function getDaysForPreset(preset: RangePreset): number {
  switch (preset) {
    case 'today': return 1;
    case '7d': return 7;
    case '30d': return 30;
    default: return 30;
  }
}

const planLabels: Record<string, string> = {
  sandbox: 'Sandbox',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const tierLimits: Record<string, { credits: string | number; scansPerDay: string | number; monitoring: boolean; team: boolean }> = {
  Sandbox: { credits: 0, scansPerDay: 3, monitoring: false, team: false },
  Pro: { credits: 100, scansPerDay: 'Unlimited', monitoring: true, team: false },
  Enterprise: { credits: 'Unlimited', scansPerDay: 'Unlimited', monitoring: true, team: true },
};

export default function UsageContent() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UsageData | null>(null);
  const [preset, setPreset] = useState<RangePreset>('7d');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchUsage = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workspace/${workspaceId}/usage?start=${start}&end=${end}`);
      const json = await res.json();
      setData(json);
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    fetchUsage(start.toISOString(), end.toISOString());
  }, [fetchUsage, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [preset]);

  const rows = data?.scans ?? [];
  const totalCreditsUsed = data?.credits.used ?? 0;
  const planLabel = planLabels[data?.plan ?? 'sandbox'] ?? 'Sandbox';
  const limits = tierLimits[planLabel] ?? tierLimits.Sandbox;

  const totalPages = Math.ceil(rows.length / pageSize);
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  const downloadCsv = useCallback(() => {
    const header = 'Date,Type,Details,Credits,Status';
    const body = rows.map((r) => `${r.date},${r.type},${r.details},${r.credits},${r.status}`).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catcham-usage-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, startDate, endDate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[40px] w-[420px] rounded-[8px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[110px] rounded-[8px]" />)}
        </div>
        <Skeleton className="h-[360px] w-full rounded-[8px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[#1A1A1A] border border-[#3d3a39]">
          {rangePresets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPreset(p.id);
                setPage(1);
                if (p.id !== 'custom') {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - getDaysForPreset(p.id) + 1);
                  start.setHours(0, 0, 0, 0);
                  end.setHours(23, 59, 59, 999);
                  setStartDate(start.toISOString().slice(0, 10));
                  setEndDate(end.toISOString().slice(0, 10));
                }
              }}
              className={`px-3 py-1.5 text-xs rounded-[6px] transition-colors ${
                preset === p.id
                  ? 'bg-[#00d992] text-[#101010] font-medium'
                  : 'text-[#a0a0a0] hover:text-[#ffffff]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {preset === 'custom' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs text-[#ffffff] bg-[#1A1A1A] border border-[#3d3a39] rounded-[6px] focus:outline-none focus:border-[#00d992]/50 transition-colors"
              />
              <span className="text-xs text-[#a0a0a0]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs text-[#ffffff] bg-[#1A1A1A] border border-[#3d3a39] rounded-[6px] focus:outline-none focus:border-[#00d992]/50 transition-colors"
              />
            </>
          )}

          <button
            onClick={downloadCsv}
            title="Download CSV"
            className="p-2 text-[#a0a0a0] hover:text-[#ffffff] bg-[#1A1A1A] border border-[#3d3a39] rounded-[6px] hover:border-[#5a5a5a] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[8px] p-5 hover:border-[#3d3a39] transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#5a5a5a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">Scans Today</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#ffffff] tracking-tight">
              <AnimatedCounter value={data?.scansToday ?? 0} />
            </span>
            <span className="text-sm text-[#5a5a5a]">/ {limits.scansPerDay}</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[8px] p-5 hover:border-[#3d3a39] transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#5a5a5a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">Credits Used</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#ffffff] tracking-tight">
              <AnimatedCounter value={totalCreditsUsed} />
            </span>
            <span className="text-sm text-[#5a5a5a]">/ {limits.credits === 'Unlimited' ? '∞' : limits.credits}</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#3d3a39]">
            <div className="h-full rounded-full bg-[#00C170] transition-all" style={{ width: `${Math.min((totalCreditsUsed / (typeof limits.credits === 'number' ? limits.credits : 100)) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[8px] p-5 hover:border-[#3d3a39] transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#5a5a5a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">Current Tier</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#ffffff] tracking-tight">{planLabel}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#00C170]/20 text-[#00C170]">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {rows.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-8 text-center">
            <p className="text-sm text-[#5a5a5a]">No usage data for this range.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3d3a39]">
                    {['Date', 'Type', 'Details', 'Credits', 'Status'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d3a39]">
                  {paged.map((r) => (
                    <tr key={r.id} className="hover:bg-[#262626]/50 transition-colors">
                      <td className="px-5 py-4 text-[#ffffff] whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-[#a0a0a0] whitespace-nowrap">{r.type}</td>
                      <td className="px-5 py-4 text-[#a0a0a0] whitespace-nowrap max-w-[200px] truncate">{r.details}</td>
                      <td className="px-5 py-4 text-[#ffffff] whitespace-nowrap font-medium">{r.credits}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                          r.status === 'completed' ? 'bg-[#00C170]/20 text-[#00C170]' :
                          r.status === 'failed' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                          'bg-[#fbbf24]/20 text-[#fbbf24]'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {paged.map((r) => (
                <div key={r.id} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-[#ffffff]">{r.type}</p>
                      <p className="text-xs text-[#a0a0a0] mt-1">
                        {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-[#ffffff]">{r.credits} <span className="text-xs font-normal text-[#a0a0a0]">cr</span></p>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        r.status === 'completed' ? 'bg-[#00C170]/10 text-[#00C170]' :
                        r.status === 'failed' ? 'bg-[#f87171]/10 text-[#f87171]' :
                        'bg-[#fbbf24]/10 text-[#fbbf24]'
                      }`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#3d3a39]">
                    <p className="text-xs text-[#a0a0a0] truncate">Details: <span className="text-[#ffffff]">{r.details}</span></p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 text-xs text-[#a0a0a0] hover:text-[#ffffff] disabled:opacity-30 transition-colors"
                >
                  Prev
                </button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 text-xs rounded-[6px] transition-colors ${
                        page === i + 1
                          ? 'bg-[#00C170] text-[#0A0A0A] font-semibold'
                          : 'text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626]/50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="sm:hidden text-xs text-[#5a5a5a]">
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-xs text-[#a0a0a0] hover:text-[#ffffff] disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
