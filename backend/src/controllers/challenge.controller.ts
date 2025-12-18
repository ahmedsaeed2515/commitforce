import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as challengeService from '../services/challenge.service';
import * as imageService from '../services/image.service';

/**
 * @desc    Create new challenge
 * @route   POST /api/v1/challenges
 * @access  Private
 */
export const createChallenge = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  let challengeData = req.body;

  // Handle image upload
  if (req.file) {
    const imageUrl = await imageService.uploadImage(req.file.buffer, 'challenges');
    challengeData.coverImage = imageUrl;
  }

  // Parse numeric fields if they come as strings (from FormData)
  if (typeof challengeData.deposit === 'string') {
    try {
      challengeData.deposit = JSON.parse(challengeData.deposit);
    } catch (e) {
      // Keep as is or handle error
    }
  }

  const challenge = await challengeService.createChallenge(userId, challengeData);

  res.status(201).json(
    ApiResponse.created('Challenge created successfully', challenge)
  );
});

/**
 * @desc    Get user challenges
 * @route   GET /api/v1/challenges
 * @access  Private
 */
export const getUserChallenges = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const filters = {
    status: req.query.status as string,
    category: req.query.category as string,
  };

  const challenges = await challengeService.getUserChallenges(userId, filters);

  res.status(200).json(
    ApiResponse.success('Challenges fetched successfully', challenges)
  );
});

/**
 * @desc    Get single challenge
 * @route   GET /api/v1/challenges/:id
 * @access  Private
 */
export const getChallenge = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const challenge = await challengeService.getChallengeById(req.params.id, userId);

  res.status(200).json(
    ApiResponse.success('Challenge fetched successfully', challenge)
  );
});

/**
 * @desc    Update challenge
 * @route   PUT /api/v1/challenges/:id
 * @access  Private
 */
export const updateChallenge = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;
  let updates = req.body;

  // Handle image upload
  if (req.file) {
    const imageUrl = await imageService.uploadImage(req.file.buffer, 'challenges');
    updates.coverImage = imageUrl;
  }

   // Parse numeric fields if needed
   if (typeof updates.deposit === 'string') {
    try {
      updates.deposit = JSON.parse(updates.deposit);
    } catch (e) {
      // Ignore
    }
  }

  const challenge = await challengeService.updateChallenge(id, userId, updates);

  res.status(200).json(
    ApiResponse.success('Challenge updated successfully', challenge)
  );
});

/**
 * @desc    Delete challenge
 * @route   DELETE /api/v1/challenges/:id
 * @access  Private
 */
export const deleteChallenge = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  await challengeService.deleteChallenge(id, userId);

  res.status(200).json(
    ApiResponse.success('Challenge deleted successfully')
  );
});
