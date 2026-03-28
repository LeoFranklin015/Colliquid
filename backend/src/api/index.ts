import express from "express";
import cors from "cors";
import { config } from "../shared/config.js";
import { createLogger } from "../shared/logger.js";
import healthRoutes from "./routes/health.js";
import tokenRoutes from "./routes/tokens.js";
import attestationRoutes from "./routes/attestations.js";
import marketplaceRoutes from "./routes/marketplace.js";
import mintRoutes from "./routes/mint.js";

const log = createLogger("api");

export function startApi() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/health", healthRoutes);
  app.use("/tokens", tokenRoutes);
  app.use("/attestations", attestationRoutes);
  app.use("/marketplace", marketplaceRoutes);
  app.use("/mint", mintRoutes);

  app.listen(config.apiPort, () => {
    log.info(`API server listening on port ${config.apiPort}`);
  });

  return app;
}

// Allow standalone execution
if (import.meta.url === `file://${process.argv[1]}`) {
  startApi();
}
