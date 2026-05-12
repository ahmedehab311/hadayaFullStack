import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'ADMIN' | 'USER';
      };
    }
  }
}

interface JwtPayload {
  id: string;
  role: 'ADMIN' | 'USER';
}

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

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id || !decoded.role) {
      return next(new AppError('Invalid token payload.', 401));
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 401));
  }
}
