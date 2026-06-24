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

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start") || new Date(Date.now() - 7 * 86400000).toISOString();
  const endDate = searchParams.get("end") || new Date().toISOString();

  const [scansResult, creditsResult, workspaceResult, membersResult] = await Promise.all([
    supabase
      .from("scans")
      .select("id, file_name, file_type, verdict, confidence, analysed_at, created_at")
      .eq("workspace_id", workspaceId)
      .gte("analysed_at", startDate)
      .lte("analysed_at", endDate)
      .order("analysed_at", { ascending: false }),
    supabase
      .from("credit_transactions")
      .select("amount, type, created_at, description")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false }),
    supabase
      .from("workspaces")
      .select("plan")
      .eq("id", workspaceId)
      .single(),
    supabase
      .from("workspace_members")
      .select("user_id, role")
      .eq("workspace_id", workspaceId),
  ]);

  const scans = scansResult.data ?? [];
  const transactions = creditsResult.data ?? [];
  const workspace = workspaceResult.data;
  const members = membersResult.data ?? [];

  const totalCreditsUsed = transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalCreditsPurchased = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);

  const scansToday = scans.filter((s) => {
    const d = new Date(s.analysed_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return NextResponse.json({
    scans: scans.map((s) => ({
      id: s.id,
      date: s.analysed_at,
      type: s.file_type === "video" ? "Video Scan" : s.file_type === "audio" ? "Audio Scan" : "Image Scan",
      details: s.file_name,
      credits: 1,
      status: s.verdict ? "completed" : "pending",
      verdict: s.verdict,
      confidence: s.confidence,
    })),
    credits: {
      used: totalCreditsUsed,
      purchased: totalCreditsPurchased,
      balance: totalCreditsPurchased - totalCreditsUsed,
    },
    scansToday,
    plan: workspace?.plan ?? "sandbox",
    teamSize: members.length,
  });
}
