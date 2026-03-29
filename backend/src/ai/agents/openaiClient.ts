import OpenAI from "openai";
import { config } from "../../shared/config.js";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!config.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    client = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return client;
}

export async function callAgent(
  systemPrompt: string,
  userPrompt: string,
): Promise<{ approved: boolean; confidence: number; reasoning: string; flags: string[] }> {
  const openai = getClient();
  const r = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 512,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = r.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned empty content");

  // Parse JSON from response (strip markdown fences if present)
  let cleaned = text.replace(/```json?\n?|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];

  const j = JSON.parse(cleaned);
  return {
    approved: Boolean(j.approved),
    confidence: Math.min(100, Math.max(0, Number(j.confidence) || 0)),
    reasoning: String(j.reasoning || ""),
    flags: Array.isArray(j.flags) ? j.flags.map(String) : [],
  };
}
