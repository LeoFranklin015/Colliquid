import { Router } from "express";
import { privacyNodeProvider, publicChainProvider } from "../../shared/providers.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [privacyBlock, publicBlock] = await Promise.all([
      privacyNodeProvider.getBlockNumber().catch(() => null),
      publicChainProvider.getBlockNumber().catch(() => null),
    ]);
    res.json({
      status: "ok",
      privacyNode: { connected: privacyBlock !== null, blockNumber: privacyBlock },
      publicChain: { connected: publicBlock !== null, blockNumber: publicBlock },
    });
  } catch (e: any) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

export default router;
