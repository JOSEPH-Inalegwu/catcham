import { NextRequest, NextResponse } from "next/server";

const store = new Map<string, any>();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  store.set(id, { id, ...data });
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = store.get(id);

  if (!result) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
