import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as paymentService from '../services/payment.service';

/**
 * @desc    Initialize Deposit
 * @route   POST /api/v1/payments/deposit
 * @access  Private
 */
export const createDeposit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { amount, currency } = req.body;

  const result = await paymentService.createDepositIntent(userId, amount, currency);

  res.status(200).json(
    ApiResponse.success('Payment initialized', result)
  );
});

/**
 * @desc    Stripe Webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public
 */
// Webhook implementation depends on Stripe signature verification
// For MVP/Dev, we might just have a manual confirm endpoint for testing if webhook is hard locally
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
   // Real implementation requires verifying stripe signature
   // const sig = req.headers['stripe-signature'];
   // ... verify event ...
   
   // Mocking successful payment for now if called
   const { type, data } = req.body;
   
   if (type === 'payment_intent.succeeded') {
       const paymentIntent = data.object;
       await paymentService.confirmTransaction(paymentIntent.id);
   }

   res.json({ received: true });
});
