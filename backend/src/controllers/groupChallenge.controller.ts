import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as groupChallengeService from '../services/groupChallenge.service';
import Challenge from '../models/Challenge.model';

/**
 * @desc    Create Group Challenge
 * @route   POST /api/v1/challenges/group
 * @access  Private
 */
export const createGroupChallenge = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { invitedUsers, ...challengeData } = req.body;

    const challenge = await groupChallengeService.createGroupChallenge(
        userId,
        challengeData,
        invitedUsers || []
    );

    res.status(201).json(
        ApiResponse.created('Group challenge created! Invitations sent 🔥', challenge)
    );
});

/**
 * @desc    Join Group Challenge
 * @route   POST /api/v1/challenges/:id/join
 * @access  Private
 */
export const joinGroupChallenge = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const challenge = await groupChallengeService.joinGroupChallenge(id, userId);

    res.status(200).json(
        ApiResponse.success('Successfully joined the challenge! 🎯', challenge)
    );
});

/**
 * @desc    Get Group Challenge Leaderboard
 * @route   GET /api/v1/challenges/:id/leaderboard
 * @access  Public
 */
export const getGroupLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const challenge = await Challenge.findById(id)
        .populate('participants.user', 'fullName username avatar')
        .select('title participants prizePool challengeType');

    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    // Sort participants by performance
    const leaderboard = challenge.participants
        ?.filter(p => p.status === 'joined')
        .sort((a, b) => b.performance.completedCheckIns - a.performance.completedCheckIns)
        .map((p, index) => ({
            rank: index + 1,
            user: p.user,
            completedCheckIns: p.performance.completedCheckIns,
            missedCheckIns: p.performance.missedCheckIns,
            successRate: ((p.performance.completedCheckIns / (p.performance.completedCheckIns + p.performance.missedCheckIns)) * 100) || 0
        }));

    res.status(200).json(
        ApiResponse.success('Leaderboard fetched', {
            challenge: {
                title: challenge.title,
                type: challenge.challengeType,
                prizePool: challenge.prizePool
            },
            leaderboard
        })
    );
});

/**
 * @desc    Decline Group Challenge Invitation
 * @route   POST /api/v1/challenges/:id/decline
 * @access  Private
 */
export const declineInvitation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    const participant = challenge.participants?.find(p => p.user.toString() === userId);
    if (!participant) {
        res.status(404);
        throw new Error('Invitation not found');
    }

    participant.status = 'declined';
    await challenge.save();

    res.status(200).json(
        ApiResponse.success('Invitation declined', challenge)
    );
});
