import { githubService } from "./githubService";
import { Request, Response } from "express";
import { createLogger } from "../../util/logger";
import { IResponseBody, IResponseData } from "../../models";

const logger = createLogger("Github Controller Logger");

export async function allRepoMetricsController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);

    if (response.sent) {
      logger.info("Github metrics sent", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Error getting metrics from github", new Error(JSON.stringify(response)), { response });
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: allRepoMetricsController", new Error(e as undefined));
    throw e;
  }
}

export async function repoCommentsController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
    ]);

    if (response.sent) {
      logger.info("Github metrics sent", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github metrics were not sent to Databox", new Error(JSON.stringify(response)), { response });
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: repoComments", new Error(e as undefined));
    throw e;
  }
}

export async function repoReleasesController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await githubService([
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
    ]);

    if (response.sent) {
      logger.info("Github metrics sent", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github metrics were not sent to Databox", new Error(JSON.stringify(response)), { response });
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: repoReleases", new Error(e as undefined));
    throw e;
  }
}

export async function repoStarsController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await githubService([
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);

    if (response.sent) {
      logger.info("Github metrics sent", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github metrics were not sent to Databox", new Error(JSON.stringify(response)), { response });
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: repoStars", new Error(e as undefined));
    throw e;
  }
}
