import { sendMetricsToDatabox } from "../adapters/databox";
import { getSpotifyMetric } from "../adapters/spotify";
import { createLogger } from "../util/logger";
import { IMetrics, IResponseData, SpotifyMetricKey } from "../models";
import { DateTime } from "luxon";

const logger = createLogger("Spotify Service Logger");

export async function spotifyService(inputArray: { url: string; key: SpotifyMetricKey }[]): Promise<IResponseData> {
  let metricsCount = 0;
  const metricsKeys: SpotifyMetricKey[] = [];
  const metrics: IMetrics[] = [];

  for (const input of inputArray) {
    let spotifyMetric;
    try {
      spotifyMetric = await getSpotifyMetric(input.url);
    } catch (e: unknown) {
      logger.error("Error getting metrics from spotify", new Error(e as string));
      return {
        serviceProvider: "Spotify",
        sentAt: DateTime.utc().toISO(),
        metrics: [],
        metricsCount: 0,
        sent: false,
        errorMessage: "Error getting metrics from spotify",
      };
    }

    metricsCount += 1;
    metricsKeys.push(`${input.key}`);
    if (input.key === "categoryPlaylists") {
      metrics.push({ key: input.key, value: spotifyMetric.playlists!.total });
    } else {
      metrics.push({ key: input.key, value: spotifyMetric.total! });
    }
  }
  try {
    await sendMetricsToDatabox(metrics);
    return {
      serviceProvider: "Spotify",
      sentAt: DateTime.utc().toISO(),
      metrics: metricsKeys,
      metricsCount,
      sent: true,
    };
  } catch (e) {
    return {
      serviceProvider: "Spotify",
      sentAt: DateTime.utc().toISO(),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    };
  }
}
