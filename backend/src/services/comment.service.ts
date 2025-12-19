import Comment, { IComment } from '../models/Comment.model';
import CheckIn from '../models/CheckIn.model';
import User from '../models/User.model';
import Notification from '../models/Notification.model';
import { emitToUser } from '../config/socket';
import ApiError from '../utils/ApiError';
import mongoose from 'mongoose';

// Create a comment
export const createComment = async (
    userId: string,
    checkInId: string,
    content: string
): Promise<IComment> => {
    // Verify check-in exists
    const checkIn = await CheckIn.findById(checkInId).populate('user', 'fullName');
    if (!checkIn) {
        throw ApiError.notFound('Check-in not found');
    }

    // Extract mentions from content
    const mentionPattern = /@(\w+)/g;
    const mentionUsernames: string[] = [];
    let match;
    while ((match = mentionPattern.exec(content)) !== null) {
        mentionUsernames.push(match[1]);
    }

    // Find mentioned users
    const mentionedUsers = await User.find({
        username: { $in: mentionUsernames }
    }).select('_id');

    const comment = await Comment.create({
        user: userId,
        checkIn: checkInId,
        content,
        mentions: mentionedUsers.map(u => u._id)
    });

    // Populate user info
    await comment.populate('user', 'fullName username avatar');

    // Create notification for check-in owner (if not self)
    const checkInOwner = checkIn.user as any;
    if (checkInOwner._id.toString() !== userId) {
        await Notification.create({
            user: checkInOwner._id,
            type: 'comment',
            title: 'New Comment',
            message: `Someone commented on your check-in`
        });

        // Real-time notification
        emitToUser(checkInOwner._id.toString(), 'notification:new', {
            type: 'comment',
            message: 'Someone commented on your check-in'
        });
    }

    // Notify mentioned users
    for (const mentionedUser of mentionedUsers) {
        if (mentionedUser._id.toString() !== userId) {
            await Notification.create({
                user: mentionedUser._id,
                type: 'mention',
                title: 'You were mentioned',
                message: `You were mentioned in a comment`
            });

            emitToUser(mentionedUser._id.toString(), 'notification:new', {
                type: 'mention',
                message: 'You were mentioned in a comment'
            });
        }
    }

    return comment;
};

// Get comments for a check-in
export const getComments = async (
    checkInId: string,
    page: number = 1,
    limit: number = 20
): Promise<{ comments: IComment[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
        Comment.find({ checkIn: checkInId })
            .populate('user', 'fullName username avatar')
            .populate('mentions', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Comment.countDocuments({ checkIn: checkInId })
    ]);

    return { comments, total };
};

// Like a comment
export const likeComment = async (
    userId: string,
    commentId: string
): Promise<IComment> => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw ApiError.notFound('Comment not found');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = comment.likes.some(id => id.toString() === userId);

    if (hasLiked) {
        // Unlike
        comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
        // Like
        comment.likes.push(userObjectId);
    }

    await comment.save();
    return comment;
};

// Delete a comment
export const deleteComment = async (
    userId: string,
    commentId: string
): Promise<void> => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw ApiError.notFound('Comment not found');
    }

    if (comment.user.toString() !== userId) {
        throw ApiError.forbidden('You can only delete your own comments');
    }

    await comment.deleteOne();
};
