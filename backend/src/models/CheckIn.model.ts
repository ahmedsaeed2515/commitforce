import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckIn extends Document {
  challenge: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  
  // Check-in Data
  date: Date;
  value?: number;
  note?: string;
  
  // Proof
  photos: string[];
  measurements?: {
    weight?: number;
    bodyFat?: number;
    distance?: number;
    time?: number;
    custom?: Record<string, number>;
  };
  
  // Status
  status?: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  
  // Engagement
  likes: mongoose.Types.ObjectId[];
  comments: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const checkInSchema = new Schema<ICheckIn>({
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Challenge is required'],
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  
  date: {
    type: Date,
    required: [true, 'Check-in date is required'],
    index: true,
    default: Date.now
  },
  value: {
    type: Number,
    min: [0, 'Value must be positive']
  },
  note: {
    type: String,
    maxlength: [1000, 'Note cannot exceed 1000 characters']
  },
  
  photos: [{ 
    type: String,
    validate: {
      validator: function(url: string) {
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Invalid photo URL'
    }
  }],
  
  measurements: {
    weight: Number,
    bodyFat: Number,
    distance: Number,
    time: Number,
    custom: Schema.Types.Mixed
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes
checkInSchema.index({ challenge: 1, date: -1 });
checkInSchema.index({ user: 1, createdAt: -1 });
checkInSchema.index({ challenge: 1, user: 1, date: -1 });

// Virtual for like count
checkInSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Prevent duplicate check-ins on the same day for the same challenge
checkInSchema.index({ challenge: 1, date: 1 }, { unique: false });

export default mongoose.model<ICheckIn>('CheckIn', checkInSchema);
