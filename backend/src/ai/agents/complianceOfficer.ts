import { callAgent } from "./openaiClient.js";
import type { AgentResult, CollateralData } from "./types.js";

const SYSTEM = `You are a Compliance Officer reviewing loan collateral for regulatory eligibility before tokenization on a blockchain platform.

You MUST respond with ONLY a JSON object in this exact format:
{"approved": true/false, "confidence": <integer 0-100>, "reasoning": "<detailed explanation>", "flags": ["concern1", "concern2"]}

Check:
- Is the collateral type legally eligible for tokenization?
- Are the interest rates reasonable (not usurious — under 20% is fine)?
- Does the loan duration make sense?
- Is the yield sustainable?

You should APPROVE if the loan terms are within normal ranges. Real-world collateral tokenization is a growing practice and most standard asset types are eligible. Only reject for clear regulatory violations like usurious rates or prohibited asset types.

Lean toward approval with noted concerns rather than outright rejection.`;

export async function runComplianceOfficer(
  data: CollateralData,
  leadAnalysis: string,
): Promise<AgentResult> {
  const prompt = `Review this loan collateral for regulatory compliance.

LEAD ANALYST'S ASSESSMENT:
${leadAnalysis}

LOAN DATA:
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
    agent: "compliance-officer",
    ...result,
    timestamp: Date.now(),
  };
}
