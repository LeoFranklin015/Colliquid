import { Router } from "express";
import { ethers } from "ethers";
import { mintERC20, mintERC721, mintERC1155 } from "../../minting/index.js";

const router = Router();

router.post("/erc20", async (req, res) => {
  try {
    const { to, amount } = req.body;
    if (!to || !amount) return res.status(400).json({ error: "to and amount required" });
    const receipt = await mintERC20(to, ethers.parseEther(amount));
    res.json({ txHash: receipt.hash, status: receipt.status });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/erc721", async (req, res) => {
  try {
    const { to, tokenId } = req.body;
    if (!to || tokenId === undefined) return res.status(400).json({ error: "to and tokenId required" });
    const receipt = await mintERC721(to, BigInt(tokenId));
    res.json({ txHash: receipt.hash, status: receipt.status });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/erc1155", async (req, res) => {
  try {
    const { to, id, amount, data } = req.body;
    if (!to || id === undefined || !amount)
      return res.status(400).json({ error: "to, id, and amount required" });
    const receipt = await mintERC1155(to, BigInt(id), BigInt(amount), data || "0x");
    res.json({ txHash: receipt.hash, status: receipt.status });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
