import { NextRequest, NextResponse } from "next/server";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const HIVE_API_URL = "https://api.thehive.ai/api/v2/task/sync";

const MODEL_MAP: Record<string, string> = {
  image: "hive/deepfake-detection",
  video: "hive/deepfake-detection",
  audio: "hive/ai-generated-audio-detection",
};

function detectMediaType(file: File): string {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
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
  const model = MODEL_MAP[mediaType];

  const hiveBody = new FormData();
  hiveBody.append("file", file);

  try {
    const response = await fetch(HIVE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${HIVE_API_KEY}`,
      },
      body: hiveBody,
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
