import { NextRequest, NextResponse } from "next/server";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";
import { createClient } from "@supabase/supabase-js";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const MAX_SCANS = 3;

function midnightUtc(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function nextMidnightUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
}

function getIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? request.ip
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
  "longcat": "LongCat",
  dreamid: "DreamID",
  hedra: "Hedra",
  var: "VAR",
  gan: "GAN",
  "reve": "Reve",
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

    const { data: record, error: lookupErr } = await supabase
      .from("public_scan_limits")
      .select("id, scan_count, window_start")
      .eq("ip_address", ip)
      .maybeSingle();

    if (lookupErr) {
      console.error("Rate limit lookup error:", lookupErr);
    }

    let dbCount = 0;
    let shouldBlock = false;
    let retryAfter: string | null = null;

    if (record) {
      const now = new Date();
      const todayMidnight = midnightUtc(now);
      const windowDay = midnightUtc(new Date(record.window_start));

      if (windowDay < todayMidnight) {
        const { error: resetErr } = await supabase
          .from("public_scan_limits")
          .update({ scan_count: 1, window_start: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", record.id);
        if (resetErr) console.error("Rate limit reset error:", resetErr);
        dbCount = 1;
      } else {
        dbCount = record.scan_count;
        if (dbCount >= MAX_SCANS) {
          shouldBlock = true;
          retryAfter = nextMidnightUtc().toISOString();
        }
      }
    } else {
      const { error: insertErr } = await supabase
        .from("public_scan_limits")
        .insert({ ip_address: ip, scan_count: 0 });
      if (insertErr) console.error("Rate limit insert error:", insertErr);
      dbCount = 0;
    }

    if (shouldBlock) {
      return NextResponse.json(
        {
          error: "Scan limit reached. Try again in 24 hours.",
          retryAfter,
          _debug: { ip, dbCount, blocked: true },
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = buffer.toString("base64");

    const response = await fetch(HIVE_API_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${HIVE_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [{ media_base64: base64String }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Hive error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
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

    const { data: current } = await supabase
      .from("public_scan_limits")
      .select("scan_count")
      .eq("ip_address", ip)
      .maybeSingle();
    if (current) {
      await supabase
        .from("public_scan_limits")
        .update({ scan_count: current.scan_count + 1, updated_at: new Date().toISOString() })
        .eq("ip_address", ip);
    } else {
      await supabase
        .from("public_scan_limits")
        .insert({ ip_address: ip, scan_count: 1 });
    }

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
    return NextResponse.json(
      { error: "Scan failed", details: error.message },
      { status: 500 }
    );
  }
}
