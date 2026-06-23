"use client";

import { useState, useCallback } from 'react';

type RangePreset = 'today' | '7d' | '30d' | 'custom';

interface UsageRow {
  date: string;
  type: string;
  details: string;
  credits: number;
  status: 'completed' | 'failed' | 'pending';
}

const rangePresets: { id: RangePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'custom', label: 'Custom' },
];

function generateMockData(days: number): UsageRow[] {
  const rows: UsageRow[] = [];
  const types = ['Video Scan', 'Audio Scan', 'Image Scan', 'Web Crawl'];
  const statuses: Array<'completed' | 'failed' | 'pending'> = ['completed', 'completed', 'completed', 'failed', 'pending'];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < count; j++) {
      const type = types[Math.floor(Math.random() * types.length)];
      rows.push({
        date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type,
        details: type === 'Web Crawl' ? 'newsportal.com.ng' : 'Uploaded file',
        credits: type === 'Web Crawl' ? 0 : 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
  }
  return rows;
}

function getDaysForPreset(preset: RangePreset): number {
  switch (preset) {
    case 'today': return 1;
    case '7d': return 7;
    case '30d': return 30;
    default: return 30;
  }
}

export default function UsageContent() {
  const [preset, setPreset] = useState<RangePreset>('7d');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const rows = generateMockData(getDaysForPreset(preset));
  const totalCreditsUsed = rows.reduce((s, r) => s + r.credits, 0);
  const completed = rows.filter((r) => r.status === 'completed').length;
  const failed = rows.filter((r) => r.status === 'failed').length;
  const totalPages = Math.ceil(rows.length / pageSize);
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  // Mock account data
  const currentTier = 'Sandbox';
  const tierLimits = {
    Sandbox: { credits: 0, scansPerDay: 3, monitoring: false, team: false },
    Pro: { credits: 100, scansPerDay: 'Unlimited', monitoring: true, team: false },
    Enterprise: { credits: 'Unlimited', scansPerDay: 'Unlimited', monitoring: true, team: true }
  };
  
  const teamMembers = [
    { id: 1, name: 'Tehillah Husseini', role: 'Team Lead', status: 'Active' },
    { id: 2, name: 'Joseph Jonah', role: 'Software Developer', status: 'Active' },
    { id: 3, name: 'Helen Ene', role: 'Business Strategist', status: 'Active' }
  ];

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
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-2">Scans Today</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#ffffff] tracking-tight">
              {rows.filter(r => 
                r.date === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              ).length}
            </span>
            <span className="text-sm text-[#5a5a5a]">/ {tierLimits[currentTier as keyof typeof tierLimits].scansPerDay}</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-2">Credits Used</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#ffffff] tracking-tight">
              {totalCreditsUsed}
            </span>
            <span className="text-sm text-[#5a5a5a]">/ {tierLimits[currentTier as keyof typeof tierLimits].credits === 'Unlimited' ? '∞' : tierLimits[currentTier as keyof typeof tierLimits].credits}</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#3d3a39]">
            <div className="h-full rounded-full bg-[#00C170] transition-all" style={{ width: `${Math.min((totalCreditsUsed / (typeof tierLimits[currentTier as keyof typeof tierLimits].credits === 'number' ? (tierLimits[currentTier as keyof typeof tierLimits].credits as number) : 100)) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-2">Current Tier</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#ffffff] tracking-tight">{currentTier}</span>
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
                  {paged.map((r, i) => (
                    <tr key={i} className="hover:bg-[#262626]/50 transition-colors">
                      <td className="px-5 py-4 text-[#ffffff] whitespace-nowrap">{r.date}</td>
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
              {paged.map((r, i) => (
                <div key={i} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-[#ffffff]">{r.type}</p>
                      <p className="text-xs text-[#a0a0a0] mt-1">{r.date}</p>
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
