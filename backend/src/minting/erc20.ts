import { ethers } from "ethers";
import { tokenWrite } from "../shared/contracts.js";
import { config } from "../shared/config.js";
import { createLogger } from "../shared/logger.js";

const log = createLogger("mint-erc20");

export async function mintERC20(to: string, amount: bigint) {
  if (!tokenWrite) throw new Error("TOKEN_ADDRESS not configured");
  log.info(`Minting ${ethers.formatEther(amount)} tokens to ${to}`);
  const tx = await tokenWrite.mint(to, amount);
  const receipt = await tx.wait();
  log.info(`Mint tx: ${tx.hash}`);
  return receipt;
}

export async function teleportERC20(to: string, amount: bigint) {
  if (!tokenWrite) throw new Error("TOKEN_ADDRESS not configured");
  log.info(`Teleporting ${ethers.formatEther(amount)} tokens to ${to} on chain ${config.publicChainId}`);
  const tx = await tokenWrite.teleportToPublicChain(to, amount, config.publicChainId);
  const receipt = await tx.wait();
  log.info(`Teleport tx: ${tx.hash}`);
  return receipt;
}
