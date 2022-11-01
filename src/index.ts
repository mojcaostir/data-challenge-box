import { createLogger } from "./util/logger";
import { initServer } from "./server";

const logger = createLogger("Main Service Logger");

async function main() {
  await initServer();
}

main().catch((e) => {
  logger.error("Error starting application", new Error(e as undefined));
  process.exitCode = 1;
});
