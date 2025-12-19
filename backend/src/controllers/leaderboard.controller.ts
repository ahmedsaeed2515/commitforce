import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import User from '../models/User.model';

/**
 * @desc    Get general leaderboard (defaults to points)
 * @route   GET /api/v1/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ isActive: true })
        .sort({ points: -1 })
        .limit(10)
        .select('username fullName avatar points level streak');
    
    res.status(200).json(ApiResponse.success('Leaderboard fetched', users));
});

/**
 * @desc    Get streak leaderboard
 * @route   GET /api/v1/leaderboard/streaks
 * @access  Public
 */
export const getStreakLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ isActive: true })
        .sort({ 'streak.current': -1 })
        .limit(10)
        .select('username fullName avatar points level streak');
    
    res.status(200).json(ApiResponse.success('Streak leaderboard fetched', users));
});

/**
 * @desc    Get points leaderboard
 * @route   GET /api/v1/leaderboard/points
 * @access  Public
 */
export const getPointsLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ isActive: true })
        .sort({ points: -1 })
        .limit(10)
        .select('username fullName avatar points level streak');
    
    res.status(200).json(ApiResponse.success('Points leaderboard fetched', users));
});
