import Stripe from 'stripe';
import config from '../config/env';
import Payment from '../models/Payment.model';
import Transaction from '../models/Transaction.model';
import Challenge from '../models/Challenge.model';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';

const stripe = new Stripe(config.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
  typescript: true,
});

/**
 * Create Stripe Customer for user with enhanced metadata
 */
export const createStripeCustomer = async (userId: string, email: string, name: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { 
        userId,
        platform: 'CommitForce',
        createdAt: new Date().toISOString()
      }
    });

    await User.findByIdAndUpdate(userId, {
      stripeCustomerId: customer.id
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw ApiError.internal('Failed to create payment customer');
  }
};

/**
 * Create Payment Intent with multiple payment methods support
 * Supports: Cards, Apple Pay, Google Pay, PayPal, Cash App
 */
export const createChallengePaymentIntent = async (
  userId: string,
  challengeId: string,
  amount: number,
  currency: string = 'EGP',
  paymentMethodTypes: string[] = ['card', 'paypal', 'cashapp']
) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw ApiError.notFound('Challenge not found');

    if (challenge.deposit.paid) {
      throw ApiError.badRequest('Challenge deposit already paid');
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, user.fullName);
      customerId = customer.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      customer: customerId,
      description: `Deposit for challenge: ${challenge.title}`,
      metadata: {
        userId,
        challengeId,
        challengeTitle: challenge.title,
        type: 'challenge_deposit',
        platform: 'CommitForce',
        timestamp: new Date().toISOString()
      },
      // Support multiple payment methods
      payment_method_types: paymentMethodTypes,
      // Enable automatic payment methods (Apple Pay, Google Pay, etc.)
      automatic_payment_methods: { 
        enabled: true,
        allow_redirects: 'never'
      },
      // Enhanced security
      setup_future_usage: 'off_session',
      // Statement descriptor
      statement_descriptor: 'CommitForce',
      statement_descriptor_suffix: challenge.title.substring(0, 10),
    });

    const payment = await Payment.create({
      user: userId,
      challenge: challengeId,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customerId,
      status: 'pending',
      description: `Deposit for challenge: ${challenge.title}`,
      metadata: {
        challengeTitle: challenge.title,
        paymentMethodTypes: paymentMethodTypes.join(',')
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment._id
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error creating payment intent:', error);
    throw ApiError.internal('Failed to create payment intent');
  }
};

/**
 * Confirm payment and update challenge
 */
export const confirmChallengePayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw ApiError.badRequest('Payment not succeeded');
    }

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) throw ApiError.notFound('Payment not found');

    payment.status = 'succeeded';
    payment.paidAt = new Date();
    payment.stripePaymentMethodId = paymentIntent.payment_method as string;
    await payment.save();

    const challenge = await Challenge.findById(payment.challenge);
    if (challenge) {
      challenge.deposit.paid = true;
      challenge.deposit.paidAt = new Date();
      challenge.deposit.transactionId = payment._id.toString();
      challenge.status = 'active';
      await challenge.save();
    }

    return payment;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error confirming payment:', error);
    throw ApiError.internal('Failed to confirm payment');
  }
};

/**
 * Process refund for failed challenge
 */
export const processChallengeRefund = async (
  challengeId: string,
  reason: string = 'Challenge failed'
) => {
  try {
    const payment = await Payment.findOne({
      challenge: challengeId,
      status: 'succeeded'
    });

    if (!payment) throw ApiError.notFound('Payment not found');
    if (!payment.stripePaymentIntentId) {
      throw ApiError.badRequest('No Stripe payment intent found');
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: 'requested_by_customer',
      metadata: { challengeId, reason }
    });

    payment.status = 'refunded';
    payment.refundAmount = payment.amount;
    payment.refundedAt = new Date();
    payment.refundReason = reason;
    await payment.save();

    await Challenge.findByIdAndUpdate(challengeId, {
      'deposit.paid': false,
      status: 'cancelled'
    });

    return refund;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error processing refund:', error);
    throw ApiError.internal('Failed to process refund');
  }
};

/**
 * Get user payment history
 */
export const getUserPayments = async (userId: string) => {
  try {
    const payments = await Payment.find({ user: userId })
      .populate('challenge', 'title status')
      .sort({ createdAt: -1 });

    return payments;
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw ApiError.internal('Failed to get payment history');
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await confirmChallengePayment(paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntent.id
        });
        
        if (payment) {
          payment.status = 'failed';
          payment.failedAt = new Date();
          payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
          await payment.save();
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const payment = await Payment.findOne({
          stripePaymentIntentId: charge.payment_intent as string
        });
        
        if (payment && payment.status !== 'refunded') {
          payment.status = 'refunded';
          payment.refundedAt = new Date();
          await payment.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};

// Keep existing deposit functions for wallet
export const createDepositIntent = async (userId: string, amount: number, currency: string = 'usd') => {
  if (amount <= 0) throw ApiError.badRequest('Amount must be positive');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata: {
      userId,
      type: 'deposit'
    }
  });

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

export const confirmTransaction = async (paymentIntentId: string) => {
  const transaction = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });
  if (!transaction) return null;

  if (transaction.status === 'completed') return transaction;

  transaction.status = 'completed';
  await transaction.save();

  await User.findByIdAndUpdate(transaction.user, {
    $inc: { 'balance.amount': transaction.amount }
  });

  return transaction;
};

export { stripe };
