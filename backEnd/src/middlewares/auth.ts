import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Basic Bearer token authentication middleware.
 * Replace the token validation logic with your actual auth strategy (JWT, etc.)
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError('Authentication required. Please provide a Bearer token.', 401)
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Invalid token format', 401));
  }

  // TODO: Replace with real JWT verification logic
  // e.g., const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  // req.user = decoded;

  next();
}
