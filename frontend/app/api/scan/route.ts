import { NextRequest, NextResponse } from "next/server";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import path from "path";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const MAX_SCANS = 3;

type MediaType = "image" | "video" | "audio";

const MEDIA_LIMITS: Record<MediaType, { exts: string[]; maxBytes: number }> = {
  image: { exts: ["jpg", "jpeg", "png", "webp", "gif", "bmp"], maxBytes: 10 * 1024 * 1024 },
  video: { exts: ["mp4", "mov", "avi", "webm"], maxBytes: 100 * 1024 * 1024 },
  audio: { exts: ["mp3", "wav", "m4a", "ogg"], maxBytes: 50 * 1024 * 1024 },
};

function classifyFile(fileName: string): MediaType | null {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  for (const [type, limit] of Object.entries(MEDIA_LIMITS)) {
    if (limit.exts.includes(ext)) return type as MediaType;
  }
  return null;
}

function nextMidnightUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
}

function getIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "127.0.0.1";
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
const HIVE_API_URL = "https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection";

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

const SYNTHESIS_MODELS = new Set([
  "midjourney", "stablediffusion", "dalle", "flux", "firefly",
  "ideogram", "kandinsky", "other_image_generators",
]);

const EDIT_TOOLS = new Set([
  "background_removal", "inpainting", "outpainting", "image_to_image",
]);

