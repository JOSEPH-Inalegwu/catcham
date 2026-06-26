import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { supabase } = createRouteClient(request);
  const { workspaceId } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: membership, error } = await supabase
    .from("workspace_members")
    .select("preferences")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (error || !membership) {
    return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
  }

  const prefs = (membership.preferences as Record<string, unknown>) ?? {};

  return NextResponse.json({
    notifications: {
      realTime: prefs.realTime ?? true,
      dailyDigest: prefs.dailyDigest ?? false,
      weeklyDigest: prefs.weeklyDigest ?? false,
    },
    sessionTimeout: prefs.sessionTimeout ?? 30,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { supabase } = createRouteClient(request);
  const { workspaceId } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data: existing } = await supabase
    .from("workspace_members")
    .select("preferences")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
  }

  const currentPrefs = (existing.preferences as Record<string, unknown>) ?? {};
  const merged = { ...currentPrefs, ...body };

  const { error } = await supabase
    .from("workspace_members")
    .update({ preferences: merged })
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update preferences", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
