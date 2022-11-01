import { Octokit } from "octokit";
import { config } from "../config";
import { createLogger } from "../util/logger";

const logger = createLogger("Github Adapter Logger");

const octokit = new Octokit({
  auth: config.gitHubToken,
});

export async function getGithubMetric(
  endpoint: string,
  owner: string,
  repo: string,
  dateTime?: string
): Promise<unknown[]> {
  logger.trace("Sending request to GitHub", { endpoint, owner, repo, dateTime });
  const reqEndpoint = dateTime
    ? `GET /repos/${owner}/${repo}/${endpoint}?since=${dateTime}`
    : `GET /repos/${owner}/${repo}/${endpoint}`;
  const ghResponse = await octokit.request(reqEndpoint);
  logger.trace("Response received from Github resource", { metric: ghResponse.data });
  return ghResponse.data;
}
