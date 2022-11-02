import express from "express";
import bodyParser from "body-parser";
import { createLogger } from "./util/logger";
import { config } from "./config";
import { spotifyRouter } from "./services/spotify/spotifyRouter";
import { cronjobService } from "./services/cronjob/cronjob";
import { githubRouter } from "./services/github/githubRouter";

const logger = createLogger("DataChallengeBox Server");

export async function initServer(): Promise<void> {
  try {
    const app = express();

    if (config.cron) {
      await cronjobService();
    }

    app
      .get("/", (_req, res) => {
        logger.debug(`Get request on root`);
        res.sendStatus(200);
      })
      .use(express.json())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use((req, res, next) => {
        logger.http(req, res);
        next();
      })
      .use("/data-challenge-box/api/v1/github", githubRouter)
      .use("/data-challenge-box/api/v1/spotify", spotifyRouter)
      .listen(8000, () => {
        logger.debug(`DataChallengeBox server listening on port 8000`);
      });
  } catch (e: unknown) {
    logger.error("Error starting server", new Error(e as undefined));
    throw e;
  }
}
