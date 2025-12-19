import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware for payment endpoints
 */
export const paymentRateLimit = (maxRequests: number = 5, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id.toString();
    if (!userId) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const key = `payment_${userId}`;
    const now = Date.now();
    const userLimit = rateLimitStore.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or create new limit
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return next(ApiError.tooManyRequests(
        `Too many payment requests. Please try again in ${retryAfter} seconds.`
      ));
    }

    userLimit.count++;
    next();
  };
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number') {
    return next(ApiError.badRequest('Valid amount is required'));
  }

  if (amount <= 0) {
    return next(ApiError.badRequest('Amount must be greater than zero'));
  }

  if (amount > 1000000) {
    return next(ApiError.badRequest('Amount exceeds maximum limit'));
  }

  // Check for suspicious amounts (e.g., very precise decimals)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return next(ApiError.badRequest('Amount can have maximum 2 decimal places'));
  }

  next();
};

/**
 * Validate currency
 */
export const validateCurrency = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currency } = req.body;
  const allowedCurrencies = ['USD', 'EUR', 'GBP', 'EGP', 'SAR', 'AED'];

  if (currency && !allowedCurrencies.includes(currency.toUpperCase())) {
    return next(ApiError.badRequest(
      `Currency must be one of: ${allowedCurrencies.join(', ')}`
    ));
  }

  next();
};

/**
 * Prevent duplicate payments
 */
export const preventDuplicatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { challengeId } = req.body;
  const userId = req.user?._id.toString();

  if (!challengeId || !userId) {
    return next();
  }

  const key = `payment_lock_${userId}_${challengeId}`;
  const existingLock = rateLimitStore.get(key);

  if (existingLock && Date.now() < existingLock.resetTime) {
    return next(ApiError.conflict(
      'A payment for this challenge is already being processed'
    ));
  }

  // Set lock for 5 minutes
  rateLimitStore.set(key, {
    count: 1,
    resetTime: Date.now() + 300000
  });

  next();
};

/**
 * Log payment attempts for security monitoring
 */
export const logPaymentAttempt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id.toString();
  const { amount, challengeId } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  console.log('[PAYMENT ATTEMPT]', {
    userId,
    amount,
    challengeId,
    ip,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });

  next();
};

/**
 * Validate webhook signature
 */
export const validateWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return next(ApiError.badRequest('Missing webhook signature'));
  }

  // Signature validation will be done in the controller
  next();
};

/**
 * Sanitize payment metadata
 */
export const sanitizePaymentData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, currency, challengeId } = req.body;

  // Remove any potentially harmful characters
  if (typeof amount === 'string') {
    req.body.amount = parseFloat(amount.replace(/[^0-9.]/g, ''));
  }

  if (currency) {
    req.body.currency = currency.toString().toUpperCase().substring(0, 3);
  }

  if (challengeId) {
    req.body.challengeId = challengeId.toString().replace(/[^a-zA-Z0-9]/g, '');
  }

  next();
};

/**
 * Check user payment eligibility
 */
export const checkPaymentEligibility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  // Check if user has any pending payments
  const pendingKey = `pending_payments_${userId}`;
  const pendingCount = rateLimitStore.get(pendingKey);

  if (pendingCount && pendingCount.count > 3) {
    return next(ApiError.badRequest(
      'You have too many pending payments. Please complete or cancel them first.'
    ));
  }

  next();
};

// Cleanup old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 3600000);
