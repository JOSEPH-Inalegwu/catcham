import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const { supabase, supabaseResponse } = createRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 2MB." }, { status: 400 });
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let processed: Buffer;
    try {
      const sharp = (await import("sharp")).default;
      processed = await sharp(buffer)
        .resize(400, 400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      console.log("Image processed with sharp");
    } catch {
      processed = buffer;
      console.log("Sharp unavailable, using raw canvas blob");
    }

    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, processed, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload to storage", details: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData?.publicUrl;

    if (avatarUrl) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (profileError) {
        return NextResponse.json(
          { error: "Failed to save avatar URL", details: profileError.message },
          { status: 500, headers: supabaseResponse.headers }
        );
      }
    }

    return NextResponse.json({ avatarUrl }, { headers: supabaseResponse.headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Image processing failed";
    return NextResponse.json({ error: msg, details: String(err) }, { status: 500 });
  }
}
