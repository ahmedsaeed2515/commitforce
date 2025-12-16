import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  user: mongoose.Types.ObjectId;
  
  // Basic Info
  title: string;
  description: string;
  category: 'fitness' | 'health' | 'learning' | 'habits' | 'productivity' | 'finance' | 'custom';
  customCategory?: string;
  tags: string[];
  coverImage?: string;
  
  // Goal Details
  goalType: 'numeric' | '  boolean' | 'milestone';
  targetValue?: number;
  currentValue: number;
  unit?: string;
  milestones?: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  
  // Financial
  deposit: {
    amount: number;
    currency: string;
    paid: boolean;
    paidAt?: Date;
    transactionId?: string;
  };
  
  reward: {
    amount: number;
    type: 'percentage' | 'fixed';
    paid: boolean;
    paidAt?: Date;
  };
  
  // Charity
  charity: {
    id?: mongoose.Types.ObjectId;
    name?: string;
    donated: boolean;
    donatedAt?: Date;
    amount?: number;
  };
  
  // Timeline
  startDate: Date;
  endDate: Date;
  duration: number; // days
  
  // Check-in Settings
  checkInFrequency: 'daily' | 'weekly' | 'biweekly' | 'milestone';
  requiredCheckIns: number;
  completedCheckIns: number;
  missedCheckIns: number;
  
  // Verification
  verificationType: 'auto' | 'manual' | 'partner' | 'admin';
  verificationRules?: {
    minPhotos?: number;
    requireMeasurements?: boolean;
    requireDescription?: boolean;
  };
  
  accountabilityPartner?: {
    userId: mongoose.Types.ObjectId;
    accepted: boolean;
  };
  
  // Status
  status: 'draft' | 'pending_payment' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
  completedAt?: Date;
  failedAt?: Date;
  
  // Verification
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'needs_review';
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  
  // Social
  isPublic: boolean;
  allowComments: boolean;
  likes: mongoose.Types.ObjectId[];
  views: number;
  
  // Analytics
  engagementRate: number;
  completionProbability: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  
  // Basic Info
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['fitness', 'health', 'learning', 'habits', 'productivity', 'finance', 'custom'],
    required: [true, 'Category is required'],
    index: true
  },
  customCategory: String,
  tags: [{ type: String, trim: true }],
  coverImage: String,
  
  // Goal Details
  goalType: {
    type: String,
    enum: ['numeric', 'boolean', 'milestone'],
    required: [true, 'Goal type is required']
  },
  targetValue: Number,
  currentValue: { type: Number, default: 0 },
  unit: String,
  milestones: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  
  // Financial
  deposit: {
    amount: { 
      type: Number, 
      required: [true, 'Deposit amount is required'],
      min: [0, 'Deposit amount must be positive']
    },
    currency: { type: String, default: 'EGP' },
    paid: { type: Boolean, default: false },
    paidAt: Date,
    transactionId: String
  },
  
  reward: {
    amount: { 
      type: Number, 
      required: [true, 'Reward amount is required'],
      min: [0, 'Reward amount must be positive']
    },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed'], 
      default: 'percentage' 
    },
    paid: { type: Boolean, default: false },
    paidAt: Date
  },
  
  // Charity
  charity: {
    id: { type: Schema.Types.ObjectId, ref: 'Charity' },
    name: String,
    donated: { type: Boolean, default: false },
    donatedAt: Date,
    amount: Number
  },
  
  // Timeline
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required']
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required']
  },
  duration: { 
    type: Number, 
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  
  // Check-in Settings
  checkInFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'milestone'],
    required: [true, 'Check-in frequency is required']
  },
  requiredCheckIns: { 
    type: Number, 
    required: [true, 'Required check-ins is required'],
    min: [1, 'At least 1 check-in is required']
  },
  completedCheckIns: { type: Number, default: 0 },
  missedCheckIns: { type: Number, default: 0 },
  
  // Verification
  verificationType: {
    type: String,
    enum: ['auto', 'manual', 'partner', 'admin'],
    default: 'manual'
  },
  verificationRules: {
    minPhotos: Number,
    requireMeasurements: Boolean,
    requireDescription: Boolean
  },
  
  accountabilityPartner: {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    accepted: { type: Boolean, default: false }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending_payment', 'active', 'paused', 'completed', 'failed', 'cancelled'],
    default: 'draft',
    index: true
  },
  completedAt: Date,
  failedAt: Date,
  
  // Verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_review'],
    default: 'pending'
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  rejectionReason: String,
  
  // Social
  isPublic: { type: Boolean, default: true },
  allowComments: { type: Boolean, default: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  
  // Analytics
  engagementRate: { type: Number, default: 0 },
  completionProbability: { type: Number, default: 50 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
challengeSchema.index({ user: 1, status: 1 });
challengeSchema.index({ category: 1, status: 1 });
challengeSchema.index({ startDate: 1 });
challengeSchema.index({ endDate: 1 });
challengeSchema.index({ createdAt: -1 });
challengeSchema.index({ 'likes': 1 });

// Virtual for like count
challengeSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for completion percentage
challengeSchema.virtual('completionPercentage').get(function() {
  if (this.goalType === 'numeric' && this.targetValue) {
    return Math.min(100, (this.currentValue / this.targetValue) * 100);
  }
  if (this.goalType === 'milestone' && this.milestones) {
    const completed = this.milestones.filter(m => m.completed).length;
    return (completed / this.milestones.length) * 100;
  }
  return this.status === 'completed' ? 100 : 0;
});

// Calculate progress percentage before saving
challengeSchema.pre('save', function(next) {
  // Calculate duration if not set
  if (this.startDate && this.endDate && !this.isModified('duration')) {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  next();
});

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
