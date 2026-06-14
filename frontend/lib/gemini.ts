export type ExplainRequest = {
  confidence: number;
  mediaType: "video" | "audio" | "image";
  verdict: "real" | "synthetic";
};

export type ExplainResponse = {
  explanation: string;
};

export async function fetchExplanation(
  metrics: ExplainRequest,
): Promise<string> {
  const res = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metrics),
  });

  if (!res.ok) return "";
  const data = await res.json();
  return data.explanation ?? "";
}

export function buildGeminiPrompt(metrics: ExplainRequest): string {
  const score = metrics.verdict === "synthetic"
    ? 100 - metrics.confidence
    : metrics.confidence;

  const syntheticPct = metrics.verdict === "synthetic" ? metrics.confidence : 0;

  return `You are CatchAm AI, a trusted digital security advisor for everyday Nigerians. Your job is to explain deepfake detection results in clear, calm, authoritative English.

A ${metrics.mediaType} file was analysed for AI manipulation.

Detection Results:
- Authenticity Score: ${score.toFixed(2)}%
- Verdict: ${metrics.verdict === "synthetic" ? "Synthetic content detected" : "No synthetic content detected"}${syntheticPct > 0 ? `\n- Anomaly Deviation: ${syntheticPct.toFixed(2)}%` : ""}

Write a detailed, well-structured advisory report (2 to 4 sentences) for a non-technical Nigerian consumer. Start with the verdict, then explain what the score means in plain language, and end with a clear recommendation on whether the file is safe to trust.

Use plain language. No emojis. No technical jargon. Be specific about what the score tells us. For example, a 97% score means the file is almost certainly authentic with only minor digital compression artifacts, while a 62% score indicates significant synthetic manipulation likely involving face replacement or voice cloning.`;
}
