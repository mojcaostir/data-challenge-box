import { githubService } from "./githubService";
import { createLogger } from "../util/logger";
import { Request, Response } from "express";
import { IResponseBody, IResponseData } from "../models";

const logger = createLogger("Github Controller Logger");

export async function allRepoMetricsController(_req: Request, res: Response): Promise<IResponseBody<IResponseData>> {
  try {
    const response = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);

    if (response.sent) {
      logger.info("Github metrics sent");
      logger.debug("Github metrics response", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github metrics were not sent to Databox", new Error(JSON.stringify(response)));
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
      logger.info("Github repository comments metric sent");
      logger.debug("Github repository comments metric response", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github repository comments metric was not sent to Databox", new Error(JSON.stringify(response)));
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
      logger.info("Github repository releases metric sent");
      logger.debug("Github repository releases metric response", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github repository releases metric was not sent to Databox", new Error(JSON.stringify(response)));
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
      logger.info("Github repository stars metric sent");
      logger.debug("Github repository stars metric response", { response });
      return res.status(200).json({ response });
    } else {
      logger.error("Github repository stars metric was not sent to Databox", new Error(JSON.stringify(response)));
      return res.status(404).json({ response });
    }
  } catch (e: unknown) {
    logger.error("Unhandled error: repoStars", new Error(e as undefined));
    throw e;
  }
}
