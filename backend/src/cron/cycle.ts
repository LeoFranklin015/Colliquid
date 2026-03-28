import { ethers } from "ethers";
import { publicChainProvider } from "../shared/providers.js";
import { erc20At } from "../shared/contracts.js";
import { config } from "../shared/config.js";
import { analyzeToken, postAttestation } from "../ai/index.js";
import { createLogger } from "../shared/logger.js";
import type { TokenData } from "../shared/types.js";

const log = createLogger("cron");

async function readTokenData(address: string): Promise<TokenData> {
  const token = erc20At(address, publicChainProvider);
  const [name, symbol, totalSupply] = await Promise.all([
    token.name(),
    token.symbol(),
    token.totalSupply(),
  ]);
  return {
    address,
    name: name as string,
    symbol: symbol as string,
    totalSupply: (totalSupply as bigint).toString(),
  };
}

export async function runAnalysisCycle() {
  const addresses = config.tokenAddresses;
  if (addresses.length === 0) {
    log.warn("No TOKEN_ADDRESSES configured, skipping cycle");
    return;
  }

  log.info(`Starting analysis cycle for ${addresses.length} token(s)`);

  for (const address of addresses) {
    try {
      log.info(`Analyzing token ${address}`);
      const tokenData = await readTokenData(address);
      log.info(`Token: ${tokenData.name} (${tokenData.symbol}) supply: ${tokenData.totalSupply}`);

      const result = await analyzeToken(tokenData);
      log.info(`AI verdict: ${result.approved ? "APPROVED" : "REJECTED"} score=${result.score} ${result.reason}`);

      if (config.attestationAddress) {
        await postAttestation(address, result);
      } else {
        log.warn("ATTESTATION_ADDRESS not set, skipping on-chain attestation");
      }
    } catch (e: any) {
      log.error(`Failed to analyze ${address}: ${e.message}`);
    }
  }

  log.info("Analysis cycle complete");
}
