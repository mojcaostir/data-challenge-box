import cron from "node-cron";
import { createLogger } from "../../util/logger";
import { spotifyService } from "../spotify/spotifyService";
import { githubService } from "../github/githubService";
import { config } from "../../config";

const logger = createLogger("Cronjob Service");

export async function cronjobService(): Promise<cron.ScheduledTask> {
  logger.debug("Cronjob starting github Service");
  return cron.schedule(config.cronExpression, async function () {
    try {
      const githubResponse = await githubService([
        { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
        { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
        { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
      ]);
      if (githubResponse.sent) {
        logger.info("Github metrics sent", { githubResponse });
      } else {
        logger.error("Error getting metrics from github", new Error(JSON.stringify(githubResponse)), {
          githubResponse,
        });
      }
    } catch (e) {
      logger.error("Unhandled error: githubService", new Error(e as undefined));
      throw e;
    }

    logger.debug("Cronjob starting spotify Service");
    try {
      const spotifyResponse = await spotifyService([
        {
          url: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFEC4WFtoNRpw/playlists",
          key: "categoryPlaylists",
        },
        { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
        { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
      ]);
      if (spotifyResponse.sent) {
        logger.info("Spotify metrics sent", { spotifyResponse });
      } else {
        logger.error("Spotify metrics were not sent to Databox", new Error(JSON.stringify(spotifyResponse)), {
          spotifyResponse,
        });
      }
    } catch (e) {
      logger.error("Unhandled error: spotifyService", new Error(e as undefined));
      throw e;
    }
    logger.debug("Cronjob completed");
  });
}
