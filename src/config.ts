export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export enum LogFormat {
  Pretty = "pretty",
  Json = "json",
}

export const config = {
  logLevel: getAllowedConfig<LogLevel>("LOG_LEVEL", Object.values(LogLevel), LogLevel.Info),
  logFormat: getAllowedConfig<LogFormat>("LOG_FORMAT", Object.values(LogFormat), LogFormat.Json),
  gitHubToken: getConfig("GITHUB_PERSONAL_ACCESS_TOKEN"),
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
