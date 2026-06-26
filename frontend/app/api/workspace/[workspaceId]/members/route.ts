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

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: members, error } = await supabase
    .from("workspace_members")
    .select("id, user_id, role, display_name, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch members", details: error.message }, { status: 500 });
  }

  const enriched = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, avatar_url, display_name as profile_name")
        .eq("id", m.user_id)
        .single();

      return {
        id: m.id,
        userId: m.user_id,
        role: m.role,
        displayName: m.display_name ?? profile?.profile_name ?? "Unknown",
        email: profile?.email ?? "",
        avatarUrl: profile?.avatar_url ?? null,
        joinedAt: m.created_at,
      };
    })
  );

  return NextResponse.json({ members: enriched });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { supabase } = createRouteClient(request);
  const { workspaceId } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("owner_id, plan")
    .eq("id", workspaceId)
    .single();

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }
  if (workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Only the workspace owner can invite members" }, { status: 403 });
  }

  const { count: currentCount } = await supabase
    .from("workspace_members")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  const seatLimits: Record<string, number> = { sandbox: 2, pro: 10, enterprise: 999999 };
  const limit = seatLimits[workspace.plan] ?? 2;
  if (currentCount !== null && currentCount >= limit) {
    return NextResponse.json({ error: `Seat limit reached (${limit}) for ${workspace.plan} plan` }, { status: 400 });
  }

  const body = await request.json();
  const { email, displayName, role } = body;

  if (!email || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .eq("email", email.trim().toLowerCase())
    .single();

  if (!profile) {
    return NextResponse.json({ error: "No user found with that email address" }, { status: 404 });
  }

  const { data: alreadyMember } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", profile.id)
    .single();

  if (alreadyMember) {
    return NextResponse.json({ error: "User is already a member of this workspace" }, { status: 409 });
  }

  const { data: newMember, error } = await supabase
    .from("workspace_members")
    .insert({
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      user_id: profile.id,
      role: role ?? "member",
      display_name: displayName ?? profile.display_name ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add member", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: newMember }, { status: 201 });
}
