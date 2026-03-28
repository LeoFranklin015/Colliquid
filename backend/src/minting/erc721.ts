import { nftWrite } from "../shared/contracts.js";
import { config } from "../shared/config.js";
import { createLogger } from "../shared/logger.js";

const log = createLogger("mint-erc721");

export async function mintERC721(to: string, tokenId: bigint) {
  if (!nftWrite) throw new Error("NFT_ADDRESS not configured");
  log.info(`Minting NFT #${tokenId} to ${to}`);
  const tx = await nftWrite.mint(to, tokenId);
  const receipt = await tx.wait();
  log.info(`Mint tx: ${tx.hash}`);
  return receipt;
}

export async function teleportERC721(to: string, tokenId: bigint) {
  if (!nftWrite) throw new Error("NFT_ADDRESS not configured");
  log.info(`Teleporting NFT #${tokenId} to ${to} on chain ${config.publicChainId}`);
  const tx = await nftWrite.teleportToPublicChain(to, tokenId, config.publicChainId);
  const receipt = await tx.wait();
  log.info(`Teleport tx: ${tx.hash}`);
  return receipt;
}
