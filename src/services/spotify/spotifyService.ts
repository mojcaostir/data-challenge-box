import { DateTime } from "luxon";
import { sendMetricsToDatabox } from "../../adapters/databox";
import { IMetrics, IResponseData, SpotifyMetricKey } from "../../models";
import { getSpotifyMetric } from "../../adapters/spotify";

export async function spotifyService(inputArray: { url: string; key: SpotifyMetricKey }[]): Promise<IResponseData> {
  let metricsCount = 0;
  const metricsKeys: SpotifyMetricKey[] = [];
  const metrics: IMetrics[] = [];

  for (const input of inputArray) {
    let spotifyMetric;
    try {
      spotifyMetric = await getSpotifyMetric(input.url);
    } catch (e: unknown) {
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
    await sendMetricsToDatabox(metrics, "Spotify");
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
