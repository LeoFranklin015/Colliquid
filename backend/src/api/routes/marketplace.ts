import { Router } from "express";
import { ethers } from "ethers";
import { marketplaceRead } from "../../shared/contracts.js";

const router = Router();

router.get("/listings", async (_req, res) => {
  try {
    if (!marketplaceRead) return res.status(400).json({ error: "MARKETPLACE_ADDRESS not configured" });
    const activeIds: bigint[] = await marketplaceRead.getActiveListings();
    const listings = await Promise.all(
      activeIds.map(async (id) => {
        const l = await marketplaceRead!.getListing(id);
        return {
          id: Number(id),
          token: l.token,
          assetType: Number(l.assetType),
          tokenId: l.tokenId.toString(),
          amount: l.amount.toString(),
          price: ethers.formatEther(l.price),
          priceWei: l.price.toString(),
          active: l.active,
        };
      }),
    );
    res.json(listings);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/listings/:id", async (req, res) => {
  try {
    if (!marketplaceRead) return res.status(400).json({ error: "MARKETPLACE_ADDRESS not configured" });
    const l = await marketplaceRead.getListing(req.params.id);
    res.json({
      id: Number(req.params.id),
      token: l.token,
      assetType: Number(l.assetType),
      tokenId: l.tokenId.toString(),
      amount: l.amount.toString(),
      price: ethers.formatEther(l.price),
      priceWei: l.price.toString(),
      active: l.active,
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
