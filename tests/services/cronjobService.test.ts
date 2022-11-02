import * as octokit from "../../src/adapters/github";
import * as databox from "../../src/adapters/databox";
import { cronjobService } from "../../src/services/cronjob/cronjobService";
import axios from "axios";

jest.mock("axios");

describe("cronjobService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns info about sent data", async () => {
    jest.spyOn(octokit, "getGithubMetric").mockResolvedValue([{ metric: 1 }]);
    jest.spyOn(databox, "sendMetricsToDatabox").mockResolvedValue({ id: "1", message: "ok", status: "123" });
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: [{ access_token: "token" }] });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: 1 });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: 1 });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: 1 });
    jest.spyOn(databox, "sendMetricsToDatabox");

    const cronjob = await cronjobService();
    cronjob.stop();
    return expect(Promise.resolve(cronjob)).resolves;
  });
});
