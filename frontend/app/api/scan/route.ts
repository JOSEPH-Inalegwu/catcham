import { NextRequest, NextResponse } from "next/server";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";
import { createClient } from "@supabase/supabase-js";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, readFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import { execSync } from "child_process";
import path from "path";

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mediaType = classifyFile(file.name);
    if (!mediaType) {
      return NextResponse.json(
        { error: "Unsupported file format. Upload an image (jpg, png, webp), video (mp4, mov, avi, webm), or audio (mp3, wav, m4a, ogg) file." },
        { status: 415 }
      );
    }

    const { maxBytes } = MEDIA_LIMITS[mediaType];
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. ${mediaType[0].toUpperCase() + mediaType.slice(1)} files must be under ${Math.round(maxBytes / (1024 * 1024))}MB.` },
        { status: 413 }
      );
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch (err: any) {
      console.error("Failed to read file:", err);
      return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
    }

    if (mediaType === "video") {
      let ffmpegAvailable = false;
      try {
        execSync("ffmpeg -version", { stdio: "ignore", timeout: 5000 });
        ffmpegAvailable = true;
      } catch {}

      if (ffmpegAvailable) {
        const inputPath = path.join(tmpdir(), `catcham-${randomUUID()}.mp4`);

        try {
          await writeFile(inputPath, buffer);

          const duration = await new Promise<number>((resolve, reject) => {
            (ffmpeg as unknown as { ffprobe: (file: string, cb: (err: Error | null, data: { format: { duration?: number } }) => void) => void }).ffprobe(
              inputPath,
              (err, data) => {
                if (err) return reject(err);
                resolve(data?.format?.duration ?? 0);
              }
            );
          });

          if (duration > 60) {
            const outputPath = path.join(tmpdir(), `catcham-trimmed-${randomUUID()}.mp4`);

            await new Promise<void>((resolve, reject) => {
              ffmpeg(inputPath)
                .outputOptions(["-t", "60", "-c", "copy"])
                .output(outputPath)
                .on("end", () => resolve())
                .on("error", (err) => reject(err))
                .run();
            });

            buffer = await readFile(outputPath);
            await Promise.all([unlink(outputPath).catch(() => {}), unlink(inputPath).catch(() => {})]);
          } else {
            await unlink(inputPath).catch(() => {});
          }
        } catch (err: any) {
          await unlink(inputPath).catch(() => {});
          console.error("Video processing failed:", err);
          return NextResponse.json({ error: "Video must be under 60 seconds" }, { status: 422 });
        }
      }
    }

    let hiveInput: { media_base64: string } | FormData;

    if (mediaType === "image") {
      hiveInput = { media_base64: buffer.toString("base64") };
    } else {
      const blob = new Blob([new Uint8Array(buffer)], { type: file.type || "application/octet-stream" });
      const multiForm = new FormData();
      multiForm.append("media", blob, file.name);
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
  } catch (error: any) {
    console.error("Scan failed:", error);
    return NextResponse.json(
      { error: "Scan failed", details: error.message },
      { status: 500 }
    );
  }
}