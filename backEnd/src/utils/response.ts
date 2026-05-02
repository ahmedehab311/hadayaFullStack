import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Send a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  const response: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized error response.
 */
export function sendError(
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500
): void {
  const response: ApiResponse<null> = { success: false, message, data: null };
  res.status(statusCode).json(response);
}
