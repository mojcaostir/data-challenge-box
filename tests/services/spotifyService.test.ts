import * as databox from "../../src/adapters/databox";
import { spotifyService } from "../../src/services/spotify/spotifyService";
import axios from "axios";

jest.mock("axios");

describe("spotifyService function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns info about sent data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: [{ access_token: "token" }] });
    (axios.get as jest.Mock).mockResolvedValue({ data: 1 });
    jest.spyOn(databox, "sendMetricsToDatabox").mockResolvedValueOnce({ id: "1", message: "ok", status: "123" });
    const spotifyServiceResponse = await spotifyService([
      { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
    ]);
    expect(spotifyServiceResponse).toStrictEqual({
      serviceProvider: "Spotify",
      sentAt: expect.any(String),
      metrics: ["playlistItems"],
      metricsCount: 1,
      sent: true,
    });
  });

  it("when Spotify returns error it returns info with error message", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error());
    const databoxFn = jest.spyOn(databox, "sendMetricsToDatabox");
    const githubServiceResponse = await spotifyService([
      { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
    ]);
    expect(databoxFn).not.toBeCalled();
    expect(githubServiceResponse).toStrictEqual({
      serviceProvider: "Spotify",
      sentAt: expect.any(String),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error getting metrics from spotify",
    });
  });

  it("when Databox returns error it returns info with error message", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: [{ access_token: "token" }] });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: 1 });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: 1 });
    jest.spyOn(databox, "sendMetricsToDatabox").mockRejectedValue(new Error());
    const githubServiceResponse = await spotifyService([
      { url: "https://api.spotify.com/v1/playlists/3Na18bFHq9tQOpcBx8dYET/tracks", key: "playlistItems" },
      { url: "https://api.spotify.com/v1/users/user_id/playlists", key: "userPlaylists" },
    ]);
    expect(githubServiceResponse).toStrictEqual({
      serviceProvider: "Spotify",
      sentAt: expect.any(String),
      metrics: [],
      metricsCount: 0,
      sent: false,
      errorMessage: "Error sending metrics to Databox",
    });
  });
});
