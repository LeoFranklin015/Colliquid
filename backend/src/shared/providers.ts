import { ethers } from "ethers";
import { config } from "./config.js";

export const privacyNodeProvider = new ethers.JsonRpcProvider(config.privacyNodeRpc);
export const publicChainProvider = new ethers.JsonRpcProvider(config.publicChainRpc);

export const privacyWallet = new ethers.Wallet(config.deployerPrivateKey, privacyNodeProvider);
export const publicWallet = new ethers.Wallet(
  config.agentPrivateKey || config.deployerPrivateKey,
  publicChainProvider,
);
