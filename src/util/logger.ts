import pino, { SerializedRequest } from "pino";
import type { IncomingMessage, ServerResponse } from "http";
import { config, LogLevel } from "../config";
import { pinoHttp } from "pino-http";
import { v4 as uuid } from "uuid";

export function createLogger(name: string): Logger {
  const logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    level: config.logLevel,
    messageKey: "msg",
    errorKey: "err",
    base: {},
    transport: { target: "pino/file", options: { destination: "log" } },
  }).child({ logger: name });

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

function createHTTPLogger(logger: pino.Logger) {
  return pinoHttp({
    logger,
    redact: ["req.query", ...requestHeaders, ...owaspSecureResponseHeaders],
    customSuccessMessage: function (req, res) {
      if (res.statusCode === 404) {
        return "Resource not found";
      }
      return `${req.method} request completed`;
    },
    genReqId: function (req) {
      req.id = req.headers["x-request-id"] || uuid();
      return req.id;
    },
    serializers: {
      req: reqSerializer([reqUrlSerializer, reqBodySerializer], logger),
    },
  });
}

interface Logger {
  trace(msg: string, meta?: Record<string, unknown>): void;

  debug(msg: string, meta?: Record<string, unknown>): void;

  info(msg: string, meta?: Record<string, unknown>): void;

  warn(msg: string, meta?: Record<string, unknown>): void;

  error(msg: string, err: Error, meta?: Record<string, unknown>): void;

  http(req: IncomingMessage, res: ServerResponse): void;
}

interface PinoRequest extends SerializedRequest {
  body?: unknown;
  raw: IncomingMessage & { body?: unknown };
}

type PinoReqSerializer = (req: PinoRequest, logger: pino.Logger) => PinoRequest;

const requestHeaders = ["req.headers.authorization", `req.headers["x-api-key"]`];

const owaspSecureResponseHeaders = [
  `res.headers["host-header"]`,
  `res.headers["liferay-portal"]`,
  `res.headers["powered-by"]`,
  `res.headers["product"]`,
  `res.headers["server"]`,
  `res.headers["sourcemap"]`,
  `res.headers["x-aspnet-version"]`,
  `res.headers["x-aspnetmvc-version"]`,
  `res.headers["x-cf-powered-by"]`,
  `res.headers["x-cms"]`,
  `res.headers["x-content-encoded-by"]`,
  `res.headers["x-envoy-upstream-service-time"]`,
  `res.headers["x-framework"]`,
  `res.headers["x-generated-by"]`,
  `res.headers["x-generator"]`,
  `res.headers["x-php-version"]`,
  `res.headers["x-powered-by"]`,
  `res.headers["x-powered-by-plesk"]`,
  `res.headers["x-powered-cms"]`,
  `res.headers["x-redirect-by"]`,
  `res.headers["x-server-powered-by"]`,
  `res.headers["x-sourcefiles"]`,
  `res.headers["x-sourcemap"]`,
  `res.headers["x-turbo-charged-by"]`,
];

function reqSerializer(reqSerializers: PinoReqSerializer[], logger: pino.Logger) {
  return function (req: PinoRequest) {
    return reqSerializers.reduce((pinoReqAcc, serializer) => serializer(pinoReqAcc, logger), req);
  };
}

function reqUrlSerializer(req: PinoRequest): PinoRequest {
  const parsedUrl = new URL(req.url, `http://${req.headers["host"] ?? "unknown-host"}`);

  parsedUrl.search = "";

  req.url = parsedUrl.toString();
  return req;
}

function reqBodySerializer(req: PinoRequest, logger: pino.Logger): PinoRequest {
  if (req.raw.body === undefined) {
    return req;
  }

  if (logger.isLevelEnabled(LogLevel.Debug)) {
    req.body = req.raw.body;
  }

  return req;
}
