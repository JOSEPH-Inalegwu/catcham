import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "127.0.0.1";
}

export async function GET(request: NextRequest) {
  const ip = getIp(request);

  const { data: record } = await supabase
    .from("anonymous_scan_limits")
    .select("scan_count, last_scan_date")
    .eq("ip_address", ip)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ remaining: 3, total: 3, window_end: null });
  }

  const today = new Date().toISOString().slice(0, 10);

  if (record.last_scan_date !== today) {
    return NextResponse.json({ remaining: 3, total: 3, window_end: null });
  }

  const remaining = Math.max(0, 3 - record.scan_count);
  const windowEnd = remaining > 0 ? null : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1)).toISOString();

  return NextResponse.json({
    remaining,
    total: 3,
    window_end: windowEnd,
  });
}
