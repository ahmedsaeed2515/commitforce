import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as commentService from '../services/comment.service';
import * as dailyQuestService from '../services/dailyQuest.service';

// Create comment
export const createComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { checkInId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        res.status(400).json(ApiResponse.error('Comment content is required'));
        return;
    }

    const comment = await commentService.createComment(userId, checkInId, content);

    // Update daily quest progress
    await dailyQuestService.updateQuestProgress(userId, 'comment');

    res.status(201).json(ApiResponse.created('Comment added successfully', comment));
});

// Get comments for a check-in
export const getComments = asyncHandler(async (req: Request, res: Response) => {
    const { checkInId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await commentService.getComments(checkInId, page, limit);

    res.status(200).json(ApiResponse.success('Comments fetched successfully', result));
});

// Like/unlike a comment
export const likeComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { commentId } = req.params;

    const comment = await commentService.likeComment(userId, commentId);

    // Update daily quest progress for liking
    await dailyQuestService.updateQuestProgress(userId, 'like_posts');

    res.status(200).json(ApiResponse.success('Comment updated', comment));
});

// Delete comment
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { commentId } = req.params;

    await commentService.deleteComment(userId, commentId);

    res.status(200).json(ApiResponse.deleted('Comment deleted successfully'));
});
