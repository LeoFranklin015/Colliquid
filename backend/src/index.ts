import { startApi } from "./api/index.js";
import { startCron } from "./cron/index.js";
import { startIndexer } from "./indexer/index.js";
import { createLogger } from "./shared/logger.js";

const log = createLogger("main");

log.info("Starting Rayls Hackathon Backend...");

startApi();
startCron();
startIndexer();

log.info("All services running");

process.on("SIGINT", () => {
  log.info("Shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  log.info("Shutting down...");
  process.exit(0);
});
