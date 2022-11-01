import express from "express";
import bodyParser from "body-parser";
import { createLogger } from "./util/logger";
import { githubRouter } from "./github/githubRouter";
import { spotifyRouter } from "./spotify/spotifyRouter";

const logger = createLogger("DataChallengeBox Server");

export async function initServer(): Promise<void> {
  try {
    const app = express();

    app
      .get("/", (_req, res) => {
        logger.info(`Get request on root`);
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
        logger.info(`DataChallengeBox server listening on port 8000`);
      });
  } catch (e: unknown) {
    logger.error("Error starting server", new Error(e as undefined));
    throw e;
  }
}
