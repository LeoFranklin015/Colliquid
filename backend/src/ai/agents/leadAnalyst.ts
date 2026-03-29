import { callAgent } from "./openaiClient.js";
import type { AgentResult, CollateralData } from "./types.js";

const SYSTEM = `You are a Lead Financial Analyst evaluating loan collateral for tokenization into fractional investment tokens on a blockchain platform.

You MUST respond with ONLY a JSON object in this exact format:
{"approved": true/false, "confidence": <integer 0-100>, "reasoning": "<detailed explanation>", "flags": ["concern1", "concern2"]}

Evaluate whether this collateral is suitable for tokenization. Consider:
- Is the collateral type (Land/House/Vehicle) reasonable?
- Are the loan terms sensible?
- Does the yield make sense?
- Is the description adequate?

You should generally APPROVE collateral that has reasonable terms and a clear description. Only reject if there are serious red flags like missing information, absurd terms, or clear fraud indicators. Amounts are in ETH (blockchain native currency) — typical loans range from 1 to 10000 ETH.

Lean toward approval with noted concerns rather than outright rejection.`;

export async function runLeadAnalyst(data: CollateralData): Promise<AgentResult> {
  const prompt = `Evaluate this loan collateral for tokenization:

- Collateral ID: ${data.collateralId}
- Type: ${data.colType}
- Loan Amount: ${data.loanAmount} ETH
- Interest Rate: ${data.interest / 100}%
- Duration: ${data.timeDays} days
- Days Elapsed Since Start: ${data.daysElapsed}
- Yield Offered to Investors: ${data.yield_ / 100}%
- Total Value (loan + accrued interest): ${data.totalValue} ETH
- Description: ${data.info}
- Status: ${data.active ? "Active" : "Inactive"}

Respond with ONLY the JSON object.`;

  const result = await callAgent(SYSTEM, prompt);
  return {
    agent: "lead-analyst",
    ...result,
    timestamp: Date.now(),
  };
}
