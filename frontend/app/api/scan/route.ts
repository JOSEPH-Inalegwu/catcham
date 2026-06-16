import { NextRequest, NextResponse } from "next/server";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const HIVE_API_URL = "https://api.thehive.ai/api/v3/chat/completions";

function detectMediaType(file: File): string {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

function getMimeType(file: File): string {
  return file.type || "application/octet-stream";
}

export async function POST(request: NextRequest) {
  if (!HIVE_API_KEY) {
    return NextResponse.json(
      { error: "HIVE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const mediaType = detectMediaType(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mime = getMimeType(file);
  const dataUri = `data:${mime};base64,${base64}`;

  const content: any[] = [
    {
      type: "text",
      text: `Analyze this ${mediaType} for signs of AI generation or deepfake manipulation. Consider visual artifacts, unnatural motion, audio inconsistencies, and any other synthetic indicators. Return ONLY a JSON object with these fields: verdict ("real" or "synthetic"), confidence (integer 0-100), anomaly_type (short description of what seemed off, or null if none). No other text.`,
    },
  ];

  if (mediaType === "video") {
    content.push({
      type: "media_url",
      media_url: {
        url: dataUri,
        sampling: { strategy: "fps", fps: 1 },
        prompt_scope: "once",
      },
    });
  } else {
    content.push({
      type: "image_url",
      image_url: { url: dataUri },
    });
  }

  try {
    const response = await fetch(HIVE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HIVE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "hive/vision-language-model",
        messages: [{ role: "user", content }],
        max_tokens: 150,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Hive API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ mediaType, result: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to communicate with Hive API" },
      { status: 500 }
    );
  }
}
