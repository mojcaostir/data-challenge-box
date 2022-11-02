import { DateTime } from "luxon";
import { GithubMetricKey, IMetrics, IResponseData } from "../../models";
import { sendMetricsToDatabox } from "../../adapters/databox";
import { getDateTimeYesterdayMidnight } from "../../util/dateTime";
import { getGithubMetric } from "../../adapters/github";

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
      return {
        serviceProvider: "Github",
        sentAt: DateTime.utc().toISO(),
        metrics: [],
        metricsCount: 0,
        sent: false,
        errorMessage: "Error getting metrics from github",
      };
    }

    metricsCount += 1;
    metricsKeys.push(`${input.key}`);
    metrics.push({ key: input.key, value: githubMetric.length });
  }
  try {
    await sendMetricsToDatabox(metrics, "Github");
    return {
      serviceProvider: "Github",
      sentAt: DateTime.utc().toISO(),
      metrics: metricsKeys,
      metricsCount,
      sent: true,
    };
  } catch (e) {
    return {
      serviceProvider: "Github",
      sentAt: DateTime.utc().toISO(),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    };
  }
}
