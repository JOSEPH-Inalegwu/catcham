import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const { supabase } = createRouteClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.full_name ?? user.email ?? "User",
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      },
    });
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
    },
  });
}

export async function PUT(request: NextRequest) {
  const { supabase } = createRouteClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, string> = {};

  if (body.displayName !== undefined) {
    const sanitized = body.displayName
      .replace(/<[^>]*>/g, "")
      .replace(/[<>"'&]/g, "")
      .trim()
      .slice(0, 100);

    if (!sanitized) {
      return NextResponse.json({ error: "Display name cannot be empty" }, { status: 400 });
    }
    updates.display_name = sanitized;
  }

  if (body.avatarUrl !== undefined) {
    if (body.avatarUrl && typeof body.avatarUrl === "string") {
      try {
        new URL(body.avatarUrl);
      } catch {
        return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
      }
    }
    updates.avatar_url = body.avatarUrl || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
