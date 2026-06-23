"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';

const metrics = [
  { label: 'Total Scans', value: '142', change: '+12%', color: '#00C170' },
  { label: 'Threats Detected', value: '23', change: '+8%', color: '#ef4444' },
  { label: 'Files Cleared', value: '119', change: '+14%', color: '#00C170' },
  { label: 'Active Monitoring', value: '7', change: '+2', color: '#fbbf24' },
];

const detectionRatio = { real: 119, synthetic: 23 };
const total = detectionRatio.real + detectionRatio.synthetic;
const realPct = Math.round((detectionRatio.real / total) * 100);
const synthPct = 100 - realPct;

const confidenceBands = [
  { label: 'High (>80%)', count: 18, pct: 78, color: '#00C170' },
  { label: 'Medium (50–80%)', count: 4, pct: 17, color: '#fbbf24' },
  { label: 'Low (<50%)', count: 1, pct: 5, color: '#ef4444' },
];

const flaggedItems = [
  { id: '1', file: 'ceo_voice_note.m4a', date: '22 Jun 2026, 14:32', confidence: 97 },
  { id: '2', file: 'phone_call.wav', date: '20 Jun 2026, 16:08', confidence: 94 },
  { id: '3', file: 'social_media_clip.mp4', date: '19 Jun 2026, 22:30', confidence: 92 },
];

function DonutChart() {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const realOffset = circ * (1 - realPct / 100);
  const gap = 3;

  return (
    <div className="relative flex items-center justify-center w-[160px] h-[160px] mx-auto">
      <svg className="w-[160px] h-[160px] -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1A1A1A" strokeWidth="18" />
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke="#00C170" strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${circ - gap} ${circ}`}
          strokeDashoffset={0}
          className="transition-all duration-700"
        />
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke="#ef4444" strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${(synthPct / 100) * circ - gap} ${circ}`}
          strokeDashoffset={-((realPct / 100) * circ + gap)}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-[#ffffff]">{total}</span>
        <span className="text-[10px] font-mono text-[#a0a0a0]">Total scans</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">{label}</p>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: `${color}15`, color }}>
          {change}
        </span>
      </div>
      <p className="text-3xl font-semibold text-[#ffffff] tracking-tight">{value}</p>
    </div>
  );
}

export default function OverviewContent() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-4">Detection Ratio</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart />
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00C170] shrink-0" />
                <span className="text-sm text-[#ffffff]">Authentic</span>
                <span className="text-sm text-[#a0a0a0] ml-auto font-mono">{detectionRatio.real} ({realPct}%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                <span className="text-sm text-[#ffffff]">Synthetic</span>
                <span className="text-sm text-[#a0a0a0] ml-auto font-mono">{detectionRatio.synthetic} ({synthPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-4">Confidence Distribution</p>
          <div className="space-y-4">
            {confidenceBands.map((band) => (
              <div key={band.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#a0a0a0]">{band.label}</span>
                  <span className="text-xs font-mono text-[#ffffff]">{band.count} scans</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#3d3a39]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${band.pct}%`, backgroundColor: band.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {flaggedItems.length > 0 && (
        <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
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
            {flaggedItems.map((item) => (
              <div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#262626]/50 transition-colors">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm text-[#ffffff] truncate">{item.file}</p>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">{item.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-[#ef4444]/20 text-[#ef4444]">
                    Synthetic
                  </span>
                  <span className="text-xs font-mono text-[#a0a0a0]">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/workspace/${workspaceId}/scanner`}
          className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 hover:border-[#00C170]/50 transition-colors group"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">New Scan</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Upload a file or paste a URL for forensic analysis.</p>
        </Link>
        <Link
          href={`/workspace/${workspaceId}/usage`}
          className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 hover:border-[#00C170]/50 transition-colors group"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">Usage Report</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Review scan history, credits, and team activity.</p>
        </Link>
      </div>
    </div>
  );
}
