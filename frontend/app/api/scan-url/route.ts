import { NextRequest, NextResponse } from "next/server";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const MAX_SCANS = 3;
const HIVE_API_URL = "https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection";

const ALLOWED_CONTENT_TYPES: Record<string, { kind: "image" | "video"; maxBytes: number }> = {
  "image/jpeg": { kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/png": { kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/webp": { kind: "image", maxBytes: 10 * 1024 * 1024 },
  "image/gif": { kind: "image", maxBytes: 10 * 1024 * 1024 },
  "video/mp4": { kind: "video", maxBytes: 100 * 1024 * 1024 },
  "video/webm": { kind: "video", maxBytes: 100 * 1024 * 1024 },
  "video/quicktime": { kind: "video", maxBytes: 100 * 1024 * 1024 },
};

const MODEL_LABELS: Record<string, string> = {
  gemini3: "Gemini 3",
  gemini: "Gemini",
  stablediffusion: "Stable Diffusion",
  stablediffusionxl: "Stable Diffusion XL",
  stablediffusioninpaint: "Stable Diffusion Inpaint",
  sdxlinpaint: "SDXL Inpaint",
  flux: "Flux",
  flux2: "Flux 2",
  dalle: "DALL·E",
  midjourney: "Midjourney",
  ideogram: "Ideogram",
  kandinsky: "Kandinsky",
  adobefirefly: "Adobe Firefly",
  firefly: "Adobe Firefly",
  other_image_generators: "Other AI Generator",
  grokimagine: "Grok Imagine",
  heygen: "HeyGen",
  grok: "Grok",
  luma: "Luma",
  pika: "Pika",
  qwen: "Qwen",
  hunyuan: "Hunyuan",
  veo3: "Veo 3",
  imagen: "Imagen",
  imagen4: "Imagen 4",
  "4o": "4o",
  runway: "Runway",
  kling: "Kling",
  leonardo: "Leonardo",
  sora: "Sora",
  sora2: "Sora 2",
  meta: "Meta",
  pixart: "PixArt",
  cogview: "CogView",
  recraft: "Recraft",
  krea: "Krea",
  deepfloyd: "DeepFloyd",
  bingimagecreator: "Bing Image Creator",
  longcat: "LongCat",
  dreamid: "DreamID",
  hedra: "Hedra",
  var: "VAR",
  gan: "GAN",
  reve: "Reve",
  personalive: "PersonaLive",
  zimage: "ZImage",
  moonvalley: "Moon Valley",
  liveportrait: "LivePortrait",
  seedream: "SeeDream",
  steadydancer: "SteadyDancer",
  higgsfield: "Higgsfield",
  wan: "WAN",
  seedance: "Seedance",
  seedance2: "Seedance 2",
  gptimage2: "GPT Image 2",
  gptimage1_5: "GPT Image 1.5",
  halo: "Hallo",
};

const EDIT_TOOLS = new Set([
  "background_removal", "inpainting", "outpainting", "image_to_image",
]);

function nextMidnightUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
}

function getIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "127.0.0.1";
}

const SOCIAL_HOSTS = [
  "youtube.com", "youtu.be", "facebook.com", "instagram.com",
  "twitter.com", "x.com", "tiktok.com",
];

function isSocialHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return SOCIAL_HOSTS.some((d) => h === d || h.endsWith("." + d));
}

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".internal")) return true;
  if (h === "::1" || h === "[::1]") return true;
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!HIVE_API_KEY) {
    return NextResponse.json(
      { error: "HIVE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    let body: { url?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const url = body.url?.trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { error: "Enter a valid URL starting with http:// or https://" },
        { status: 400 }
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Enter a valid URL starting with http:// or https://" }, { status: 400 });
    }

    if (isSocialHost(parsed.hostname)) {
      return NextResponse.json(
        { error: "Social media URLs are not supported. Download the file and upload it directly instead." },
        { status: 422 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const ip = getIp(request);

    const today = new Date().toISOString().slice(0, 10);
    const { data: record, error: lookupErr } = await supabase
      .from("anonymous_scan_limits")
      .select("ip_address, scan_count, last_scan_date")
      .eq("ip_address", ip)
      .maybeSingle();

    if (lookupErr) {
      console.error("Rate limit lookup error:", lookupErr);
      return NextResponse.json({ error: "Unable to verify scan limit" }, { status: 503 });
    }

    if (record?.last_scan_date === today && record.scan_count >= MAX_SCANS) {
      return NextResponse.json(
        { error: "Daily scan limit reached. Create a free account for more scans.", retryAfter: nextMidnightUtc().toISOString() },
        { status: 429 },
      );
    }

    const nextCount = record?.last_scan_date === today ? record.scan_count + 1 : 1;
    const { error: countError } = record
      ? await supabase
          .from("anonymous_scan_limits")
          .update({ scan_count: nextCount, last_scan_date: today })
          .eq("ip_address", ip)
      : await supabase
          .from("anonymous_scan_limits")
          .insert({ ip_address: ip, scan_count: 1, last_scan_date: today });

    if (countError) {
      console.error("Rate limit update error:", countError);
      return NextResponse.json({ error: "Unable to reserve scan" }, { status: 503 });
    }

    if (isBlockedHost(parsed.hostname)) {
      return NextResponse.json(
        { error: "Could not fetch this URL. Make sure it's a direct link to an image or video file." },
        { status: 422 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let mediaResponse: Response;
    try {
      mediaResponse = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "CatchAm-AI-Scanner/1.0" },
      });
    } catch {
      return NextResponse.json(
        { error: "Could not fetch this URL. Make sure it's a direct link to an image or video file." },
        { status: 422 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: "Could not fetch this URL. Make sure it's a direct link to an image or video file." },
        { status: 422 }
      );
    }

    const contentType = (mediaResponse.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (contentType === "text/html") {
      return NextResponse.json(
        { error: "This URL points to a webpage, not a media file. Try right-clicking the image/video and copying the direct media link." },
        { status: 422 }
      );
    }
    const mediaRule = ALLOWED_CONTENT_TYPES[contentType];
    if (!mediaRule) {
      return NextResponse.json(
        { error: "Unsupported media type. URL must point to a JPEG, PNG, WebP, GIF image or MP4, WebM, MOV video." },
        { status: 415 }
      );
    }

    const buffer = Buffer.from(await mediaResponse.arrayBuffer());
    if (buffer.byteLength > mediaRule.maxBytes) {
      return NextResponse.json(
        { error: `File too large. ${mediaRule.kind === "image" ? "Image" : "Video"} files must be under ${Math.round(mediaRule.maxBytes / (1024 * 1024))}MB.` },
        { status: 413 }
      );
    }

    let hiveInput: { media_base64: string } | { media_url: string };
    let storagePath: string | null = null;

    if (mediaRule.kind === "image") {
      hiveInput = { media_base64: buffer.toString("base64") };
    } else {
      storagePath = `public-scans/${randomUUID()}/url-scan.mp4`;
      const { error: uploadError } = await supabase.storage
        .from("scan-uploads")
        .upload(storagePath, buffer, { contentType });
      if (uploadError) {
        console.error("Scan upload error:", uploadError);
        return NextResponse.json({ error: "Unable to store media for analysis" }, { status: 500 });
      }
      const { data: signed, error: signedError } = await supabase.storage
        .from("scan-uploads")
        .createSignedUrl(storagePath, 3600);
      if (signedError || !signed?.signedUrl) {
        await supabase.storage.from("scan-uploads").remove([storagePath]);
        console.error("Signed URL error:", signedError);
        return NextResponse.json({ error: "Unable to prepare media for analysis" }, { status: 500 });
      }
      hiveInput = { media_url: signed.signedUrl };
    }

    const cleanupUpload = async () => {
      if (storagePath) {
        await supabase.storage.from("scan-uploads").remove([storagePath]);
      }
    };

    const response = await fetch(HIVE_API_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${HIVE_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [hiveInput],
      }),
    });

    if (!response.ok) {
      await cleanupUpload();
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Hive error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    await cleanupUpload();
    const classes: { class: string; value: number }[] = data.output?.[0]?.classes ?? [];

    const aiScore = classes.find((c) => c.class === "ai_generated")?.value ?? 0;
    const deepfakeScore = classes.find((c) => c.class === "deepfake")?.value ?? 0;
    const audioScore = classes.find((c) => c.class === "ai_generated_audio")?.value ?? 0;

    const maxModelScore = Math.max(
      ...classes
        .filter((c) => HIVE_GENERATIVE_MODELS.has(c.class))
        .map((c) => c.value),
      0
    );

    const visual_generation_risk = Math.round(
      Math.max(aiScore, deepfakeScore, audioScore) * 100
    );

    const isSynthetic =
      aiScore >= 0.7 ||
      deepfakeScore >= 0.7 ||
      audioScore >= 0.7 ||
      maxModelScore >= 0.5;

    const maxScore = Math.max(aiScore, deepfakeScore, audioScore, maxModelScore);
    const confidence = isSynthetic
      ? Math.round(maxScore * 100)
      : Math.round((1 - Math.max(aiScore, deepfakeScore, audioScore)) * 100);

    let anomaly_type = null;
    let classificationTag: string | null = null;

    if (isSynthetic) {
      const hasHighSynthesis = classes.some(
        (c) => HIVE_GENERATIVE_MODELS.has(c.class) && c.value >= 0.5
      );
      const hasEditTool = classes.some(
        (c) => EDIT_TOOLS.has(c.class) && c.value >= 0.01
      );
      const hasDeepfake = deepfakeScore >= 0.7;

      if (hasHighSynthesis) {
        classificationTag = "Full Synthetic Generation";
        anomaly_type = "AI-generated image detected";
      } else if (hasDeepfake) {
        classificationTag = "Deepfake / Face Manipulation";
        anomaly_type = "Face manipulation detected";
      } else if (hasEditTool) {
        classificationTag = "AI-Edited / Background Modified Asset";
        anomaly_type = "AI-edited content detected";
      } else if (audioScore >= 0.7) {
        anomaly_type = "AI-generated voice detected";
      } else {
        anomaly_type = "AI-generated image detected";
      }
    }

    const aiGeneratedScore = (aiScore * 100).toFixed(1) + "%";

    const generation_sources: { source: string; label: string; probability: string }[] = [];
    for (const c of classes) {
      if (HIVE_GENERATIVE_MODELS.has(c.class) && c.value > 0.5) {
        generation_sources.push({
          source: c.class,
          label: MODEL_LABELS[c.class] ?? c.class,
          probability: (c.value * 100).toFixed(1) + "%",
        });
      }
    }
    generation_sources.sort(
      (a, b) => parseFloat(b.probability) - parseFloat(a.probability)
    );

    return NextResponse.json({
      success: true,
      verdict: isSynthetic ? "synthetic" : "real",
      confidence,
      visual_generation_risk,
      ai_generated_score: aiGeneratedScore,
      anomaly_type,
      classification_tag: classificationTag,
      generation_sources,
      media_type: mediaRule.kind,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Scan failed", details: error.message },
      { status: 500 }
    );
  }
}
