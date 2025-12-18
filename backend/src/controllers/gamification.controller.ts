import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as gamificationService from '../services/gamification.service';
import User from '../models/User.model';
import Badge from '../models/Badge.model';

/**
 * @desc    Get user gamification stats
 * @route   GET /api/v1/gamification/stats
 * @access  Private
 */
export const getGamificationStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    
    const user = await User.findById(userId)
        .populate('achievements.badge')
        .select('streak points level achievements');

    res.status(200).json(
        ApiResponse.success('Gamification stats fetched', user)
    );
});

/**
 * @desc    Use streak freeze
 * @route   POST /api/v1/gamification/freeze/use
 * @access  Private
 */
export const useFreeze = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    
    const result = await gamificationService.useStreakFreeze(userId);

    res.status(200).json(
        ApiResponse.success(result.message, result)
    );
});

/**
 * @desc    Purchase streak freeze
 * @route   POST /api/v1/gamification/freeze/purchase
 * @access  Private
 */
export const purchaseFreeze = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { paymentMethod } = req.body; // 'points' or 'money'

    if (!['points', 'money'].includes(paymentMethod)) {
        res.status(400);
        throw new Error('Invalid payment method');
    }

    const result = await gamificationService.purchaseStreakFreeze(userId, paymentMethod);

    res.status(200).json(
        ApiResponse.success(result.message, result)
    );
});

/**
 * @desc    Get all available badges
 * @route   GET /api/v1/gamification/badges
 * @access  Public
 */
export const getAllBadges = asyncHandler(async (req: Request, res: Response) => {
    const badges = await Badge.find({ active: true }).sort({ rarity: 1, name: 1 });

    res.status(200).json(
        ApiResponse.success('Badges fetched', badges)
    );
});

/**
 * @desc    Get user badges
 * @route   GET /api/v1/gamification/my-badges
 * @access  Private
 */
export const getMyBadges = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    
    const user = await User.findById(userId)
        .populate('achievements.badge')
        .select('achievements');

    res.status(200).json(
        ApiResponse.success('Your badges fetched', user?.achievements || [])
    );
});
