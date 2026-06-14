const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export type Verdict = "real" | "synthetic";

export type ScanResult = {
  id: string;
  verdict: Verdict;
  confidence: number;
  anomaly_type: string | null;
  media_type: "video" | "audio" | "image";
  analysed_at: string;
};

const ANOMALIES = [
  "Lip-sync tearing detected",
  "Audio frequency spike anomaly",
  "Facial warping artefact",
  "Frame interpolation artefact",
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateId(seed: number): string {
  const ts = Date.now().toString(36).toUpperCase();
  const suffix = seed.toString(36).toUpperCase().padStart(4, "0");
  return `RPT-${ts}-${suffix}`;
}

function generateResult(input: string, type: "file" | "url"): ScanResult {
  const seed = hash(input);
  const isSynthetic = seed % 3 !== 0;
  const confidence = isSynthetic ? Math.min(97, 62 + (seed % 35)) : (seed % 28) + 3;

  return {
    id: generateId(seed),
    verdict: isSynthetic ? "synthetic" : "real",
    confidence,
    anomaly_type: isSynthetic ? ANOMALIES[seed % ANOMALIES.length] : null,
    media_type: type === "url" ? "video" : "audio",
    analysed_at: new Date().toISOString(),
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function scanFile(file: File): Promise<ScanResult> {
  await delay(2200 + Math.random() * 1200);
  return generateResult(file.name, "file");
}

export async function scanUrl(url: string): Promise<ScanResult> {
  await delay(2000 + Math.random() * 1500);
  return generateResult(url, "url");
}

export async function getReport(id: string): Promise<ScanResult | null> {
  await delay(300);
  const seed = hash(id);
  if (seed === 0) return null;
  const isSynthetic = seed % 3 !== 0;
  const confidence = isSynthetic ? Math.min(97, 62 + (seed % 35)) : (seed % 28) + 3;
  return {
    id,
    verdict: isSynthetic ? "synthetic" : "real",
    confidence,
    anomaly_type: isSynthetic ? ANOMALIES[seed % ANOMALIES.length] : null,
    media_type: "video",
    analysed_at: new Date(Date.now() - 60000).toISOString(),
  };
}
