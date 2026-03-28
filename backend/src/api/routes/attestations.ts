import { Router } from "express";
import { ethers } from "ethers";
import { publicChainProvider } from "../../shared/providers.js";
import { ATTESTATION_ABI } from "../../shared/abis.js";
import { config } from "../../shared/config.js";

const router = Router();

function getContract() {
  if (!config.attestationAddress) throw new Error("ATTESTATION_ADDRESS not configured");
  return new ethers.Contract(config.attestationAddress, ATTESTATION_ABI, publicChainProvider);
}

router.get("/:tokenAddress", async (req, res) => {
  try {
    const contract = getContract();
    const raw = await contract.getAttestations(req.params.tokenAddress);
    const attestations = raw.map((a: any) => ({
      attester: a.attester,
      token: a.token,
      approved: a.approved,
      reason: a.reason,
      score: Number(a.score),
      timestamp: Number(a.timestamp),
    }));
    res.json(attestations);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:tokenAddress/count", async (req, res) => {
  try {
    const contract = getContract();
    const count = await contract.getAttestationCount(req.params.tokenAddress);
    res.json({ count: Number(count) });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:tokenAddress/latest", async (req, res) => {
  try {
    const contract = getContract();
    const raw = await contract.getAttestations(req.params.tokenAddress);
    if (raw.length === 0) return res.status(404).json({ error: "No attestations found" });
    const latest = raw[raw.length - 1];
    res.json({
      attester: latest.attester,
      token: latest.token,
      approved: latest.approved,
      reason: latest.reason,
      score: Number(latest.score),
      timestamp: Number(latest.timestamp),
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
