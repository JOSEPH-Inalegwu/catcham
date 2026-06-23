"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Modal from '@/components/Modal';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: string;
  source: string;
  file: string;
  date: string;
  severity: AlertSeverity;
  verdict: 'Synthetic' | 'Suspicious' | 'Authentic';
  confidence: number;
}

interface Target {
  id: string;
  url: string;
  label: string;
  status: 'active' | 'paused' | 'error';
  lastScan: string;
  alerts: number;
  type: 'news' | 'social' | 'video' | 'other';
}

const metrics = [
  { label: 'Sources Monitored', value: '12', change: '+3', color: '#00C170' },
  { label: 'Alerts This Week', value: '18', change: '+5', color: '#ef4444' },
  { label: 'Critical Flags', value: '3', change: '+1', color: '#ef4444' },
  { label: 'Uptime', value: '99.2%', change: '-0.3%', color: '#fbbf24' },
];

const targets: Target[] = [
  { id: '1', url: 'https://punchng.com', label: 'Punch Newspapers', status: 'active', lastScan: '2 min ago', alerts: 7, type: 'news' },
  { id: '2', url: 'https://tribuneonlineng.com', label: 'Nigerian Tribune', status: 'active', lastScan: '5 min ago', alerts: 4, type: 'news' },
  { id: '3', url: 'https://x.com/NigeriaGov', label: 'NigeriaGov (X/Twitter)', status: 'active', lastScan: '1 min ago', alerts: 3, type: 'social' },
  { id: '4', url: 'https://youtube.com/@channel', label: 'YouTube News Channel', status: 'paused', lastScan: '3 hours ago', alerts: 0, type: 'video' },
  { id: '5', url: 'https://instagram.com/official', label: 'Official Instagram', status: 'active', lastScan: '8 min ago', alerts: 4, type: 'social' },
  { id: '6', url: 'https://vanguardngr.com', label: 'Vanguard News', status: 'error', lastScan: '1 hour ago', alerts: 0, type: 'news' },
];

const alerts: Alert[] = [
  { id: '1', source: 'Punch Newspapers', file: 'minister_speech.mp4', date: '22 Jun 2026, 14:32', severity: 'critical', verdict: 'Synthetic', confidence: 97 },
  { id: '2', source: 'NigeriaGov (X/Twitter)', file: 'president_address.mp4', date: '22 Jun 2026, 11:15', severity: 'high', verdict: 'Synthetic', confidence: 94 },
  { id: '3', source: 'Official Instagram', file: 'ceo_interview.mp4', date: '21 Jun 2026, 18:42', severity: 'medium', verdict: 'Suspicious', confidence: 76 },
  { id: '4', source: 'Nigerian Tribune', file: 'press_release.mp4', date: '21 Jun 2026, 09:08', severity: 'high', verdict: 'Synthetic', confidence: 91 },
  { id: '5', source: 'Official Instagram', file: 'brand_ambassador.mp4', date: '20 Jun 2026, 22:30', severity: 'low', verdict: 'Suspicious', confidence: 62 },
  { id: '6', source: 'Punch Newspapers', file: 'panel_discussion.mp4', date: '20 Jun 2026, 16:08', severity: 'critical', verdict: 'Synthetic', confidence: 96 },
];

const severityConfig: Record<AlertSeverity, { label: string; bg: string; text: string }> = {
  critical: { label: 'Critical', bg: 'bg-[#ef4444]/20', text: 'text-[#ef4444]' },
  high: { label: 'High', bg: 'bg-[#f97316]/20', text: 'text-[#f97316]' },
  medium: { label: 'Medium', bg: 'bg-[#fbbf24]/20', text: 'text-[#fbbf24]' },
  low: { label: 'Low', bg: 'bg-[#a0a0a0]/20', text: 'text-[#a0a0a0]' },
};

function StatusBadge({ status }: { status: Target['status'] }) {
  const config = {
    active: { label: 'Active', dot: 'bg-[#00C170]', bg: 'bg-[#00C170]/10', text: 'text-[#00C170]' },
    paused: { label: 'Paused', dot: 'bg-[#fbbf24]', bg: 'bg-[#fbbf24]/10', text: 'text-[#fbbf24]' },
    error: { label: 'Error', dot: 'bg-[#ef4444]', bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}

function SeverityPill({ severity }: { severity: AlertSeverity }) {
  const c = severityConfig[severity];
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function MetricCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e]">{label}</p>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${isPositive ? 'bg-[#00C170]/10 text-[#00C170]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
          {change}
        </span>
      </div>
      <p className="text-3xl font-semibold text-[#ffffff] tracking-tight">{value}</p>
    </div>
  );
}

