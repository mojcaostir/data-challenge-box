import express from "express";
import cron from "node-cron";
import bodyParser from "body-parser";
import { githubRouter } from "./github/githubRouter";
import { spotifyRouter } from "./spotify/spotifyRouter";
import { githubService } from "./github/githubService";
import { spotifyService } from "./spotify/spotifyService";
import { createLogger } from "./util/logger";
import { config } from "./config";

const logger = createLogger("DataChallengeBox Server");

export async function initServer(): Promise<void> {
  try {
    const app = express();

    cron.schedule(config.cronExpression, async function () {
      logger.info("Cronjob starting github Service");
      await githubService([
        { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
        { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
        { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
      ]);

      logger.info("Cronjob starting spotify Service");
      await spotifyService([
        {
          url: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFEC4WFtoNRpw/playlists",
          key: "categoryPlaylists",
        },
        { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
        { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
      ]);
      logger.info("Cronjob completed");
    });

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
