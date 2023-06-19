import { registerAs } from '@nestjs/config'
import { Request, Response } from 'express'
import { Options } from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

export const loggerConfig = registerAs<Options>('logger', () => ({
  genReqId: () => uuidv4(),
  autoLogging: true,
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  serializers: {
    req(_req: any) {
      const sanitizedReq = {
        id: _req.id,
        method: _req.method,
        url: _req.url,
        params: (_req.raw as Request).params,
        query: (_req.raw as Request).query,
        body: (_req.raw as Request).body,
      }

      return sanitizedReq
    },
    res(_res: any) {
      const sanitizedRes = {
        status: _res.statusCode,
      }

      return sanitizedRes
    },
    err(_err: any) {
      const santizedErr = {
        ..._err,
      }

      return santizedErr
    },
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: true,
            ignore: 'pid,hostname,service',
            singleLine: true,
          },
        }
      : undefined,
  customReceivedMessage: (req: Request) =>
    `[INCOMING]: ${req.url} [${req.method}]`,
  customReceivedObject: () => ({
    eventCode: LoggerEvent.RequestReceived,
  }),
  customSuccessMessage: (req: Request, res: Response) =>
    `${req.url} [${req.method}] - ${res.statusCode}`,
  customSuccessObject: () => ({
    eventCode: LoggerEvent.RequestSuccess,
  }),
  customErrorMessage: (req: Request, res: Response) =>
    `${req.url} [${req.method}] - ${res.statusCode}`,
  customErrorObject: () => ({
    eventCode: LoggerEvent.RequestError,
  }),
}))

enum LoggerEvent {
  RequestReceived = 'REQUEST_RECEIVED',
  RequestSuccess = 'REQUEST_SUCCESS',
  RequestError = 'REQUEST_ERROR',
}
