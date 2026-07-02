"use client";

import { useState, useEffect, useCallback, useRef, type JSX } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Modal from '@/components/Modal';
import { Skeleton } from '@/components/Skeleton';
import { useToast } from '@/app/context/ToastContext';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

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

const MONITOR_ICONS: Record<string, JSX.Element> = {
  'Sources Monitored': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ),
  'Alerts This Week': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  'Critical Flags': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-8 14A1 1 0 003 19h18a1 1 0 00.86-1.49l-8-14a1 1 0 00-1.72 0z" />
    </svg>
  ),
  'Uptime': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

function MonitorMetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-4 md:p-5 group cursor-default shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="shrink-0 text-[#5a5a5a]">{MONITOR_ICONS[label]}</span>
        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] truncate">{label}</p>
      </div>
      <p className="text-3xl font-semibold text-[#ffffff] tracking-tight">
        {label === 'Uptime' ? <>{value}%</> : <AnimatedCounter value={Number(value)} />}
      </p>
    </div>
  );
}

interface AlertItem {
  id: string;
  targetId: string;
  file: string;
  sourceUrl?: string | null;
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
  type: 'news' | 'social' | 'video' | 'other';
  lastScan: string | null;
  alerts: number;
}

interface MonitoringData {
  crawler: { status: string; sourcesToday: number; lastScan: string | null; queue: number; activeTargets: number };
  metrics: { sourcesMonitored: number; alertsThisWeek: number; criticalFlags: number; uptime: number };
  targets: Target[];
  alerts: AlertItem[];
}

const severityConfig: Record<AlertSeverity, { label: string; bg: string; text: string; bar: string }> = {
  critical: { label: 'Critical', bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', bar: 'bg-[#ef4444]' },
  high: { label: 'High', bg: 'bg-[#f97316]/10', text: 'text-[#f97316]', bar: 'bg-[#f97316]' },
  medium: { label: 'Medium', bg: 'bg-[#fbbf24]/10', text: 'text-[#fbbf24]', bar: 'bg-[#fbbf24]' },
  low: { label: 'Low', bg: 'bg-[#a0a0a0]/10', text: 'text-[#a0a0a0]', bar: 'bg-[#a0a0a0]' },
};

function StatusDot({ status }: { status: Target['status'] }) {
  const colors = { active: 'bg-[#00C170]', paused: 'bg-[#fbbf24]', error: 'bg-[#ef4444]' };
  return (
    <span className={`relative flex h-2 w-2`}>
      <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} ${status === 'active' ? 'animate-ping opacity-75' : ''}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`} />
    </span>
  );
}

function SeverityBar({ severity }: { severity: AlertSeverity }) {
  return <div className={`w-1 shrink-0 rounded-full ${severityConfig[severity].bar}`} />;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const styles: Record<string, string> = {
    Synthetic: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30',
    Suspicious: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30',
    Authentic: 'bg-[#00C170]/15 text-[#00C170] border-[#00C170]/30',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${styles[verdict] ?? styles.Synthetic}`}>
      {verdict}
    </span>
  );
}

