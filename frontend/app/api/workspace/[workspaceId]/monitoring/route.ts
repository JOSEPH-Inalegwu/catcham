import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { supabase } = createRouteClient(request);
  const { workspaceId } = await params;

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const [
    targetsResult,
    alertsResult,
    { count: totalAlerts },
    { count: criticalAlerts },
  ] = await Promise.all([
    supabase
      .from("monitoring_targets")
      .select("id, url, label, status, type, last_scan_at, created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false }),
    supabase
      .from("monitoring_alerts")
      .select("id, target_id, file_name, verdict, confidence, severity, detected_at, source_url")
      .eq("workspace_id", workspaceId)
      .gte("detected_at", weekAgo)
      .order("detected_at", { ascending: false })
      .limit(20),
    supabase
      .from("monitoring_alerts")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    supabase
      .from("monitoring_alerts")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("severity", "critical"),
  ]);

  const targets = (targetsResult.data ?? []).map((t) => ({
    id: t.id,
    url: t.url,
    label: t.label,
    status: t.status,
    type: t.type,
    lastScan: t.last_scan_at,
    alerts: alertsResult.data?.filter((a) => a.target_id === t.id).length ?? 0,
  }));

  const alerts = (alertsResult.data ?? []).map((a) => ({
    id: a.id,
    targetId: a.target_id,
    file: a.file_name,
    sourceUrl: a.source_url,
    date: a.detected_at,
    severity: a.severity,
    verdict: a.verdict,
    confidence: a.confidence,
  }));

  const activeTargets = targets.filter((t) => t.status === "active").length;

  return NextResponse.json({
    crawler: {
      status: "active",
      sourcesToday: activeTargets,
      lastScan: null,
      queue: 0,
      activeTargets,
    },
    metrics: {
      sourcesMonitored: activeTargets,
      alertsThisWeek: alerts.length,
      criticalFlags: criticalAlerts ?? 0,
      uptime: 99.2,
    },
    targets,
    alerts,
    recentScans: [],
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { supabase } = createRouteClient(request);
  const { workspaceId } = await params;

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { url?: string; label?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, label, type } = body;
  if (!url || !url.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const trimmedUrl = url.trim();
  try {
    const parsed = new URL(trimmedUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
    }
    if (!parsed.hostname.includes('.')) {
      return NextResponse.json({ error: "Enter a valid domain" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Enter a valid URL" }, { status: 400 });
  }

  const sanitizedLabel = label
    ? label.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().slice(0, 100)
    : null;

  const { data: target, error } = await supabase
    .from("monitoring_targets")
    .insert({
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      url: trimmedUrl,
      label: sanitizedLabel || trimmedUrl,
      type: type || "news",
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create target", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ target });
}
