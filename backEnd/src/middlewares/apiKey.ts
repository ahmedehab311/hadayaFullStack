import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function verifyApiKey(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error('API_KEY is not defined in environment variables');
  }

  const apiKey = req.headers['api-key'] as string;

  if (!apiKey) {
    return next(new AppError('api-key required', 401));
  }

  if (apiKey !== API_KEY) {
    return next(new AppError('Invalid api-key', 403));
  }

  next();
}