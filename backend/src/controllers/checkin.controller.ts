import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as checkInService from '../services/checkin.service';
import * as imageService from '../services/image.service';

/**
 * @desc    Create check-in
 * @route   POST /api/v1/checkins
 * @access  Private
 */
import * as aiService from '../services/ai.service';
import Challenge from '../models/Challenge.model';

export const createCheckIn = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  let checkInData = req.body;

  // Handle image upload
  if (req.file) {
    const imageUrl = await imageService.uploadImage(req.file.buffer, 'checkins');
    checkInData.imageUrl = imageUrl;

    // --- Advanced AI Verification ---
    const challenge = await Challenge.findById(checkInData.challengeId);
    if (challenge) {
        const aiResult = await aiService.analyzeImage(imageUrl, challenge.category);
        
        console.log('🧠 AI Result:', aiResult);

        // 1. Safety Check (Reject Immediately)
        if (!aiResult.isSafe) {
             res.status(400);
             throw new Error('Image rejected: Contains inappropriate content.');
        }

        // 2. Anti-Cheat Warning
        let adminNote = '';
        if (!aiResult.isOriginal) {
             adminNote += ' [⚠️ ALERT: Potential Web Image/Stolen]';
        }

        // 3. Auto-Verification Logic
        if (aiResult.verified) {
             checkInData.verified = true;
             checkInData.verifiedAt = new Date();
             checkInData.note = (checkInData.note || '') + `\n\n🤖 AI Verification Passed (${aiResult.confidence}% confidence).\nContext: ${aiResult.reason}`;
        } else {
             checkInData.verified = false;
             checkInData.note = (checkInData.note || '') + `\n\n🤖 AI Review Pending (${aiResult.confidence}% confidence).\nReason: ${aiResult.reason}${adminNote}`;
        }
    }
  }

  const checkIn = await checkInService.createCheckIn(userId, checkInData);

  res.status(201).json(
    ApiResponse.created(
        (checkIn as any).verified ? 'Check-in verified instantly by AI! 🎉' : 'Check-in submitted for manual review 🕒', 
        checkIn
    )
  );
});

/**
 * @desc    Get check-ins for a challenge
 * @route   GET /api/v1/challenges/:challengeId/checkins
 * @access  Private
 */
export const getChallengeCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const { challengeId } = req.params;
  const checkIns = await checkInService.getChallengeCheckIns(challengeId);

  res.status(200).json(
    ApiResponse.success('Check-ins fetched successfully', checkIns)
  );
});
