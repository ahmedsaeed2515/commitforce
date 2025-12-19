import { Request, Response, NextFunction } from 'express';
import cache, { CACHE_KEYS, CACHE_TTL } from '../config/redis';

/**
 * Rate Limiter Middleware using Redis
 * Limits requests per IP address
 */
export const createRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  message?: string;
}) => {
  const {
    windowMs,
    maxRequests,
    keyPrefix = 'ratelimit',
    message = 'Too many requests, please try again later.',
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // If Redis is not available, skip rate limiting
    if (!cache.isConnected()) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `${keyPrefix}:${ip}`;

    try {
      const current = await cache.incr(key);
      
      if (current === 1) {
        // First request in window, set expiry
        await cache.expire(key, Math.ceil(windowMs / 1000));
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - (current || 0)));

      if (current && current > maxRequests) {
        return res.status(429).json({
          success: false,
          message,
        });
      }

      next();
    } catch (error) {
      // On error, allow the request to proceed
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

/**
 * Pre-configured rate limiters
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyPrefix: 'auth',
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyPrefix: 'api',
  message: 'API rate limit exceeded. Please slow down.',
});

export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  keyPrefix: 'strict',
  message: 'Request limit exceeded. Please wait.',
});

/**
 * Cache Middleware - caches GET responses
 */
export const cacheMiddleware = (options: {
  ttl?: number;
  key?: string | ((req: Request) => string);
}) => {
  const { ttl = CACHE_TTL.MEDIUM, key } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // If Redis is not available, skip caching
    if (!cache.isConnected()) {
      return next();
    }

    // Generate cache key
    const cacheKey = typeof key === 'function'
      ? key(req)
      : key || `route:${req.originalUrl}`;

    try {
      // Check cache
      const cached = await cache.get<{
        statusCode: number;
        body: unknown;
      }>(cacheKey);

      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(cached.statusCode).json(cached.body);
      }

      // Store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = (body: unknown) => {
        // Cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(cacheKey, {
            statusCode: res.statusCode,
            body,
          }, ttl).catch(() => {});
        }
        
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Invalidate cache middleware - clears cache on mutations
 */
export const invalidateCacheMiddleware = (patterns: string[]) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to invalidate cache after successful response
    res.json = (body: unknown) => {
      // Invalidate cache on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        Promise.all(
          patterns.map(pattern => cache.delPattern(pattern))
        ).catch(() => {});
      }
      
      return originalJson(body);
    };

    next();
  };
};

/**
 * Pre-configured cache invalidators
 */
export const invalidateLeaderboard = invalidateCacheMiddleware([
  CACHE_KEYS.LEADERBOARD + '*',
]);

export const invalidateUserStats = (userId: string) => invalidateCacheMiddleware([
  CACHE_KEYS.USER_STATS(userId),
  CACHE_KEYS.USER_BADGES(userId),
  CACHE_KEYS.USER_STREAK(userId),
  CACHE_KEYS.LEADERBOARD + '*',
]);

export default {
  createRateLimiter,
  cacheMiddleware,
  invalidateCacheMiddleware,
  authRateLimiter,
  apiRateLimiter,
  strictRateLimiter,
};
