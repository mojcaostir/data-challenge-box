import { config } from "../config";
import { createLogger } from "../util/logger";
import { IDataboxResponse, IMetrics } from "../models";

const Databox = require("databox");

const logger = createLogger("Databox Adapter Logger");

const client = new Databox({
  push_token: config.databoxToken,
});

export async function sendMetricsToDatabox(metrics: IMetrics[]): Promise<IDataboxResponse> {
  logger.trace("Sending metrics to Databox", { metrics });
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
