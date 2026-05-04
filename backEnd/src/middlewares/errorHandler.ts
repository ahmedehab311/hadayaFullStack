import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client'
interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: any, 
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided. Please check your fields and try again.';
  }

  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      message = `This ${field} is already registered.`;
    } else {
      message = `Database error: ${err.code}`;
    }
  }

  else if (err instanceof Error) {
    message = err.message;
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}