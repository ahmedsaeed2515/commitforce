import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  
  // Payment Details
  amount: number;
  currency: string;
  
  // Stripe Details
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  
  // Status
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'wallet' | 'bank_transfer';
  
  // Metadata
  description?: string;
  metadata?: Record<string, unknown>;
  
  // Refund
  refundAmount?: number;
  refundedAt?: Date;
  refundReason?: string;
  
  // Timestamps
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Challenge is required'],
    index: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    default: 'EGP',
    uppercase: true
  },
  
  // Stripe Details
  stripePaymentIntentId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeCustomerId: String,
  stripePaymentMethodId: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'bank_transfer'],
    default: 'card'
  },
  
  // Metadata
  description: String,
  metadata: Schema.Types.Mixed,
  
  // Refund
  refundAmount: Number,
  refundedAt: Date,
  refundReason: String,
  
  // Timestamps
  paidAt: Date,
  failedAt: Date,
  failureReason: String
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ challenge: 1, status: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);
