import { callAgent } from "./openaiClient.js";
import type { AgentResult, CollateralData } from "./types.js";

const SYSTEM = `You are a Privacy Guardian checking that collateral data is safe to publish on a public blockchain before tokenization.

You MUST respond with ONLY a JSON object in this exact format:
{"approved": true/false, "confidence": <integer 0-100>, "reasoning": "<detailed explanation>", "flags": ["concern1", "concern2"]}

Check for direct PII only:
- Names, exact street addresses, phone numbers, ID numbers, email addresses

Generic property descriptions (e.g. "residential property, 4 bedrooms, suburban area") are SAFE and should be APPROVED. Category-level descriptions like property type, general area, size ranges, and condition are all acceptable for public disclosure.

Only REJECT if the description contains actual PII (real names, exact addresses, government IDs) that directly identifies a specific person. Generic asset descriptions are fine.

The ownerId is always a bytes32 hash — this is properly anonymized by design.

Lean toward approval. Most well-structured collateral descriptions are privacy-safe.`;

export async function runPrivacyGuardian(
  data: CollateralData,
  leadAnalysis: string,
): Promise<AgentResult> {
  const prompt = `Review this loan collateral for privacy risks before public tokenization.

LEAD ANALYST'S ASSESSMENT:
${leadAnalysis}

LOAN DATA:
- Collateral ID: ${data.collateralId}
- Owner ID (anonymized hash): ${data.ownerId}
- Type: ${data.colType}
- Loan Amount: ${data.loanAmount} ETH
- Interest Rate: ${data.interest / 100}%
- Duration: ${data.timeDays} days
- Days Elapsed Since Start: ${data.daysElapsed}
- Yield Offered: ${data.yield_ / 100}%
- Total Value: ${data.totalValue} ETH
- Description: ${data.info}

The description will be visible on a PUBLIC blockchain. Check for direct PII only.

Respond with ONLY the JSON object.`;

  const result = await callAgent(SYSTEM, prompt);
  return {
    agent: "privacy-guardian",
    ...result,
    timestamp: Date.now(),
  };
}
