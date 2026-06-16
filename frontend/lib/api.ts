export type Verdict = "real" | "synthetic";

export type ScanResult = {
  id: string;
  verdict: Verdict;
  confidence: number;
  anomaly_type: string | null;
  media_type: "video" | "audio" | "image";
  analysed_at: string;
};

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RPT-${ts}-${suffix}`;
}

function parseHiveResult(data: any, mediaType: string): ScanResult {
  const outputs = data?.output ?? data?.result?.output ?? [];
  let maxDeepfakeScore = 0;

  for (const frame of outputs) {
    for (const poly of frame.bounding_poly ?? []) {
      for (const cls of poly.classes ?? []) {
        if (cls.class === "yes_deepfake" || cls.class === "synthetic") {
          maxDeepfakeScore = Math.max(maxDeepfakeScore, cls.score);
        }
      }
    }
  }

  const isSynthetic = maxDeepfakeScore > 0.5;

  return {
    id: generateId(),
    verdict: isSynthetic ? "synthetic" : "real",
    confidence: isSynthetic
      ? Math.round(maxDeepfakeScore * 100)
      : Math.round((1 - maxDeepfakeScore) * 100),
    anomaly_type: isSynthetic ? "Synthetic media detected" : null,
    media_type: mediaType as "video" | "audio" | "image",
    analysed_at: new Date().toISOString(),
  };
}

export async function scanFile(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/scan", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ?? "Scan failed");
  }

  const { mediaType, result } = await response.json();
  return parseHiveResult(result, mediaType);
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ?? "Scan failed");
  }

  const { mediaType, result } = await response.json();
  return parseHiveResult(result, mediaType);
}

export async function getReport(id: string): Promise<ScanResult | null> {
  const response = await fetch(`/api/report?id=${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch report");
  }
  return response.json();
}