export default function MonitoringContent() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonitoringData | null>(null);
  const [addTargetOpen, setAddTargetOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [newTargetLabel, setNewTargetLabel] = useState('');
  const [newTargetType, setNewTargetType] = useState('news');
  const [addingTarget, setAddingTarget] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [labelError, setLabelError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/workspace/${workspaceId}/monitoring`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const validateUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return 'URL is required';
    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) return 'URL must start with http:// or https://';
      if (!parsed.hostname.includes('.')) return 'Enter a valid domain (e.g. news-site.com)';
    } catch {
      return 'Enter a valid URL (e.g. https://news-site.com)';
    }
    return '';
  };

  const sanitizeLabel = (label: string): string => {
    return label.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().slice(0, 100);
  };

  const handleAddTarget = async () => {
    const urlValidation = validateUrl(newTargetUrl);
    setUrlError(urlValidation);
    if (urlValidation) return;

    const cleanLabel = sanitizeLabel(newTargetLabel);
    if (newTargetLabel.trim() && !cleanLabel) {
      setLabelError('Label contains invalid characters');
      return;
    }
    setLabelError('');

    setAddingTarget(true);
    try {
      const res = await fetch(`/api/workspace/${workspaceId}/monitoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newTargetUrl.trim(),
          label: cleanLabel || undefined,
          type: newTargetType,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        addToast(json.details || json.error || 'Failed to add target', 'error');
        return;
      }
      addToast('Target added successfully', 'success');
      setAddTargetOpen(false);
      setNewTargetUrl('');
      setNewTargetLabel('');
      setNewTargetType('news');
      fetchData();
    } catch {
      addToast('Failed to add target', 'error');
    } finally {
      setAddingTarget(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-3 h-3 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <Skeleton className="h-7 w-24 rounded-[6px]" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="hidden md:block">
              <div className="flex gap-8 px-5 py-3.5 border-b border-[#3d3a39]">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-3 w-16" />)}
              </div>
              <div className="divide-y divide-[#3d3a39]/50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-8 px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="md:hidden divide-y divide-[#3d3a39]/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-36" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
              <div className="flex items-center gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="divide-y divide-[#3d3a39]/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <Skeleton className="w-1 h-8 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const m = data?.metrics ?? { sourcesMonitored: 0, alertsThisWeek: 0, criticalFlags: 0, uptime: 0 };
  const targets = data?.targets ?? [];
  const alerts = data?.alerts ?? [];
  const crawler = data?.crawler;

  return (
    <div className="space-y-6">
      {/* ─── Crawler Status ─── */}
      <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#00C170] animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00C170] animate-ping opacity-40" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-semibold text-[#ffffff]">Crawler Active</p>
                <span className="text-xs text-[#5a5a5a] bg-[#101010] px-2 py-0.5 rounded-full">
                  {crawler?.sourcesToday ?? 0} sources today
                </span>
              </div>
              <p className="text-xs text-[#a0a0a0] mt-0.5">
                Monitoring {m.sourcesMonitored} targets &middot; {crawler?.queue ?? 0} queued
              </p>
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

      {/* ─── Metrics ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MonitorMetricCard label="Sources Monitored" value={m.sourcesMonitored} />
        <MonitorMetricCard label="Alerts This Week" value={m.alertsThisWeek} />
        <MonitorMetricCard label="Critical Flags" value={m.criticalFlags} />
        <MonitorMetricCard label="Uptime" value={m.uptime} />
      </div>

      {/* ─── Two-column: Targets + Alerts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Surveillance Targets */}
        <div className="lg:col-span-3 bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
            <h3 className="text-sm font-semibold text-[#ffffff]">Surveillance Targets</h3>
            <span className="text-xs text-[#5a5a5a]">{targets.length} total</span>
          </div>

          {targets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-[#5a5a5a]">No targets yet.</p>
              <button
                onClick={() => setAddTargetOpen(true)}
                className="mt-3 text-xs text-[#00C170] hover:underline"
              >
                Add your first target
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#3d3a39]">
                      {['Source', 'Status', 'Alerts', 'Last Scan'].map((h) => (
                        <th key={h} className="text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d3a39]">
                    {targets.map((t) => (
                      <tr key={t.id} className="hover:bg-[#262626]/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <StatusDot status={t.status} />
                            <div>
                              <p className="text-sm text-[#ffffff]">{t.label}</p>
                              <p className="text-xs text-[#5a5a5a] truncate max-w-[260px]">{t.url}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            t.status === 'active' ? 'bg-[#00C170]/10 text-[#00C170]' :
                            t.status === 'paused' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                            'bg-[#ef4444]/10 text-[#ef4444]'
                          }`}>{t.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs ${t.alerts > 0 ? 'text-[#ef4444]' : 'text-[#5a5a5a]'}`}>
                            {t.alerts}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-[#a0a0a0]">
                          {t.lastScan ? new Date(t.lastScan).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#3d3a39]">
                {targets.map((t) => (
                  <div key={t.id} className="px-4 py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusDot status={t.status} />
                        <p className="text-sm text-[#ffffff] font-medium">{t.label}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        t.status === 'active' ? 'bg-[#00C170]/10 text-[#00C170]' :
                        t.status === 'paused' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                        'bg-[#ef4444]/10 text-[#ef4444]'
                      }`}>{t.status}</span>
                    </div>
                    <p className="text-xs text-[#a0a0a0] truncate">{t.url}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5a5a5a]">{t.lastScan ? new Date(t.lastScan).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}</span>
                      <span className={t.alerts > 0 ? 'text-[#ef4444]' : 'text-[#5a5a5a]'}>{t.alerts} alerts</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d3a39]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <h3 className="text-sm font-semibold text-[#ffffff]">Recent Alerts</h3>
            </div>
            <Link
              href={`/workspace/${workspaceId}/usage`}
              className="text-xs text-[#00C170] hover:underline"
            >
              View all
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-8 h-8 mx-auto text-[#3d3a39] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#5a5a5a]">No alerts this week.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3d3a39] max-h-[400px] overflow-y-auto">
              {alerts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className="w-full text-left px-4 py-3 hover:bg-[#262626]/50 transition-colors flex items-start gap-3"
                >
                  <SeverityBar severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-[#ffffff] truncate">{a.file}</p>
                      <span className="text-xs text-[#a0a0a0] shrink-0">{a.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <VerdictBadge verdict={a.verdict} />
                      <span className="text-[10px] text-[#5a5a5a]">
                        {new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Activity Timeline ─── */}
      {alerts.length > 0 && (
        <div className="bg-[#1A1A1A] border border-[#1f1f1f] rounded-[8px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <h3 className="text-sm font-semibold text-[#ffffff] mb-4">Activity Timeline</h3>
          <div className="space-y-0">
            {alerts.slice(0, 8).map((a, i) => (
              <div key={a.id} className="flex gap-4 pb-4 relative">
                {i < Math.min(alerts.length, 8) - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-px bg-[#3d3a39]" />
                )}
                <div className={`w-[14px] h-[14px] rounded-full border-2 shrink-0 mt-0.5 ${
                  a.severity === 'critical' ? 'border-[#ef4444] bg-[#ef4444]/20' :
                  a.severity === 'high' ? 'border-[#f97316] bg-[#f97316]/20' :
                  a.severity === 'medium' ? 'border-[#fbbf24] bg-[#fbbf24]/20' :
                  'border-[#a0a0a0] bg-[#a0a0a0]/20'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-[#ffffff] font-medium">{a.file}</span>
                    <VerdictBadge verdict={a.verdict} />
                    <span className="text-[10px] text-[#5a5a5a]">
                      {new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">
                    {a.severity === 'critical' ? 'Urgent review recommended' :
                     a.severity === 'high' ? 'Review within 24 hours' :
                     'Monitor for patterns'} &middot; {a.confidence}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Add Target Modal ─── */}
      <Modal open={addTargetOpen} onClose={() => { setAddTargetOpen(false); setNewTargetUrl(''); setNewTargetLabel(''); setNewTargetType('news'); setUrlError(''); setLabelError(''); }} title="Add Surveillance Target">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">URL to monitor</label>
            <input
              type="url"
              value={newTargetUrl}
              onChange={(e) => { setNewTargetUrl(e.target.value); if (urlError) setUrlError(''); }}
              placeholder="https://news-site.com"
              className={`w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none transition-colors ${
                urlError ? 'border-[#ef4444]' : 'border-[#3d3a39] focus:border-[#00C170]/50'
              }`}
            />
            {urlError && <p className="text-[10px] text-[#ef4444] mt-1">{urlError}</p>}
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Label (optional)</label>
            <input
              type="text"
              value={newTargetLabel}
              onChange={(e) => { setNewTargetLabel(e.target.value); if (labelError) setLabelError(''); }}
              placeholder="My News Source"
              className={`w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border rounded-[6px] placeholder:text-[#5a5a5a] focus:outline-none transition-colors ${
                labelError ? 'border-[#ef4444]' : 'border-[#3d3a39] focus:border-[#00C170]/50'
              }`}
            />
            {labelError && <p className="text-[10px] text-[#ef4444] mt-1">{labelError}</p>}
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] mb-1.5 block">Source type</label>
            <select
              value={newTargetType}
              onChange={(e) => setNewTargetType(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-[#ffffff] bg-[#101010] border border-[#3d3a39] rounded-[6px] focus:outline-none focus:border-[#00C170]/50 transition-colors appearance-none"
            >
              <option value="news">News</option>
              <option value="social">Social Media</option>
              <option value="video">Video Platform</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => { setAddTargetOpen(false); setNewTargetUrl(''); setNewTargetLabel(''); setNewTargetType('news'); setUrlError(''); setLabelError(''); }}
            className="flex-1 py-2.5 text-sm font-semibold text-[#a0a0a0] border border-[#3d3a39] rounded-[6px] hover:text-[#ffffff] hover:border-[#5a5a5a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTarget}
            disabled={addingTarget}
            className="flex-1 py-2.5 text-sm font-semibold text-[#0A0A0A] bg-[#00C170] rounded-[6px] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {addingTarget ? 'Adding...' : 'Add Target'}
          </button>
        </div>
      </Modal>

      {/* ─── Alert Detail Modal ─── */}
      <Modal
        open={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.file ?? ''}
        description={`Detected from surveillance feed`}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${severityConfig[selectedAlert.severity].bg} ${severityConfig[selectedAlert.severity].text}`}>
                {severityConfig[selectedAlert.severity].label}
              </span>
              <VerdictBadge verdict={selectedAlert.verdict} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#a0a0a0]">Confidence</p>
                <p className="text-[#ffffff]">{selectedAlert.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-[#a0a0a0]">Detected</p>
                <p className="text-[#ffffff]">
                  {new Date(selectedAlert.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
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
