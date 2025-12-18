import CheckIn from '../models/CheckIn.model';
import Challenge from '../models/Challenge.model';
import ApiError from '../utils/ApiError';
import * as gamificationService from './gamification.service';

/**
 * Create new check-in
 */
export const createCheckIn = async (userId: string, data: any) => {
  const { challengeId, ...checkInData } = data;

  // Verify challenge exists and user is owner
  const challenge = await Challenge.findById(challengeId);
  
  if (!challenge) {
    throw ApiError.notFound('Challenge not found');
  }

  if (challenge.user.toString() !== userId) {
    throw ApiError.forbidden('You can only check-in to your own challenges');
  }

  if (challenge.status !== 'active') {
    throw ApiError.badRequest('Challenge must be active to check-in');
  }

  const checkIn = await CheckIn.create({
    challenge: challengeId,
    user: userId,
    ...checkInData,
    photos: checkInData.imageUrl ? [checkInData.imageUrl] : []
  });

  // Update user streak 🔥
  try {
    await gamificationService.updateStreak(userId);
  } catch (error) {
    console.error('Failed to update streak:', error);
  }

  return checkIn;
};

/**
 * Get check-ins for a challenge
 */
export const getChallengeCheckIns = async (challengeId: string) => {
  const checkIns = await CheckIn.find({ challenge: challengeId })
    .sort({ date: -1 })
    .populate('user', 'fullName avatar');
    
  return checkIns;
};
