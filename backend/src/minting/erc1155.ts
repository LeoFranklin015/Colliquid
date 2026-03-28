import { multiTokenWrite } from "../shared/contracts.js";
import { config } from "../shared/config.js";
import { createLogger } from "../shared/logger.js";

const log = createLogger("mint-erc1155");

export async function mintERC1155(to: string, id: bigint, amount: bigint, data = "0x") {
  if (!multiTokenWrite) throw new Error("MULTI_TOKEN_ADDRESS not configured");
  log.info(`Minting ${amount} units of token #${id} to ${to}`);
  const tx = await multiTokenWrite.mint(to, id, amount, data);
  const receipt = await tx.wait();
  log.info(`Mint tx: ${tx.hash}`);
  return receipt;
}

export async function teleportERC1155(to: string, id: bigint, amount: bigint, data = "0x") {
  if (!multiTokenWrite) throw new Error("MULTI_TOKEN_ADDRESS not configured");
  log.info(`Teleporting ${amount} units of token #${id} to ${to} on chain ${config.publicChainId}`);
  const tx = await multiTokenWrite.teleportToPublicChain(to, id, amount, config.publicChainId, data);
  const receipt = await tx.wait();
  log.info(`Teleport tx: ${tx.hash}`);
  return receipt;
}
