import { callAgent } from "./openaiClient.js";
import type { AgentResult, CollateralData } from "./types.js";

const SYSTEM = `You are a Valuation Auditor verifying collateral values before tokenization on a blockchain platform.

You MUST respond with ONLY a JSON object in this exact format:
{"approved": true/false, "confidence": <integer 0-100>, "reasoning": "<detailed explanation>", "flags": ["concern1", "concern2"]}

Check:
- Does the loan amount seem reasonable for the collateral type?
- Is the total value calculation sensible?
- Does the description support the claimed value?
- Is the yield aligned with market expectations?

Amounts are in ETH (blockchain currency). Typical collateral loans range from 1 to 10000 ETH. You should APPROVE if the valuation is in a reasonable range and the math checks out. Only reject for clear overvaluation or nonsensical numbers.

Lean toward approval with noted concerns rather than outright rejection.`;

export async function runValuationAuditor(
  data: CollateralData,
  leadAnalysis: string,
): Promise<AgentResult> {
  const prompt = `Verify the valuation of this loan collateral.

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
    agent: "valuation-auditor",
    ...result,
    timestamp: Date.now(),
  };
}
