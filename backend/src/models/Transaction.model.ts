import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  challenge?: mongoose.Types.ObjectId; // If related to a challenge deposit
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'penalty' | 'reward';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    stripePaymentIntentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'penalty', 'reward'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
