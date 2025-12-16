import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to error middleware
 */
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
