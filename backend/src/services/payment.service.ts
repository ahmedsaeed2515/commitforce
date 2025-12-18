import Stripe from 'stripe';
import config from '../config/env';
import Transaction from '../models/Transaction.model';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';

const stripe = new Stripe(config.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia' as any, // Using latest API version or let it default if unsure
  typescript: true,
});

/**
 * Create Payment Intent for Deposit
 */
export const createDepositIntent = async (userId: string, amount: number, currency: string = 'usd') => {
  if (amount <= 0) throw ApiError.badRequest('Amount must be positive');

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses smallest currency unit (cents)
    currency: currency.toLowerCase(),
    metadata: {
      userId,
      type: 'deposit'
    }
  });

  // Create Pending Transaction Record
  const transaction = await Transaction.create({
    user: userId,
    amount,
    currency,
    type: 'deposit',
    status: 'pending',
    stripePaymentIntentId: paymentIntent.id
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: transaction._id
  };
};

/**
 * Confirm Transaction (Webhook or Manual)
 */
export const confirmTransaction = async (paymentIntentId: string) => {
    const transaction = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!transaction) return null;

    if (transaction.status === 'completed') return transaction;

    transaction.status = 'completed';
    await transaction.save();

    // Update User Balance
    await User.findByIdAndUpdate(transaction.user, {
        $inc: { 'balance.amount': transaction.amount }
    });

    return transaction;
};
