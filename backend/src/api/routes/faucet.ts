import { Router } from "express";
import { ethers } from "ethers";
import { publicWallet } from "../../shared/providers.js";
import { createLogger } from "../../shared/logger.js";

const router = Router();
const log = createLogger("faucet");

const FAUCET_AMOUNT = ethers.parseEther("10"); // 10 USDR
const claimed = new Set<string>(); // track claimed addresses

// POST /faucet/claim — send 10 USDR to an address
router.post("/claim", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: "Valid address required" });
    }

    const normalized = ethers.getAddress(address);

    if (claimed.has(normalized)) {
      return res.status(400).json({ error: "Address already claimed faucet funds" });
    }

    log.info(`Sending 10 USDR to ${normalized}`);

    const tx = await publicWallet.sendTransaction({
      to: normalized,
      value: FAUCET_AMOUNT,
    });
    const receipt = await tx.wait();

    claimed.add(normalized);

    res.json({
      address: normalized,
      amount: "10",
      txHash: receipt?.hash,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /faucet/balance — check faucet wallet balance
router.get("/balance", async (_req, res) => {
  try {
    const balance = await publicWallet.provider!.getBalance(publicWallet.address);
    res.json({
      address: publicWallet.address,
      balance: ethers.formatEther(balance),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
