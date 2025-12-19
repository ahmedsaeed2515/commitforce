import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  
  // Stats
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  failedChallenges: number;
  successRate: number;
  
  // Financial
  balance: {
    amount: number;
    currency: string;
  };
  totalDeposited: number;
  totalEarned: number;
  totalDonated: number;
  
  // Social
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  badges: mongoose.Types.ObjectId[];
  
  // Gamification 🎮
  streak: {
    current: number;
    longest: number;
    lastCheckIn: Date;
    freezesAvailable: number;
    freezesUsed: number;
  };
  points: number;
  level: number;
  achievements: {
    badge: mongoose.Types.ObjectId;
    earnedAt: Date;
    progress?: number;
  }[];
  
  // Settings
  notificationSettings: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  
  privacySettings: {
    profilePublic: boolean;
    showStats: boolean;
  };
  
  // Security
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Metadata
  lastLogin?: Date;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    index: true,
    match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  
  // Stats
  totalChallenges: { type: Number, default: 0 },
  activeChallenges: { type: Number, default: 0 },
  completedChallenges: { type: Number, default: 0 },
  failedChallenges: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  
  // Financial
  balance: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  totalDeposited: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalDonated: { type: Number, default: 0 },
  
  // Social
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  
  // Gamification 🎮
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastCheckIn: Date,
    freezesAvailable: { type: Number, default: 0 },
    freezesUsed: { type: Number, default: 0 }
  },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [{
    badge: { type: Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now },
    progress: Number
  }],
  
  // Settings
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true }
  },
  
  privacySettings: {
    profilePublic: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true }
  },
  
  // Security
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Metadata
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance (avoid duplicating unique field indexes)
userSchema.index({ createdAt: -1 });
userSchema.index({ successRate: -1 });
userSchema.index({ totalChallenges: -1 });

// Hash password before saving
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers?.length ?? 0;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
  return this.following?.length ?? 0;
});

export default mongoose.model<IUser>('User', userSchema);
