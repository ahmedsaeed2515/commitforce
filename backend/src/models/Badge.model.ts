import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
    name: string;
    description: string;
    icon: string;
    category: 'streak' | 'achievement' | 'social' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    criteria: {
        type: 'streak_days' | 'challenges_completed' | 'early_bird' | 'weekend_warrior' | 'perfect_week' | 'social_butterfly' | 'custom';
        value?: number;
        customLogic?: string;
    };
    reward?: {
        points?: number;
        freezeTokens?: number;
    };
    active: boolean;
}

const badgeSchema = new Schema<IBadge>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Emoji or URL
    category: {
        type: String,
        enum: ['streak', 'achievement', 'social', 'special'],
        required: true
    },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    criteria: {
        type: {
            type: String,
            enum: ['streak_days', 'challenges_completed', 'early_bird', 'weekend_warrior', 'perfect_week', 'social_butterfly', 'custom'],
            required: true
        },
        value: Number,
        customLogic: String
    },
    reward: {
        points: { type: Number, default: 0 },
        freezeTokens: { type: Number, default: 0 }
    },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<IBadge>('Badge', badgeSchema);