export async function POST(request: NextRequest) {
  if (!HIVE_API_KEY) {
    return NextResponse.json(
      { error: "HIVE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
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

    const refundScan = async (reason: string) => {
      try {
        const { data: row } = await supabase
          .from("anonymous_scan_limits")
          .select("scan_count")
          .eq("ip_address", ip)
          .maybeSingle();
        if (row && row.scan_count > 0) {
          await supabase
            .from("anonymous_scan_limits")
            .update({ scan_count: row.scan_count - 1 })
            .eq("ip_address", ip);
          console.log(`Scan refunded for IP: ${ip} — reason: ${reason}`);
        }
      } catch (err) {
        console.error("Failed to refund scan:", err);
      }
    };

    const contentType = request.headers.get("content-type") ?? "";
    let buffer: Buffer;
    let fileName: string;
    let fileType: string;
    let mediaType: MediaType;
    let storagePathToDelete: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null);
      const supabaseUrl = body?.supabase_url;
      if (!supabaseUrl || typeof supabaseUrl !== "string") {
        return NextResponse.json({ error: "Missing supabase_url" }, { status: 400 });
      }
      if (!/^https?:\/\//i.test(supabaseUrl)) {
        return NextResponse.json({ error: "Invalid supabase_url" }, { status: 400 });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(supabaseUrl);
      } catch {
        return NextResponse.json({ error: "Invalid supabase_url" }, { status: 400 });
      }

      if (isBlockedHost(parsedUrl.hostname)) {
        return NextResponse.json({ error: "Invalid supabase_url" }, { status: 400 });
      }

      const prefix = "/storage/v1/object/public/scan-uploads/";
      const idx = parsedUrl.pathname.indexOf(prefix);
      if (idx < 0) {
        return NextResponse.json({ error: "Invalid supabase_url path" }, { status: 400 });
      }
      storagePathToDelete = decodeURIComponent(parsedUrl.pathname.substring(idx + prefix.length));
      fileName = storagePathToDelete.split("/").pop() ?? "video.mp4";

      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 60000);
      let mediaResponse: Response;
      try {
        mediaResponse = await fetch(supabaseUrl, { signal: controller.signal });
      } catch {
        clearTimeout(fetchTimeout);
        return NextResponse.json({ error: "Could not fetch uploaded file" }, { status: 502 });
      }
      clearTimeout(fetchTimeout);

      if (!mediaResponse.ok) {
        await supabase.storage.from("scan-uploads").remove([storagePathToDelete]).catch(() => {});
        return NextResponse.json({ error: "Could not fetch uploaded file" }, { status: 502 });
      }

      fileType = (mediaResponse.headers.get("content-type") ?? "video/mp4").split(";")[0].trim();
      buffer = Buffer.from(await mediaResponse.arrayBuffer());

      if (buffer.byteLength > 100 * 1024 * 1024) {
        await supabase.storage.from("scan-uploads").remove([storagePathToDelete]).catch(() => {});
        return NextResponse.json(
          { error: "File too large. Video files must be under 100MB." },
          { status: 413 }
        );
      }

      mediaType = "video";
    } else {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      fileName = file.name;
      fileType = file.type;

      const classified = classifyFile(file.name);
      if (!classified) {
        return NextResponse.json(
          { error: "Unsupported file format. Upload an image (jpg, png, webp), video (mp4, mov, avi, webm), or audio (mp3, wav, m4a, ogg) file." },
          { status: 415 }
        );
      }
      mediaType = classified;

      const { maxBytes } = MEDIA_LIMITS[mediaType];
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File too large. ${mediaType[0].toUpperCase() + mediaType.slice(1)} files must be under ${Math.round(maxBytes / (1024 * 1024))}MB.` },
          { status: 413 }
        );
      }

      try {
        buffer = Buffer.from(await file.arrayBuffer());
      } catch (err: any) {
        console.error("Failed to read file:", err);
        return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
      }
    }

    try {
      if (mediaType === "video") {
        const tmpPath = path.join(tmpdir(), `catcham-${randomUUID()}.mp4`);
        try {
          await writeFile(tmpPath, buffer);
          const { execSync } = await import("child_process");
          const probe = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tmpPath}"`,
            { timeout: 10000 }
          );
          const duration = parseFloat(probe.toString().trim());
          if (duration > 60) {
            return NextResponse.json(
              { error: "Video must be under 60 seconds. Your video is " + Math.round(duration) + "s." },
              { status: 422 }
            );
          }
        } catch {
          // ffprobe not available — proceed without duration check
        } finally {
          await unlink(tmpPath).catch(() => {});
        }
      }

    let hiveInput: { media_base64: string } | FormData;

    if (mediaType === "image") {
      hiveInput = { media_base64: buffer.toString("base64") };
    } else {
      const blob = new Blob([new Uint8Array(buffer)], { type: fileType || "application/octet-stream" });
      const multiForm = new FormData();
      multiForm.append("media", blob, fileName);
      hiveInput = multiForm;
    }

    const isMultipart = hiveInput instanceof FormData;

    let response: Response;
    try {
      response = await fetch(HIVE_API_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${HIVE_API_KEY.trim()}`,
          ...(isMultipart ? {} : { "Content-Type": "application/json" }),
        },
        body: isMultipart
          ? (hiveInput as FormData)
          : JSON.stringify({ input: [(hiveInput as { media_base64: string })] }),
      });
    } catch (err: any) {
      console.error("Failed to reach Hive:", err);
      await refundScan("network_error");
      return NextResponse.json({ error: "Failed to reach Hive API" }, { status: 502 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hive error:", response.status, errorText);
      if (response.status >= 500 && response.status <= 599) {
        await refundScan(String(response.status));
      }
      return NextResponse.json(
        { error: `Hive error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const outputs: { classes: { class: string; value: number }[] }[] = data.output ?? [];

    let classes: { class: string; value: number }[];

    if (mediaType === "video" && outputs.length > 0) {
      const classMap: Record<string, number> = {};
      for (const frame of outputs) {
        for (const c of frame.classes ?? []) {
          classMap[c.class] = Math.max(classMap[c.class] ?? 0, c.value);
        }
      }
      classes = Object.entries(classMap).map(([cls, val]) => ({ class: cls, value: val }));
    } else {
      classes = outputs[0]?.classes ?? [];
    }

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

    let isSynthetic: boolean;

    if (mediaType === "video") {
      isSynthetic = outputs.some((frame) => {
        const aiGen = (frame.classes ?? []).find((c) => c.class === "ai_generated")?.value ?? 0;
        const df = (frame.classes ?? []).find((c) => c.class === "deepfake")?.value ?? 0;
        return aiGen >= 0.9 || df >= 0.9;
      });
    } else {
      isSynthetic =
        aiScore >= 0.7 ||
        deepfakeScore >= 0.7 ||
        audioScore >= 0.7 ||
        maxModelScore >= 0.5;
    }

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
    });
    } finally {
      if (storagePathToDelete) {
        await supabase.storage.from("scan-uploads").remove([storagePathToDelete]).catch(() => {});
      }
    }
  } catch (error: any) {
    console.error("Scan failed:", error);
    return NextResponse.json(
      { error: "Scan failed", details: error.message },
      { status: 500 }
    );
  }
}