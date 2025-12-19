import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentController from '../controllers/payment.controller';
import {
  paymentRateLimit,
  validatePaymentAmount,
  validateCurrency,
  preventDuplicatePayment,
  logPaymentAttempt,
  sanitizePaymentData,
  checkPaymentEligibility
} from '../middleware/payment.middleware';

const router = express.Router();

// Challenge Payment Routes
router.post(
  '/challenge/create-intent',
  authenticate,
  paymentRateLimit(5, 60000), // 5 requests per minute
  sanitizePaymentData,
  validatePaymentAmount,
  validateCurrency,
  checkPaymentEligibility,
  preventDuplicatePayment,
  logPaymentAttempt,
  paymentController.createChallengePayment
);

router.post(
  '/challenge/confirm',
  authenticate,
  paymentRateLimit(10, 60000),
  logPaymentAttempt,
  paymentController.confirmChallengePayment
);

// Wallet Deposit Routes
router.post(
  '/deposit/create-intent',
  authenticate,
  paymentRateLimit(5, 60000),
  sanitizePaymentData,
  validatePaymentAmount,
  validateCurrency,
  checkPaymentEligibility,
  logPaymentAttempt,
  paymentController.createDepositIntent
);

router.post(
  '/deposit/confirm',
  authenticate,
  paymentRateLimit(10, 60000),
  paymentController.confirmDeposit
);

// Payment History
router.get(
  '/history',
  authenticate,
  paymentRateLimit(20, 60000),
  paymentController.getPaymentHistory
);

// Refund
router.post(
  '/refund',
  authenticate,
  paymentRateLimit(3, 60000), // Stricter limit for refunds
  logPaymentAttempt,
  paymentController.requestRefund
);

// Stripe Webhook (Public - No auth)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

export default router;
