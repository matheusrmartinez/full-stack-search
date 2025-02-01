import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BadRequestError, NotFoundError } from './http-errors';
import { env } from 'src/_config/env';
import { HttpStatusCode } from 'src/http/routes/utils/http-status-code';

export function errorHandler(
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  const isDevelopment = env.NODE_ENV === 'development';

  // Custom error mapping
  const errorMapping: Record<string, { statusCode: number; message: string }> =
    {
      ZodError: {
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Validation error',
      },
      BadRequestError: {
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: error.message,
      },
      NotFoundError: {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: error.message,
      },
    };

  // Special handling for Zod validation errors
  if (error instanceof ZodError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Validation error',
      statusCode: HttpStatusCode.BAD_REQUEST,
      errors: error.flatten().fieldErrors,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Check if the error exists in the mapping
  const mappedError = errorMapping[error.constructor.name];

  if (mappedError) {
    return res.status(mappedError.statusCode).json({
      message: mappedError.message,
      statusCode: mappedError.statusCode,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Unknown errors → Internal Server Error
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    ...(isDevelopment && { stack: error.stack }),
  });
}
