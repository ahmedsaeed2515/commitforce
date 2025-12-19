import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'info' | 'success' | 'warning' | 'error' | 'comment' | 'mention' | 'badge' | 'challenge';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['info', 'success', 'warning', 'error', 'comment', 'mention', 'badge', 'challenge'], 
    default: 'info' 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', notificationSchema);
