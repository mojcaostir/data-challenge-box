import { Octokit } from "octokit";
import { config } from "../config";
import { createLogger } from "../logger/logger";
import { Request, Response } from "express";
import { Send } from "express-serve-static-core";
import Databox, { Result } from "databox";

const logger = createLogger("repoIssues Service Logger");

export interface IResponseBody<T> extends Response {
  json: Send<T, this>;
}

export interface IError {
  message: string;
  request: { xRequestId?: string; sourceIp?: string; method?: string; uri?: string; headers?: Record<string, string> };
  details?: { faultCode?: string; fields?: Record<string, string> }[];
  debug?: string;
}

export async function repoIssues(req: Request, res: Response): Promise<IResponseBody<unknown | IError>> {
  try {
    logger.trace("Req params: ", req.query);
    logger.trace("Creating new Octokit instance");
    const octokit = new Octokit({
      auth: config.gitHubToken,
    });

    logger.trace("Sending request to GitHub");
    const ghResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "nodejs",
      repo: "node",
    });
    logger.trace("Response received from github", ghResponse);

    const dataArray = ghResponse.data;
    let issueComments = 0;
    for (const issue of dataArray) {
      issueComments += issue.comments;
    }
    const issueCount = dataArray.length;

    const client = new Databox({
      push_token: config.databoxToken,
    });

    client.insertAll(
      [
        {
          key: "issues",
          value: issueCount,
        },
        {
          key: "comments",
          value: issueComments,
        },
      ],
      (response: Result) => {
        logger.info("Databox response", { response });
      }
    );

    const storing = {
      serviceProvider: "Github",
      sentAt: Date.now(),
      metrics: ["issues", "comments"],
      metricsCount: 2,
      sent: true,
    };

    logger.info("Repository issues KPIs", storing);
    return res.status(200).json(storing);
  } catch (e: unknown) {
    logger.error("Unhandled error: repoIssues", new Error(e as undefined));
    throw e;
  }
}
