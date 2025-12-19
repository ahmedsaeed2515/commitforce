import mongoose, { Document, Schema } from 'mongoose';

export interface IClub extends Document {
    name: string;
    description: string;
    avatar?: string;
    coverImage?: string;
    owner: mongoose.Types.ObjectId;
    admins: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
    category: string;
    isPrivate: boolean;
    totalChallengesCompleted: number;
    totalPoints: number;
    createdAt: Date;
}

const ClubSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Club name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Club name must be at least 3 characters'],
        maxlength: [50, 'Club name cannot exceed 50 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    avatar: String,
    coverImage: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        enum: ['fitness', 'reading', 'coding', 'nutrition', 'productivity', 'learning', 'other'],
        default: 'other'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    totalChallengesCompleted: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

ClubSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IClub>('Club', ClubSchema);
