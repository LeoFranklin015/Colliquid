import { attestationWrite } from "../shared/contracts.js";
import { createLogger } from "../shared/logger.js";
import type { AnalysisResult } from "../shared/types.js";

const log = createLogger("attestor");

export async function postAttestation(tokenAddress: string, result: AnalysisResult) {
  if (!attestationWrite) throw new Error("ATTESTATION_ADDRESS not configured");

  log.info(`Posting attestation for ${tokenAddress}: approved=${result.approved} score=${result.score}`);
  const tx = await attestationWrite.attest(tokenAddress, result.approved, result.reason, result.score);
  const receipt = await tx.wait();
  log.info(`Attestation tx: ${tx.hash} status: ${receipt.status === 1 ? "success" : "failed"}`);
  return receipt;
}
