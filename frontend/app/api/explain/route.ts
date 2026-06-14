import { NextResponse } from "next/server";
import { buildGeminiPrompt, type ExplainRequest } from "@/lib/gemini";

export async function POST(request: Request) {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    console.log("[Grok] No API key found");
    return NextResponse.json({ explanation: "" }, { status: 200 });
  }

  try {
    const body: ExplainRequest = await request.json();
    const prompt = buildGeminiPrompt(body);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("[Grok] API error:", res.status, err);
      return NextResponse.json({ explanation: "" }, { status: 200 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    console.log("[Grok] Response received, length:", text.length);
    return NextResponse.json({ explanation: text });
  } catch (e) {
    console.log("[Grok] Catch error:", e);
    return NextResponse.json({ explanation: "" }, { status: 200 });
  }
}
