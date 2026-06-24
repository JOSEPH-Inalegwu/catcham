import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-handler";
import { HIVE_GENERATIVE_MODELS } from "@/lib/hive-models";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";
import * as blazeface from "@tensorflow-models/blazeface";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const HIVE_API_KEY = process.env.HIVE_API_KEY;
const PASS1_URL = "https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection";

const RISK_THRESHOLD_CRITICAL = 0.70;
const RISK_THRESHOLD_SUSPICIOUS = 0.50;

let blazefaceModel: blazeface.BlazeFaceModel | null = null;

async function getBlazeFaceModel() {
  if (!blazefaceModel) {
    await tf.setBackend('cpu');
    await tf.ready();
    blazefaceModel = await blazeface.load();
  }
  return blazefaceModel;
}

function decodeImageToTensor(buffer: Buffer, mimeType: string): tf.Tensor3D | null {
  let width, height, data;
  
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    const rawImageData = jpeg.decode(buffer, { useTArray: true });
    width = rawImageData.width;
    height = rawImageData.height;
    data = rawImageData.data;
  } else if (mimeType === 'image/png') {
    const png = PNG.sync.read(buffer);
    width = png.width;
    height = png.height;
    data = png.data;
  } else {
    console.warn("Unsupported image type for BlazeFace:", mimeType);
    return null;
  }

  const numChannels = 3;
  const numPixels = width * height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let c = 0; c < numChannels; c++) {
      values[i * numChannels + c] = data[i * 4 + c];
    }
  }

  return tf.tensor3d(values, [height, width, numChannels], 'int32');
}

const EDIT_TOOLS = new Set([
  "background_removal", "inpainting", "outpainting", "image_to_image",
]);

const MODEL_LABELS: Record<string, string> = {
  gemini3: "Gemini 3", gemini: "Gemini", stablediffusion: "Stable Diffusion",
  stablediffusionxl: "Stable Diffusion XL", stablediffusioninpaint: "Stable Diffusion Inpaint",
  sdxlinpaint: "SDXL Inpaint", flux: "Flux", flux2: "Flux 2", dalle: "DALL·E",
  midjourney: "Midjourney", ideogram: "Ideogram", kandinsky: "Kandinsky",
  adobefirefly: "Adobe Firefly", firefly: "Adobe Firefly", other_image_generators: "Other AI Generator",
  grokimagine: "Grok Imagine", heygen: "HeyGen", grok: "Grok", luma: "Luma",
  pika: "Pika", qwen: "Qwen", hunyuan: "Hunyuan", veo3: "Veo 3", imagen: "Imagen",
  imagen4: "Imagen 4", "4o": "4o", runway: "Runway", kling: "Kling", leonardo: "Leonardo",
  sora: "Sora", sora2: "Sora 2", meta: "Meta", pixart: "PixArt", cogview: "CogView",
  recraft: "Recraft", krea: "Krea", deepfloyd: "DeepFloyd", bingimagecreator: "Bing Image Creator",
  "longcat": "LongCat", dreamid: "DreamID", hedra: "Hedra", var: "VAR", gan: "GAN",
  "reve": "Reve", personalive: "PersonaLive", zimage: "ZImage", moonvalley: "Moon Valley",
  liveportrait: "LivePortrait", seedream: "SeeDream", steadydancer: "SteadyDancer",
  higgsfield: "Higgsfield", wan: "WAN", seedance: "Seedance", seedance2: "Seedance 2",
  gptimage2: "GPT Image 2", gptimage1_5: "GPT Image 1.5", halo: "Hallo",
};

