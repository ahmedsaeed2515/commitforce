import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyQuest extends Document {
    user: mongoose.Types.ObjectId;
    date: Date;
    quests: {
        type: 'like_posts' | 'view_challenges' | 'comment' | 'check_in' | 'share';
        target: number;
        progress: number;
        completed: boolean;
        rewardPoints: number;
    }[];
    allCompleted: boolean;
    bonusReward: number;
}

const DailyQuestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    quests: [{
        type: {
            type: String,
            enum: ['like_posts', 'view_challenges', 'comment', 'check_in', 'share'],
            required: true
        },
        target: {
            type: Number,
            required: true,
            min: 1
        },
        progress: {
            type: Number,
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        },
        rewardPoints: {
            type: Number,
            default: 10
        }
    }],
    allCompleted: {
        type: Boolean,
        default: false
    },
    bonusReward: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

// Compound index for efficient lookups
DailyQuestSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyQuest>('DailyQuest', DailyQuestSchema);
