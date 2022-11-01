import {
  allRepoMetricsController,
  repoCommentsController,
  repoReleasesController,
  repoStarsController,
} from "./githubController";
import express, { Application } from "express";

export const githubRouter = express.Router();

githubRouter.get("/metrics", allRepoMetricsController as Application);
githubRouter.get("/repoComments", repoCommentsController as Application);
githubRouter.get("/repoReleases", repoReleasesController as Application);
githubRouter.get("/repoStars", repoStarsController as Application);
