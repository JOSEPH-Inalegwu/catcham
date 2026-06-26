"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Alert = {
  id: string;
  severity: string;
  verdict: string;
  file_name: string;
  detected_at: string;
};

export default function NotificationBell() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const res = await fetch(`/api/workspace/${workspaceId}/monitoring`);
      const json = await res.json();
      if (json.alerts) {
        setAlerts(json.alerts.slice(0, 10));
      }
    } catch {
      // silent
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (!workspaceId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`monitoring_alerts:workspace_id=eq.${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'monitoring_alerts',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload: RealtimePostgresChangesPayload<Alert>) => {
          const newAlert = payload.new as Alert;
          setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const newCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-[6px] hover:bg-[#1A1A1A] transition-colors"
      >
        <svg className="w-5 h-5 text-[#a0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {newCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center bg-[#f87171] text-[#ffffff] text-[10px] font-semibold rounded-full min-w-[18px] min-h-[18px]">
            {newCount > 9 ? '9+' : newCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute top-full right-0 mt-2 w-[360px] bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] shadow-2xl z-50 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-[#3d3a39] flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#ffffff]">Alerts</h4>
            <span className="text-xs text-[#5a5a5a]">{alerts.length} recent</span>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-[#5a5a5a] text-center py-8">No recent alerts</p>
            ) : (
              alerts.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#141414] transition-colors border-b border-[#3d3a39]/50 last:border-0">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      a.severity === 'critical' ? 'bg-[#ef4444]' : a.severity === 'warning' ? 'bg-[#f59e0b]' : 'bg-[#00C170]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#ffffff] truncate">{a.file_name || 'Alert'}</p>
                    <p className="text-xs text-[#a0a0a0] mt-0.5">
                      {a.verdict} &middot; {new Date(a.detected_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
