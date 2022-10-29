import { pinoHttp } from "pino-http";
import pino, { SerializedRequest } from "pino";
import type { IncomingMessage } from "http";
import { v4 as uuid } from "uuid";
import { LogLevel } from "../config";

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

export function createHTTPLogger(logger: pino.Logger) {
  return pinoHttp({
    logger,
    redact: ["req.query", ...requestHeaders, ...owaspSecureResponseHeaders],
    genReqId: function (req) {
      req.id = req.headers["x-request-id"] || uuid();
      return req.id;
    },
    serializers: {
      req: reqSerializer([reqUrlSerializer, reqBodySerializer], logger),
    },
  });
}
