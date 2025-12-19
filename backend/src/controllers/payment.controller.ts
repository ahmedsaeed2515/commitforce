import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as paymentService from '../services/payment.service';

/**
 * @desc    Create payment intent for challenge deposit
 * @route   POST /api/v1/payments/challenge/create-intent
 * @access  Private
 */
export const createChallengePayment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { challengeId, amount, currency } = req.body;

  if (!challengeId || !amount) {
    return res.status(400).json(
      ApiResponse.error('Challenge ID and amount are required', 400)
    );
  }

  const result = await paymentService.createChallengePaymentIntent(
    userId,
    challengeId,
    amount,
    currency || 'EGP'
  );

  res.status(200).json(
    ApiResponse.success('Payment intent created successfully', result)
  );
});

/**
 * @desc    Confirm challenge payment
 * @route   POST /api/v1/payments/challenge/confirm
 * @access  Private
 */
export const confirmChallengePayment = asyncHandler(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json(
      ApiResponse.error('Payment intent ID is required', 400)
    );
  }

  const payment = await paymentService.confirmChallengePayment(paymentIntentId);

  res.status(200).json(
    ApiResponse.success('Payment confirmed successfully', payment)
  );
});

/**
 * @desc    Get user payment history
 * @route   GET /api/v1/payments/history
 * @access  Private
 */
export const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const payments = await paymentService.getUserPayments(userId);

  res.status(200).json(
    ApiResponse.success('Payment history fetched successfully', payments)
  );
});

/**
 * @desc    Request refund for failed challenge
 * @route   POST /api/v1/payments/refund
 * @access  Private
 */
export const requestRefund = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { challengeId, reason } = req.body;

  if (!challengeId) {
    return res.status(400).json(
      ApiResponse.error('Challenge ID is required', 400)
    );
  }

  // TODO: Add authorization check - user must own the challenge

  const refund = await paymentService.processChallengeRefund(challengeId, reason);

  res.status(200).json(
    ApiResponse.success('Refund processed successfully', refund)
  );
});

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public (Stripe only)
 */
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json(
      ApiResponse.error('Webhook secret not configured', 500)
    );
  }

  try {
    const event = paymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    await paymentService.handleStripeWebhook(event);

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).json(
      ApiResponse.error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 400)
    );
  }
});

/**
 * @desc    Create deposit intent (wallet)
 * @route   POST /api/v1/payments/deposit/create-intent
 * @access  Private
 */
export const createDepositIntent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json(
      ApiResponse.error('Valid amount is required', 400)
    );
  }

  const result = await paymentService.createDepositIntent(userId, amount, currency || 'USD');

  res.status(200).json(
    ApiResponse.success('Deposit intent created successfully', result)
  );
});

/**
 * @desc    Confirm deposit transaction
 * @route   POST /api/v1/payments/deposit/confirm
 * @access  Private
 */
export const confirmDeposit = asyncHandler(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json(
      ApiResponse.error('Payment intent ID is required', 400)
    );
  }

  const transaction = await paymentService.confirmTransaction(paymentIntentId);

  if (!transaction) {
    return res.status(404).json(
      ApiResponse.error('Transaction not found', 404)
    );
  }

  res.status(200).json(
    ApiResponse.success('Deposit confirmed successfully', transaction)
  );
});
