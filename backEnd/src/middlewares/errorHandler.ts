import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Expose stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
