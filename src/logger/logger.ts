import pino from "pino";
import type { IncomingMessage, ServerResponse } from "http";
import { createHTTPLogger } from "./httpLogger";
import { config } from "../config";

/**
 * A logger that can be used in all services to get consistent logging output.
 */
export interface Logger {
  /**
   * Logs a message at the trace logging level
   *
   * @param msg - the log message
   * @param meta - optional metadata to include in the log message
   */
  trace(msg: string, meta?: Record<string, unknown>): void;

  /**
   * Logs a message at the debug logging level
   *
   * @param msg - the log message
   * @param meta - optional metadata to include in the log message
   */
  debug(msg: string, meta?: Record<string, unknown>): void;

  /**
   * Logs a message at the info logging level
   *
   * @param msg - the log message
   * @param meta - optional metadata to include in the log message
   */
  info(msg: string, meta?: Record<string, unknown>): void;

  /**
   * Logs a message at the warn logging level
   *
   * @param msg - the log message
   * @param meta - optional metadata to include in the log message
   */
  warn(msg: string, meta?: Record<string, unknown>): void;

  /**
   * Logs a message at the error logging level
   *
   * @param msg - the log message
   * @param err - the error object
   * @param meta - optional metadata to include in the log message
   */
  error(msg: string, err: Error, meta?: Record<string, unknown>): void;

  /**
   * Logs HTTP request and response message at the info level. If debug level is
   * enabled, req and res bodies are logged, otherwise only metadata is logged.
   */
  http(req: IncomingMessage, res: ServerResponse): void;
}

const rootLogger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  level: config.logLevel,
  messageKey: "msg",
  errorKey: "err",
  base: {},
  transport: config.logFormat === "pretty" ? { target: "pino-pretty" } : undefined,
});

/**
 * Create a named logger instance.
 *
 * @public
 */
export function createLogger(name: string): Logger {
  const logger = rootLogger.child({ logger: name });

  return {
    trace: (msg, meta) => logger.trace({ meta }, msg),
    debug: (msg, meta) => logger.debug({ meta }, msg),
    info: (msg, meta) => logger.info({ meta }, msg),
    warn: (msg, meta) => logger.warn({ meta }, msg),
    error: (msg, err, meta) => logger.error({ err, meta }, msg),
    http: (req, res) => {
      const httpLogger = createHTTPLogger(logger);
      httpLogger(req, res);
    },
  };
}
