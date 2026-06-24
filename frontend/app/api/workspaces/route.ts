import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const { supabase } = createRouteClient(request);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized", details: authError?.message }, { status: 401 });
  }

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  if (!memberships || memberships.length === 0) {
    return NextResponse.json({ workspaces: [] });
  }

  const ids = memberships.map((m) => m.workspace_id);
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", ids);

  return NextResponse.json({ workspaces: workspaces ?? [] });
}

export async function POST(request: NextRequest) {
  const { supabase } = createRouteClient(request);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized", details: authError?.message }, { status: 401 });
  }

  let body: { name?: string; industry?: string; domain?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, industry, domain, plan } = body;

  if (!name || !plan) {
    return NextResponse.json({ error: "Name and plan are required" }, { status: 400 });
  }

  const id = crypto.randomUUID();

  const { data: workspace, error: insertError } = await supabase
    .from("workspaces")
    .insert({
      id,
      name,
      industry: industry ?? null,
      domain: domain ?? null,
      plan,
      owner_id: user.id,
    })
    .select()
    .single();

  if (insertError || !workspace) {
    return NextResponse.json({
      error: "Failed to create workspace",
      details: insertError?.message,
      hint: insertError?.hint,
      code: insertError?.code,
    }, { status: 500 });
  }

  const { error: memberError } = await supabase.from("workspace_members").insert({
    id: crypto.randomUUID(),
    workspace_id: id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    return NextResponse.json({
      error: "Workspace created but failed to add member",
      details: memberError.message,
    }, { status: 500 });
  }

  return NextResponse.json({ workspace });
}
