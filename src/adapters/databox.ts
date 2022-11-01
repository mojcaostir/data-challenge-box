import { config } from "../config";
import { createLogger } from "../util/logger";
import { IDataboxResponse, IMetrics, ServiceProvider } from "../models";

const Databox = require("databox");

const logger = createLogger("Databox Adapter Logger");

export async function sendMetricsToDatabox(
  metrics: IMetrics[],
  serviceProvider: ServiceProvider
): Promise<IDataboxResponse> {
  logger.debug("Sending metrics to Databox", { metrics });
  const client = new Databox({
    push_token: serviceProvider === "Github" ? config.databoxTokenGithub : config.databoxTokenSpotify,
  });
  return new Promise((resolve, reject) => {
    client.insertAll(metrics, (response: IDataboxResponse) => {
      if (response.status !== "OK") {
        logger.error("Error sending metrics to Databox", new Error(response.message), { response });
        return reject(new Error(JSON.stringify(response)));
      } else {
        logger.trace("Metrics sent to Databox", { response });
        resolve(response);
      }
    });
  });
}
