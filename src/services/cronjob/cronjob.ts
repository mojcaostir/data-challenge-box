import cron from "node-cron";
import { createLogger } from "../../util/logger";
import { spotifyService } from "../spotify/spotifyService";
import { githubService } from "../github/githubService";
import { config } from "../../config";

const logger = createLogger("Cronjob Service");

export async function cronjobService() {
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
}
