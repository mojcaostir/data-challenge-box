import { config } from "../config";
import axios from "axios";
import { createLogger } from "../util/logger";
import { ISpotifyResponse } from "../models";

const logger = createLogger("Spotify Adapter Logger");

export async function getSpotifyMetric(url: string): Promise<ISpotifyResponse> {
  logger.trace("Sending authorization request to Spotify ");
  const spotifyResponseToken = await axios.post(
    "https://accounts.spotify.com/api/token",
    { grant_type: "client_credentials" },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(config.spotifyClientId + ":" + config.spotifyClientSecret).toString("base64"),
      },
    }
  );
  const accessToken = spotifyResponseToken.data.access_token;
  logger.trace("Received Spotify access token", { oauth: accessToken });
  const spotifyResponse = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  logger.trace("Response received Spotify resource", { metric: spotifyResponse.data });
  return spotifyResponse.data;
}
