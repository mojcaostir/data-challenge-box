import { spotifyService } from "./spotifyService";
import { Request, Response } from "express";
import { createLogger } from "../../util/logger";
import { IResponseBody, IResponseData } from "../../models";

const logger = createLogger("Spotify Controller Logger");

export async function allMetricsController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await spotifyService([
      {
        url: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFEC4WFtoNRpw/playlists",
        key: "categoryPlaylists",
      },
      { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
      { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
    ]);

    if (response.sent) {
      return res.status(200).json({ response });
    } else {
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: allMetricsController", new Error(e as undefined));
    throw e;
  }
}

export async function categoryPlaylistsController(_req: Request, res: Response) {
  try {
    const response = await spotifyService([
      {
        url: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFEC4WFtoNRpw/playlists",
        key: "categoryPlaylists",
      },
    ]);

    if (response.sent) {
      return res.status(200).json({ response });
    } else {
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: categoryPlaylists", new Error(e as undefined));
    throw e;
  }
}

export async function playlistItemsController(_req: Request, res: Response) {
  try {
    const response = await spotifyService([
      { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
    ]);

    if (response.sent) {
      return res.status(200).json({ response });
    } else {
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: playlistItems", new Error(e as undefined));
    throw e;
  }
}

export async function userPlaylistsController(_req: Request, res: Response) {
  try {
    const response = await spotifyService([
      { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
    ]);

    if (response.sent) {
      return res.status(200).json({ response });
    } else {
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: userPlaylists", new Error(e as undefined));
    throw e;
  }
}
