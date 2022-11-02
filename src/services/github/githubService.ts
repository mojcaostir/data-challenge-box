import { DateTime } from "luxon";
import { createLogger } from "../../util/logger";
import { GithubMetricKey, IMetrics, IResponseData } from "../../models";
import { sendMetricsToDatabox } from "../../adapters/databox";
import { getDateTimeYesterdayMidnight } from "../../util/dateTime";
import { getGithubMetric } from "../../adapters/github";

const logger = createLogger("Github Service Logger");

export async function githubService(
  inputArray: {
    endpoint: string;
    owner: string;
    repo: string;
    key: GithubMetricKey;
    dateTime?: boolean;
  }[]
): Promise<IResponseData> {
  let metricsCount = 0;
  const metricsKeys: GithubMetricKey[] = [];
  const metrics: IMetrics[] = [];

  for (const input of inputArray) {
    const dateTimeYesterdayMidnight = input.dateTime ? getDateTimeYesterdayMidnight() : undefined;

    let githubMetric;
    try {
      githubMetric = await getGithubMetric(input.endpoint, input.owner, input.repo, dateTimeYesterdayMidnight);
    } catch (e: unknown) {
      const response: IResponseData = {
        serviceProvider: "Github",
        sentAt: DateTime.utc().toISO(),
        metrics: [],
        metricsCount: 0,
        sent: false,
        errorMessage: "Error getting metrics from github",
      };
      logger.error("Error getting metrics from github", new Error(e as string), { response });
      return response;
    }

    metricsCount += 1;
    metricsKeys.push(`${input.key}`);
    metrics.push({ key: input.key, value: githubMetric.length });
  }
  try {
    await sendMetricsToDatabox(metrics, "Github");
    const response: IResponseData = {
      serviceProvider: "Github",
      sentAt: DateTime.utc().toISO(),
      metrics: metricsKeys,
      metricsCount,
      sent: true,
    };
    logger.info("Github metrics sent", { response });
    return response;
  } catch (e) {
    const response: IResponseData = {
      serviceProvider: "Github",
      sentAt: DateTime.utc().toISO(),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    };
    logger.error("Github metrics were not sent to Databox", new Error(e as undefined), { response });
    return response;
  }
}
