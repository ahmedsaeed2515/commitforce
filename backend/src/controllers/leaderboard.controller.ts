import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import User from '../models/User.model';

/**
 * @desc    Get leaderboard
 * @route   GET /api/v1/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  // Get top users based on completed challenges or total earned
  // Let's assume 'score' could be a combination, but for now use 'completedChallenges'
  const users = await User.find({ role: 'user' })
    .sort({ completedChallenges: -1, totalEarned: -1 })
    .limit(limit)
    .select('fullName username avatar completedChallenges totalEarned successRate');

  res.status(200).json(
    ApiResponse.success('Leaderboard fetched successfully', users)
  );
});
