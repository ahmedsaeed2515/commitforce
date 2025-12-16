import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import config from '../config/env';

/**
 * Global Error Handler Middleware
 */
const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (config.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = ApiError.notFound(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = ApiError.conflict(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    const message = 'Validation error';
    error = ApiError.badRequest(message, errors);
  }

  // JWT errors
  if ( err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = ApiError.unauthorized(message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = ApiError.unauthorized(message);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
