import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Access denied. Admins only.', 403));
  }

  next();
}