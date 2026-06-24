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

  const [
    { count: totalScans },
    { count: threatsDetected },
    { count: filesCleared },
    { count: suspiciousCount },
    { data: flaggedItems },
    { count: activeMonitoring },
  ] = await Promise.all([
    supabase.from("scans").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("scans").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("verdict", "Synthetic"),
    supabase.from("scans").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("verdict", "Authentic"),
    supabase.from("scans").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("verdict", "Suspicious"),
    supabase
      .from("scans")
      .select("id, file_name, file_type, verdict, confidence, anomaly_type, analysed_at")
      .eq("workspace_id", workspaceId)
      .in("verdict", ["Synthetic", "Suspicious"])
      .order("analysed_at", { ascending: false })
      .limit(5),
    supabase.from("monitoring_targets").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "active"),
  ]);

  const confidenceBands = { high: 0, medium: 0, low: 0 };
  if (totalScans && totalScans > 0) {
    const { data: allScans } = await supabase
      .from("scans")
      .select("confidence")
      .eq("workspace_id", workspaceId);

    if (allScans) {
      for (const s of allScans) {
        if (s.confidence >= 80) confidenceBands.high++;
        else if (s.confidence >= 50) confidenceBands.medium++;
        else confidenceBands.low++;
      }
    }
  }

  const total = (totalScans ?? 0);
  const synthetic = (threatsDetected ?? 0);
  const authentic = (filesCleared ?? 0);
  const suspicious = (suspiciousCount ?? 0);

  return NextResponse.json({
    metrics: {
      totalScans: total,
      threatsDetected: synthetic,
      filesCleared: authentic,
      suspiciousCount: suspicious,
      activeMonitoring: activeMonitoring ?? 0,
    },
    detectionRatio: {
      authentic,
      suspicious,
      synthetic,
    },
    confidenceBands,
    flaggedItems: flaggedItems ?? [],
  });
}
