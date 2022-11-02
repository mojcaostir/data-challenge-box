import { githubService } from "../../src/services/github/githubService";
import * as octokit from "../../src/adapters/github";
import * as databox from "../../src/adapters/databox";

describe("githubService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns info about sent data", async () => {
    jest.spyOn(octokit, "getGithubMetric").mockResolvedValue([{ metric: 1 }]);
    jest.spyOn(databox, "sendMetricsToDatabox").mockResolvedValue({ id: "1", message: "ok", status: "123" });
    const githubServiceResponse = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);
    expect(githubServiceResponse).toStrictEqual({
      serviceProvider: "Github",
      sentAt: expect.any(String),
      metrics: ["comments", "releases", "stars"],
      metricsCount: 3,
      sent: true,
    });
  });

  it("when Github returns error it returns info with error message", async () => {
    jest.spyOn(octokit, "getGithubMetric").mockRejectedValue(new Error());
    const databoxFn = jest.spyOn(databox, "sendMetricsToDatabox");
    const githubServiceResponse = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);
    expect(databoxFn).not.toBeCalled();
    expect(githubServiceResponse).toStrictEqual({
      serviceProvider: "Github",
      sentAt: expect.any(String),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error getting metrics from github",
    });
  });

  it("when Databox returns error it returns info with error message", async () => {
    jest.spyOn(octokit, "getGithubMetric").mockResolvedValue([{ metric: 1 }]);
    jest.spyOn(databox, "sendMetricsToDatabox").mockRejectedValue(new Error());
    const githubServiceResponse = await githubService([
      { endpoint: "issues/comments", owner: "nodejs", repo: "nodejs.dev", key: "comments", dateTime: true },
      { endpoint: "releases", owner: "nodejs", repo: "postject", key: "releases", dateTime: false },
      { endpoint: "stargazers", owner: "nodejs", repo: "postject", key: "stars", dateTime: false },
    ]);
    expect(githubServiceResponse).toStrictEqual({
      serviceProvider: "Github",
      sentAt: expect.any(String),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    });
  });
});
