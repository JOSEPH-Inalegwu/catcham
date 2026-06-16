import { NextRequest, NextResponse } from "next/server";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
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

    const visual_generation_risk = Math.round(
      Math.max(aiScore, deepfakeScore, audioScore) * 100
    );

    const isSynthetic = aiScore >= 0.9 || deepfakeScore >= 0.9 || audioScore >= 0.9;

    const confidence = isSynthetic
      ? visual_generation_risk
      : Math.round((1 - Math.max(aiScore, deepfakeScore, audioScore)) * 100);

    let anomaly_type = null;
    let classificationTag: string | null = null;

    if (isSynthetic) {
      const hasHighSynthesis = classes.some(
        (c) => SYNTHESIS_MODELS.has(c.class) && c.value >= 0.8
      );
      const hasEditTool = classes.some(
        (c) => EDIT_TOOLS.has(c.class) && c.value >= 0.01
      );
      const hasDeepfake = deepfakeScore >= 0.9;

      if (hasHighSynthesis) {
        classificationTag = "Full Synthetic Generation";
        anomaly_type = "AI-generated image detected";
      } else if (hasDeepfake) {
        classificationTag = "Deepfake / Face Manipulation";
        anomaly_type = "Face manipulation detected";
      } else if (hasEditTool) {
        classificationTag = "AI-Edited / Background Modified Asset";
        anomaly_type = "AI-edited content detected";
      } else if (audioScore >= 0.9) {
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
    return NextResponse.json(
      { error: "Scan failed", details: error.message },
      { status: 500 }
    );
  }
}
