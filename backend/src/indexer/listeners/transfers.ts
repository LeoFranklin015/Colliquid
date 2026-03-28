import { ethers } from "ethers";
import { publicChainProvider, privacyNodeProvider } from "../../shared/providers.js";
import { ERC20_ABI, ERC721_ABI, ERC1155_ABI } from "../../shared/abis.js";
import { config } from "../../shared/config.js";
import { addEvent } from "../store.js";
import { createLogger } from "../../shared/logger.js";

const log = createLogger("indexer-transfers");

function handleEvent(
  eventName: string,
  contractAddress: string,
  args: Record<string, unknown>,
  logEntry: ethers.Log | ethers.EventLog,
) {
  const event = {
    eventName,
    contractAddress,
    blockNumber: logEntry.blockNumber,
    transactionHash: logEntry.transactionHash,
    args,
    timestamp: Date.now(),
  };
  addEvent(event);
  log.info(`${eventName} on ${contractAddress.slice(0, 10)}... block=${logEntry.blockNumber} tx=${logEntry.transactionHash.slice(0, 14)}...`);
}

export function listenTransfers() {
  // ERC20 transfers on public chain
  if (config.tokenAddress) {
    const token = new ethers.Contract(config.tokenAddress, ERC20_ABI, publicChainProvider);
    token.on("Transfer", (from, to, value, event) => {
      handleEvent("Transfer", config.tokenAddress, { from, to, value: value.toString() }, event.log);
    });
    log.info(`Listening for ERC20 Transfer events on ${config.tokenAddress}`);
  }

  // ERC721 transfers on public chain
  if (config.nftAddress) {
    const nft = new ethers.Contract(config.nftAddress, ERC721_ABI, publicChainProvider);
    nft.on("Transfer", (from, to, tokenId, event) => {
      handleEvent("Transfer", config.nftAddress, { from, to, tokenId: tokenId.toString() }, event.log);
    });
    log.info(`Listening for ERC721 Transfer events on ${config.nftAddress}`);
  }

  // ERC1155 transfers on public chain
  if (config.multiTokenAddress) {
    const multi = new ethers.Contract(config.multiTokenAddress, ERC1155_ABI, publicChainProvider);
    multi.on("TransferSingle", (operator, from, to, id, value, event) => {
      handleEvent("TransferSingle", config.multiTokenAddress, {
        operator, from, to, id: id.toString(), value: value.toString(),
      }, event.log);
    });
    log.info(`Listening for ERC1155 TransferSingle events on ${config.multiTokenAddress}`);
  }
}
