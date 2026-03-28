import type { TokenData } from "../shared/types.js";

export const SYSTEM = `You are an AI asset analyst. You ONLY respond with raw JSON, no prose, no markdown.`;

export function buildPrompt(token: TokenData): string {
  return `Evaluate this token for a public marketplace and respond with ONLY a JSON object in this exact format:
{"approved": <true or false>, "score": <integer 0-100>, "reason": "<your one-sentence analysis>"}

Token data:
- Name: ${token.name}
- Symbol: ${token.symbol}
- Supply: ${token.totalSupply}
- Address: ${token.address}

Respond with ONLY the JSON object. No markdown, no extra text.`;
}
