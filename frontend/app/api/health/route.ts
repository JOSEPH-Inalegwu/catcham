import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { status: "ok", timestamp, supabase: "not configured" },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("anonymous_scan_limits")
    .select("ip_address", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { status: "error", timestamp, supabase: error.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "ok", timestamp });
}
