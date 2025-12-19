import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    checkIn: mongoose.Types.ObjectId;
    content: string;
    mentions: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    checkIn: {
        type: Schema.Types.ObjectId,
        ref: 'CheckIn',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        minlength: [1, 'Comment cannot be empty'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema);
