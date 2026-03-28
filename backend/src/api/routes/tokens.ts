import { Router } from "express";
import { ethers } from "ethers";
import { publicChainProvider } from "../../shared/providers.js";
import { erc20At } from "../../shared/contracts.js";

const router = Router();

router.get("/:address", async (req, res) => {
  try {
    const token = erc20At(req.params.address, publicChainProvider);
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply(),
      token.decimals().catch(() => 18),
    ]);
    res.json({
      address: req.params.address,
      name,
      symbol,
      totalSupply: totalSupply.toString(),
      decimals: Number(decimals),
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:address/balance/:account", async (req, res) => {
  try {
    const token = erc20At(req.params.address, publicChainProvider);
    const balance = await token.balanceOf(req.params.account);
    res.json({
      token: req.params.address,
      account: req.params.account,
      balance: balance.toString(),
      formatted: ethers.formatEther(balance),
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
