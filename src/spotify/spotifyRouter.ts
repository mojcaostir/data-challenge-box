import {
  allMetricsController,
  categoryPlaylistsController,
  playlistItemsController,
  userPlaylistsController,
} from "./spotifyController";
import express, { Application } from "express";

export const spotifyRouter = express.Router();

spotifyRouter.get("/metrics", allMetricsController as Application);
spotifyRouter.get("/categoryPlaylists", categoryPlaylistsController as Application);
spotifyRouter.get("/playlistItems", playlistItemsController as Application);
spotifyRouter.get("/userPlaylists", userPlaylistsController as Application);
