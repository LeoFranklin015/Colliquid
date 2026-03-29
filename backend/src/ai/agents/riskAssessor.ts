import { callAgent } from "./openaiClient.js";
import type { AgentResult, CollateralData } from "./types.js";

const SYSTEM = `You are a Risk Assessor evaluating loan collateral risk before tokenization on a blockchain platform.

You MUST respond with ONLY a JSON object in this exact format:
{"approved": true/false, "confidence": <integer 0-100>, "reasoning": "<detailed explanation>", "flags": ["concern1", "concern2"]}

Evaluate:
- Is the LTV ratio healthy? (under 80% is generally acceptable)
- Is the loan duration appropriate?
- Is the yield achievable?
- Are there concentration or liquidity risks?

You should APPROVE collateral with reasonable risk profiles. Most real-world backed collateral (land, houses, vehicles) carries acceptable risk for tokenization. Only reject for extreme risk factors like LTV over 90% or clearly unsustainable yields above 30%.

Lean toward approval with noted concerns rather than outright rejection.`;

export async function runRiskAssessor(
  data: CollateralData,
  leadAnalysis: string,
): Promise<AgentResult> {
  const prompt = `Assess the risk profile of this loan collateral.

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
    agent: "risk-assessor",
    ...result,
    timestamp: Date.now(),
  };
}
