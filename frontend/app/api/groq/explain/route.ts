import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  try {
    const { verdict, confidence, anomaly_type, ai_generated_score, generation_sources, faces } = await request.json();

    const faceCount = faces?.length ?? 0;
    const topSource = generation_sources?.[0]?.label ?? null;

    const prompt = `You are a friendly security helper. Explain this scan result to a child.

What the scanner found:
- Result: ${verdict}
- How sure the scanner is: ${confidence} out of 100
- What was detected: ${anomaly_type ?? "Nothing unusual"}
- AI generation score: ${ai_generated_score ?? "N/A"}
${topSource ? `- Possible source: ${topSource}` : ""}
- Faces checked: ${faceCount}

Write 2-3 very short sentences. Use simple words a child would understand.
Do NOT use words like "anomaly", "manipulation", "synthetic", "confidence threshold", "classification", "breach", "signature".
Just say what happened and whether the file is safe or not.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-3b-preview",
        messages: [
          { role: "system", content: "You write short, simple explanations for children. No technical words. 2-3 sentences max." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 120,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json({ error: "Groq API error", details: errText }, { status: 502 });
    }

    const groqJson = await groqRes.json();
    const explanation = groqJson.choices?.[0]?.message?.content?.trim() ?? "The scan completed. Your file appears to be safe.";

    return NextResponse.json({ explanation });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate explanation", details: error.message }, { status: 500 });
  }
}
