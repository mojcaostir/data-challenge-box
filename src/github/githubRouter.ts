import express, { Application } from "express";
import { repoIssues } from "./gitHubMetrics";

export const githubRouter = express.Router();

githubRouter.get("/issues", repoIssues as Application);
