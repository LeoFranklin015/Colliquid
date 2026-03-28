import cron from "node-cron";
import { config } from "../shared/config.js";
import { createLogger } from "../shared/logger.js";
import { runAnalysisCycle } from "./cycle.js";

const log = createLogger("cron");

export function startCron() {
  log.info(`Scheduling AI analysis cron: "${config.cronSchedule}"`);

  cron.schedule(config.cronSchedule, async () => {
    log.info("Cron triggered");
    try {
      await runAnalysisCycle();
    } catch (e: any) {
      log.error(`Cron cycle failed: ${e.message}`);
    }
  });

  // Run once immediately on startup
  log.info("Running initial analysis cycle...");
  runAnalysisCycle().catch((e) => log.error(`Initial cycle failed: ${e.message}`));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startCron();
}
