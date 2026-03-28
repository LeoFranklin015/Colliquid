import { ethers } from "ethers";
import { publicChainProvider } from "../../shared/providers.js";
import { ERC20_ABI, ERC721_ABI } from "../../shared/abis.js";
import { config } from "../../shared/config.js";
import { addEvent } from "../store.js";
import { createLogger } from "../../shared/logger.js";

const log = createLogger("indexer-bridge");
const ZERO_ADDRESS = ethers.ZeroAddress;

export function listenBridgeEvents() {
  // Detect tokens arriving on public chain from bridge (mint from zero address)
  if (config.tokenAddress) {
    const token = new ethers.Contract(config.tokenAddress, ERC20_ABI, publicChainProvider);
    token.on("Transfer", (from: string, to: string, value: bigint, event: any) => {
      if (from === ZERO_ADDRESS) {
        addEvent({
          eventName: "BridgeArrival_ERC20",
          contractAddress: config.tokenAddress,
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash,
          args: { to, value: value.toString() },
          timestamp: Date.now(),
        });
        log.info(`Bridge arrival: ${ethers.formatEther(value)} tokens minted to ${to}`);
      }
    });
    log.info(`Watching for ERC20 bridge arrivals on ${config.tokenAddress}`);
  }

  if (config.nftAddress) {
    const nft = new ethers.Contract(config.nftAddress, ERC721_ABI, publicChainProvider);
    nft.on("Transfer", (from: string, to: string, tokenId: bigint, event: any) => {
      if (from === ZERO_ADDRESS) {
        addEvent({
          eventName: "BridgeArrival_ERC721",
          contractAddress: config.nftAddress,
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash,
          args: { to, tokenId: tokenId.toString() },
          timestamp: Date.now(),
        });
        log.info(`Bridge arrival: NFT #${tokenId} minted to ${to}`);
      }
    });
    log.info(`Watching for ERC721 bridge arrivals on ${config.nftAddress}`);
  }
}
