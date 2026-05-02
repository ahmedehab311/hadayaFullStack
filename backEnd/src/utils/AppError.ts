/**
 * Custom application error class.
 * Extends the native Error with an HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Differentiates operational errors from bugs

    // Maintains proper stack trace (V8)
    Error.captureStackTrace(this, this.constructor);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
