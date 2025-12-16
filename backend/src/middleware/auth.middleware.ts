import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import User, { IUser } from '../models/User.model';
import config from '../config/env';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Protect routes - verify JWT token
 */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw ApiError.unauthorized('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as { id: string };

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account has been deactivated');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    throw ApiError.unauthorized('Not authorized to access this route');
  }
});

/**
 * Authorize specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action');
    }

    next();
  };
};

/**
 * Optional auth - attach user if token exists, but don't require it
 */
export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid but continue anyway
    }
  }

  next();
});
