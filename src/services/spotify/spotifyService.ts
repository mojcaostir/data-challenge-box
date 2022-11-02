import { DateTime } from "luxon";
import { createLogger } from "../../util/logger";
import { sendMetricsToDatabox } from "../../adapters/databox";
import { IMetrics, IResponseData, SpotifyMetricKey } from "../../models";
import { getSpotifyMetric } from "../../adapters/spotify";

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
      const response: IResponseData = {
        serviceProvider: "Spotify",
        sentAt: DateTime.utc().toISO(),
        metrics: [],
        metricsCount: 0,
        sent: false,
        errorMessage: "Error getting metrics from spotify",
      };
      logger.error("Error getting metrics from spotify", new Error(e as string), { response });
      return response;
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
    await sendMetricsToDatabox(metrics, "Spotify");
    const response: IResponseData = {
      serviceProvider: "Spotify",
      sentAt: DateTime.utc().toISO(),
      metrics: metricsKeys,
      metricsCount,
      sent: true,
    };
    logger.info("Spotify metrics sent", { response });
    return response;
  } catch (e) {
    const response: IResponseData = {
      serviceProvider: "Spotify",
      sentAt: DateTime.utc().toISO(),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    };
    logger.error("Spotify metrics were not sent to Databox", new Error(e as undefined), { response });
    return response;
  }
}