export default function MonitoringContent() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [addTargetOpen, setAddTargetOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00C170] animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#00C170] animate-ping opacity-40" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#ffffff]">Crawler Active</p>
              <p className="text-xs text-[#a0a0a0] mt-0.5">Last scan completed 2 minutes ago &middot; 156 sources scanned today</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddTargetOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity"
            >
              + Add Target
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
          <h3 className="text-sm font-semibold text-[#ffffff]">Surveillance Targets</h3>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3d3a39]">
                {['Source', 'URL', 'Status', 'Last Scan', 'Alerts'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3a39]">
              {targets.map((t) => (
                <tr key={t.id} className="hover:bg-[#262626]/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#ffffff]">{t.label}</p>
                    <p className="text-[10px] text-[#5a5a5a] font-mono uppercase mt-0.5">{t.type}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#a0a0a0] font-mono truncate max-w-[200px] block">{t.url}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-4 text-xs text-[#a0a0a0]">{t.lastScan}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-mono ${t.alerts > 0 ? 'text-[#ef4444]' : 'text-[#5a5a5a]'}`}>
                      {t.alerts} {t.alerts === 1 ? 'alert' : 'alerts'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#3d3a39]">
          {targets.map((t) => (
            <div key={t.id} className="px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#ffffff] font-medium">{t.label}</p>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-xs text-[#a0a0a0] font-mono truncate">{t.url}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a0a0a0]">{t.lastScan}</span>
                <span className={t.alerts > 0 ? 'text-[#ef4444]' : 'text-[#5a5a5a]'}>{t.alerts} alerts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            <h3 className="text-sm font-semibold text-[#ffffff]">Recent Alerts</h3>
          </div>
          <span className="text-xs text-[#5a5a5a] font-mono">{alerts.length} total</span>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3d3a39]">
                {['File', 'Source', 'Date', 'Severity', 'Verdict', 'Confidence'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3a39]">
              {alerts.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className="hover:bg-[#262626]/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm text-[#ffffff] max-w-[200px] truncate">{a.file}</td>
                  <td className="px-5 py-4 text-xs text-[#a0a0a0]">{a.source}</td>
                  <td className="px-5 py-4 text-xs text-[#a0a0a0] whitespace-nowrap">{a.date}</td>
                  <td className="px-5 py-4"><SeverityPill severity={a.severity} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                      a.verdict === 'Synthetic' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                      a.verdict === 'Suspicious' ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                      'bg-[#00C170]/20 text-[#00C170]'
                    }`}>
                      {a.verdict}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-[#ffffff]">{a.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#3d3a39]">
          {alerts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAlert(a)}
              className="w-full text-left px-4 py-3.5 hover:bg-[#262626]/50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#ffffff] truncate flex-1 mr-2">{a.file}</p>
                <SeverityPill severity={a.severity} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a0a0a0]">{a.source}</span>
                <span className="text-[#a0a0a0]">{a.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  a.verdict === 'Synthetic' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                  a.verdict === 'Suspicious' ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                  'bg-[#00C170]/20 text-[#00C170]'
                }`}>
                  {a.verdict}
                </span>
                <span className="text-xs font-mono text-[#a0a0a0]">{a.confidence}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/workspace/${workspaceId}/scanner`}
          className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 hover:border-[#00C170]/50 transition-colors group"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">Manual Scan</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Upload a file for immediate forensic analysis.</p>
        </Link>
        <Link
          href={`/workspace/${workspaceId}/usage`}
          className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 hover:border-[#00C170]/50 transition-colors group"
        >
          <p className="text-sm font-semibold text-[#ffffff] group-hover:text-[#00C170] transition-colors">View Report History</p>
          <p className="text-xs text-[#a0a0a0] mt-1">Review past scan reports and forensic evidence.</p>
        </Link>
      </div>

      <Modal open={addTargetOpen} onClose={() => setAddTargetOpen(false)} title="Add Surveillance Target">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">URL to monitor</label>
            <input
              type="url"
              placeholder="https://news-site.com"
              className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Label (optional)</label>
            <input
              type="text"
              placeholder="My News Source"
              className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none focus:border-[#00C170]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Source type</label>
            <select className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] focus:outline-none focus:border-[#00C170]/50 transition-colors appearance-none">
              <option value="news">News</option>
              <option value="social">Social Media</option>
              <option value="video">Video Platform</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setAddTargetOpen(false)}
            className="flex-1 py-2.5 text-sm font-semibold text-[#a0a0a0] border border-[#3d3a39] rounded-[6px] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setAddTargetOpen(false)}
            className="flex-1 py-2.5 text-sm font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity"
          >
            Add Target
          </button>
        </div>
      </Modal>

      <Modal
        open={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.file ?? ''}
        description={`Detected on ${selectedAlert?.source}`}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SeverityPill severity={selectedAlert.severity} />
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                selectedAlert.verdict === 'Synthetic' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                selectedAlert.verdict === 'Suspicious' ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                'bg-[#00C170]/20 text-[#00C170]'
              }`}>
                {selectedAlert.verdict}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#a0a0a0]">Confidence</p>
                <p className="text-[#ffffff] font-mono">{selectedAlert.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-[#a0a0a0]">Detected</p>
                <p className="text-[#ffffff]">{selectedAlert.date}</p>
              </div>
            </div>
            <Link
              href={`/workspace/${workspaceId}/scanner`}
              onClick={() => setSelectedAlert(null)}
              className="block w-full py-2.5 text-sm font-semibold text-center text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity"
            >
              Run Full Scan
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
