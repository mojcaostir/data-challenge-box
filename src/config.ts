export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export const config = {
  logLevel: getAllowedConfig<LogLevel>("LOG_LEVEL", Object.values(LogLevel), LogLevel.Info),
  cronExpression: getConfig("CRON_EXPRESSION"),
  gitHubToken: getConfig("GITHUB_PERSONAL_ACCESS_TOKEN"),
  spotifyClientId: getConfig("SPOTIFY_CLIENT_ID"),
  spotifyClientSecret: getConfig("SPOTIFY_CLIENT_SECRET"),
  databoxToken: getConfig("DATABOX_TOKEN"),
};

export function getAllowedConfig<T>(envKey: string, allowedValues: readonly T[], fallbackValue: T): T {
  return allowedValues.find((v) => v === process.env[envKey]) ?? fallbackValue;
}

function getConfig(envKey: string): string {
  const envValue = process.env[envKey];
  // All configs must be explicitly set.
  if (envValue === undefined) {
    console.log("Bad config.", new Error(`Config key ${envKey} is undefined.`));
    throw new Error("Bad config.");
  }
  return envValue;
}
