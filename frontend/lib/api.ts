export type Verdict = "real" | "synthetic";

export type GenerationSource = {
  source: string;
  label: string;
  probability: string;
};

export type ScanResult = {
  id: string;
  verdict: Verdict;
  confidence: number;
  visual_generation_risk: number;
  ai_generated_score: string;
  anomaly_type: string | null;
  classification_tag: string | null;
  generation_sources: GenerationSource[];
  media_type: "video" | "audio" | "image";
  analysed_at: string;
};

export type ScanLimits = {
  remaining: number;
  total: number;
  window_end: string | null;
};

export class RateLimitError extends Error {
  retryAfter: string;

  constructor(message: string, retryAfter: string) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RPT-${ts}-${suffix}`;
}

export async function checkScanLimits(): Promise<ScanLimits> {
  const response = await fetch("/api/scan/limits");
  if (!response.ok) {
    return { remaining: 0, total: 3, window_end: null };
  }
  return response.json();
}

export async function scanFile(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/scan", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (response.status === 429) {
    throw new RateLimitError(data.error ?? "Scan limit reached", data.retryAfter);
  }

  if (!response.ok) {
    throw new Error(data.error ?? "Scan failed");
  }

  const mediaType = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("audio/")
      ? "audio"
      : "image";

  const result: ScanResult = {
    id: generateId(),
    verdict: data.verdict === "synthetic" ? "synthetic" : "real",
    confidence: data.confidence ?? 50,
    visual_generation_risk: data.visual_generation_risk ?? 0,
    ai_generated_score: data.ai_generated_score ?? "0.0%",
    anomaly_type: data.anomaly_type ?? null,
    classification_tag: data.classification_tag ?? null,
    generation_sources: data.generation_sources ?? [],
    media_type: mediaType,
    analysed_at: new Date().toISOString(),
  };

  await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });

  return result;
}

export async function getReport(id: string): Promise<ScanResult | null> {
  const response = await fetch(`/api/report?id=${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch report");
  }
  return response.json();
}

export async function joinWaitlist(email: string): Promise<void> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Failed to join waitlist");
  }
}
