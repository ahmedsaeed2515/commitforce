/**
 * Custom API Error Class
 * Used for consistent error handling across the application
 */
class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    errors?: any[]
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request', errors?: any[]) {
    return new ApiError(400, message, true, errors);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string = 'Conflict') {
    return new ApiError(409, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message, false);
  }
}

export default ApiError;