export async function POST(request: NextRequest) {
  if (!HIVE_API_KEY) {
    return NextResponse.json({ error: "HIVE_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const plan = formData.get("plan") as string || "free";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = buffer.toString("base64");
    const mimeType = file.type;
    const mediaType = mimeType.split("/")[0] || "unknown";
    const isPremium = plan === "pro" || plan === "enterprise";
    const threshold = parseFloat(process.env.DEEPFAKE_THRESHOLD ?? '0.70');

    let globalPassData: any = null;
    let faces: { box: { xmin: number; ymin: number; xmax: number; ymax: number }; probability: number; score: number }[] = [];
    const faceCrops: string[] = [];

    async function runHivePass(b64: string) {
      const res = await fetch(PASS1_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${HIVE_API_KEY!.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: [{ media_base64: b64 }] }),
      });
      if (!res.ok) throw new Error(`Hive API error: ${res.status}`);
      return await res.json();
    }

    function buildPreDecoded(): { width: number; height: number; data: Uint8Array | Buffer } | null {
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        const raw = jpeg.decode(buffer, { useTArray: true });
        return { width: raw.width, height: raw.height, data: raw.data };
      } else if (mimeType === 'image/png') {
        const png = PNG.sync.read(buffer);
        return { width: png.width, height: png.height, data: png.data };
      }
      return null;
    }

    function makeCropB64(preDecoded: { width: number; height: number; data: Uint8Array | Buffer }, xmin: number, ymin: number, xmax: number, ymax: number): string | null {
      const { width: dW, height: dH, data } = preDecoded;
      const faceW = xmax - xmin;
      const faceH = ymax - ymin;
      const padX = faceW * 0.5;
      const padY = faceH * 0.5;
      const startX = Math.max(0, Math.floor((xmin - padX) * dW));
      const startY = Math.max(0, Math.floor((ymin - padY) * dH));
      const endX   = Math.min(dW, Math.ceil((xmax + padX) * dW));
      const endY   = Math.min(dH, Math.ceil((ymax + padY) * dH));
      const cropW  = endX - startX;
      const cropH  = endY - startY;
      if (cropW <= 0 || cropH <= 0) return null;
      const cropData = new Uint8Array(cropW * cropH * 4);
      for (let y = 0; y < cropH; y++) {
        for (let x = 0; x < cropW; x++) {
          const srcIdx = ((startY + y) * dW + (startX + x)) * 4;
          const dstIdx = (y * cropW + x) * 4;
          cropData[dstIdx]     = (data as any)[srcIdx];
          cropData[dstIdx + 1] = (data as any)[srcIdx + 1];
          cropData[dstIdx + 2] = (data as any)[srcIdx + 2];
          cropData[dstIdx + 3] = (data as any)[srcIdx + 3];
        }
      }
      return jpeg.encode({ data: Buffer.from(cropData), width: cropW, height: cropH }, 90).data.toString('base64');
    }

    // Two scanning tiers:
    //   Premium (Pro/Enterprise) — runs BlazeFace first to find faces, then sends each
    //   face crop to Hive independently. This gives per-face scores.
    //   Free/Starter — sends the whole image to Hive once. If Hive flags it, we run
    //   BlazeFace after the fact to draw bounding boxes (all with the same global score).
    if (isPremium) {
      try {
        const tensor = decodeImageToTensor(buffer, mimeType);
        if (tensor) {
          const imgHeight = tensor.shape[0];
          const imgWidth  = tensor.shape[1];
          const model = await getBlazeFaceModel();
          const predictions = await model.estimateFaces(tensor, false);
          tensor.dispose();

          if (predictions.length > 0) {
            const preDecoded = buildPreDecoded();
            const refW = preDecoded?.width ?? imgWidth;
            const refH = preDecoded?.height ?? imgHeight;

            console.log(`[DIM-VALIDATE] BlazeFace: ${imgWidth}x${imgHeight} | Decoded: ${preDecoded?.width}x${preDecoded?.height}`);

            const facePromises = predictions.map(async (prediction, mapIdx) => {
              const rawXmin = (prediction.topLeft as [number, number])[0];
              const rawYmin = (prediction.topLeft as [number, number])[1];
              const rawXmax = (prediction.bottomRight as [number, number])[0];
              const rawYmax = (prediction.bottomRight as [number, number])[1];

              const xmin = Math.max(0, rawXmin / refW);
              const ymin = Math.max(0, rawYmin / refH);
              const xmax = Math.min(1, rawXmax / refW);
              const ymax = Math.min(1, rawYmax / refH);

              const prob = Array.isArray(prediction.probability)
                ? prediction.probability[0]
                : (prediction.probability as any)[0] ?? 1;

              console.log(`[CROP-TRACE] mapIdx=${mapIdx} | BOX => xmin=${xmin.toFixed(3)} xmax=${xmax.toFixed(3)}`);

              let cropScore = 0;
              let cropB64: string | null = null;
              try {
                if (!preDecoded) throw new Error("Pre-decode unavailable");
                cropB64 = makeCropB64(preDecoded, xmin, ymin, xmax, ymax);
                if (!cropB64) throw new Error("Zero-size crop");
                const cropResp = await runHivePass(cropB64);
                const cropClasses: { class: string; value: number }[] = cropResp.output?.[0]?.classes ?? [];
                const cDeepfake    = cropClasses.find((c) => c.class === "deepfake")?.value ?? 0;
                const cAiGenerated = cropClasses.find((c) => c.class === "ai_generated")?.value ?? 0;
                cropScore = Math.max(cDeepfake, cAiGenerated);
                console.log(`[CROP-TRACE] mapIdx=${mapIdx} | HIVE => df=${cDeepfake.toFixed(3)} ai=${cAiGenerated.toFixed(3)} => score=${cropScore.toFixed(3)}`);
              } catch (e) {
                // If the crop fails (bad decode, zero-size, network error), fall back to the
                // whole-image Hive result rather than leaving this face unscored.
                console.error(`[CROP-TRACE] mapIdx=${mapIdx} | FALLBACK:`, e);
                if (!globalPassData) {
                  globalPassData = await runHivePass(base64String);
                }
                const fbClasses: { class: string; value: number }[] = globalPassData.output?.[0]?.classes ?? [];
                const fbDf = fbClasses.find((c) => c.class === "deepfake")?.value ?? 0;
                const fbAi = fbClasses.find((c) => c.class === "ai_generated")?.value ?? 0;
                cropScore = Math.max(fbDf, fbAi);
              }

              if (cropB64) faceCrops.push(cropB64);
              return { box: { xmin, ymin, xmax, ymax }, probability: Number(prob), score: cropScore };
            });

            faces = await Promise.all(facePromises);

            if (!globalPassData) {
              globalPassData = await runHivePass(base64String);
            }

          } else {
            console.log("[PRO-PIPELINE] BlazeFace found 0 faces — falling back to global Hive pass");
            globalPassData = await runHivePass(base64String);
          }
        } else {
          globalPassData = await runHivePass(base64String);
        }
      } catch (e) {
        console.error("Pro pipeline BlazeFace error — falling back to global pass:", e);
        globalPassData = await runHivePass(base64String);
      }

    } else {
      globalPassData = await runHivePass(base64String);
      const freeClasses: { class: string; value: number }[] = globalPassData.output?.[0]?.classes ?? [];
      const freeAiScore      = freeClasses.find((c) => c.class === "ai_generated")?.value ?? 0;
      const freeDeepfakeScore = freeClasses.find((c) => c.class === "deepfake")?.value ?? 0;

      if (freeAiScore >= threshold || freeDeepfakeScore >= threshold) {
        try {
          const tensor = decodeImageToTensor(buffer, mimeType);
          if (tensor) {
            const imgHeight = tensor.shape[0];
            const imgWidth  = tensor.shape[1];
            const model = await getBlazeFaceModel();
            const predictions = await model.estimateFaces(tensor, false);
            tensor.dispose();

            const globalFaceScore = Math.max(freeAiScore, freeDeepfakeScore);

            faces = predictions.map(prediction => {
              const xmin = Math.max(0, (prediction.topLeft as [number, number])[0] / imgWidth);
              const ymin = Math.max(0, (prediction.topLeft as [number, number])[1] / imgHeight);
              const xmax = Math.min(1, (prediction.bottomRight as [number, number])[0] / imgWidth);
              const ymax = Math.min(1, (prediction.bottomRight as [number, number])[1] / imgHeight);
              const prob = Array.isArray(prediction.probability)
                ? prediction.probability[0]
                : (prediction.probability as any)[0] ?? 1;
              return { box: { xmin, ymin, xmax, ymax }, probability: Number(prob), score: globalFaceScore };
            });
          }
        } catch (e) {
          console.error("Free-tier BlazeFace error:", e);
        }
      }
    }

    const classes: { class: string; value: number }[] = globalPassData?.output?.[0]?.classes ?? [];

    let aiScore       = classes.find((c) => c.class === "ai_generated")?.value ?? 0;
    let deepfakeScore = classes.find((c) => c.class === "deepfake")?.value ?? 0;
    const audioScore  = classes.find((c) => c.class === "ai_generated_audio")?.value ?? 0;
    const maxModelScore = Math.max(
      ...classes.filter((c) => HIVE_GENERATIVE_MODELS.has(c.class)).map((c) => c.value),
      0
    );

    if (isPremium && faces.length > 0) {
      const maxFaceScore = Math.max(...faces.map(f => f.score));
      deepfakeScore = Math.max(deepfakeScore, maxFaceScore);
      if (maxFaceScore > aiScore) aiScore = maxFaceScore;
    }

    const maxScore = Math.max(aiScore, deepfakeScore, audioScore, maxModelScore);

    // Verdict thresholds:
    //   >= 70%  → synthetic (red)
    //   >= 50%  → suspicious (amber)
    //   <  50%  → real (green)
    // Confidence is the raw maxScore percentage; for "real" we invert it to show
    // how confident we are that the file is authentic.
    type Verdict = "synthetic" | "suspicious" | "real";
    let finalGlobalVerdict: Verdict = "real";
    let confidence: number;

    if (maxScore >= RISK_THRESHOLD_CRITICAL) {
      finalGlobalVerdict = "synthetic";
      confidence = Math.round(maxScore * 100);
    } else if (maxScore >= RISK_THRESHOLD_SUSPICIOUS) {
      finalGlobalVerdict = "suspicious";
      confidence = Math.round(maxScore * 100);
    } else {
      finalGlobalVerdict = "real";
      confidence = Math.round((1 - Math.max(aiScore, deepfakeScore, audioScore)) * 100);
    }

    let anomaly_type: string | null = null;
    let classificationTag: string | null = null;

    if (finalGlobalVerdict === "synthetic") {
      const hasHighSynthesis = classes.some((c) => HIVE_GENERATIVE_MODELS.has(c.class) && c.value >= 0.5);
      const hasEditTool      = classes.some((c) => EDIT_TOOLS.has(c.class) && c.value >= 0.01);
      const hasDeepfake      = deepfakeScore >= 0.7;

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
    } else if (finalGlobalVerdict === "suspicious") {
      classificationTag = "Suspicious Anomaly Detected";
      anomaly_type = "Near-breach manipulation signature";
    }

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
    generation_sources.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    console.log("--- FORENSIC INVENTORY ---");
    faces.forEach((face, idx) => {
      console.log(`  [${idx}] xmin=${face.box.xmin.toFixed(3)} xmax=${face.box.xmax.toFixed(3)} score=${(face.score * 100).toFixed(1)}%`);
    });
    console.log(`  globalVerdict: ${finalGlobalVerdict} | aiScore=${(aiScore*100).toFixed(1)}% deepfakeScore=${(deepfakeScore*100).toFixed(1)}% confidence=${confidence}%`);

    const scanId = crypto.randomUUID();
    const analysedAt = new Date().toISOString();

    const { supabase } = createRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    let fileUrl: string | null = null;
    const workspaceId = formData.get("workspace_id") as string;

    if (workspaceId && user) {
      const storagePath = `${workspaceId}/${scanId}/${file.name}`;
      const { data: uploadData } = await supabase.storage
        .from("scan-uploads")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from("scan-uploads")
          .getPublicUrl(storagePath);
        fileUrl = publicUrl;
      }

      const verdictLabel = finalGlobalVerdict === "real" ? "Authentic"
        : finalGlobalVerdict === "synthetic" ? "Synthetic"
        : "Suspicious";

      await supabase.from("scans").insert({
        id: scanId,
        workspace_id: workspaceId,
        user_id: user.id,
        file_name: file.name,
        file_type: mediaType,
        file_url: fileUrl,
        verdict: verdictLabel,
        confidence,
        anomaly_type,
        classification_tag: classificationTag,
        source: "upload",
        analysed_at: analysedAt,
      });

      if (faces.length > 0) {
        await supabase.from("scan_faces").insert(
          faces.map((face) => ({
            scan_id: scanId,
            score: Math.round(face.score * 100),
            box_xmin: face.box.xmin,
            box_ymin: face.box.ymin,
            box_width: face.box.xmax - face.box.xmin,
            box_height: face.box.ymax - face.box.ymin,
          }))
        );
      }
    }

    return NextResponse.json({
      success: true,
      verdict: finalGlobalVerdict,
      confidence,
      metrics: {
        ai_generated_score: aiScore,
        deepfake_score: deepfakeScore,
      },
      faces,
      face_crops: faceCrops,
      id: scanId,
      analysed_at: analysedAt,
      media_type: mediaType,
      anomaly_type,
      classification_tag: classificationTag,
      ai_generated_score: (aiScore * 100).toFixed(1) + "%",
      generation_sources,
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Scan failed", details: error.message }, { status: 500 });
  }
}

