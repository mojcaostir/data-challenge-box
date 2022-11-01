import { Response } from "express";
import { Send } from "express-serve-static-core";

export type GithubMetricKey = "comments" | "releases" | "stars";
export type SpotifyMetricKey = "categoryPlaylists" | "playlistItems" | "userPlaylists";

const serviceProvider = ["Github", "Spotify"] as const;
export type ServiceProvider = typeof serviceProvider[number];

export interface IResponseBody<T> extends Response {
  json: Send<T, this>;
}

export interface IMetrics {
  key: GithubMetricKey | SpotifyMetricKey;
  value: number;
}

export interface IResponseData {
  serviceProvider: ServiceProvider;
  sentAt: string;
  metrics: GithubMetricKey[] | SpotifyMetricKey[];
  metricsCount: number;
  sent: boolean;
  errorMessage?: string;
}

export interface IDataboxResponse {
  id: string;
  status: string;
  message: string;
}

export interface ISpotifyResponse {
  total?: number;
  playlists?: { total: number };
}
