import Challenge from '../models/Challenge.model';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';


/**
 * Create new challenge
 */
export const createChallenge = async (userId: string, data: any) => {
  // Validate dates
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  
  if (endDate <= startDate) {
    throw ApiError.badRequest('End date must be after start date');
  }

  // Check if user has active challenges limit (e.g. 5)
  const activeChallenges = await Challenge.countDocuments({
    user: userId,
    status: 'active'
  });

  if (activeChallenges >= 5) {
    throw ApiError.badRequest('You cannot have more than 5 active challenges');
  }
  
  // Create challenge
  const challenge = await Challenge.create({
    ...data,
    user: userId,
    status: data.deposit?.paid ? 'active' : 'draft' // Simplified status logic
  });
  
  // Update user stats
  await User.findByIdAndUpdate(userId, {
    $inc: { totalChallenges: 1 }
  });
  
  return challenge;
};

/**
 * Get user challenges with filters
 */
export const getUserChallenges = async (userId: string, filters: { status?: string; category?: string }) => {
  const query: any = { user: userId };
  
  if (filters.status && filters.status !== 'all') {
    query.status = filters.status;
  }
  
  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }
  
  const challenges = await Challenge.find(query)
    .sort({ createdAt: -1 })
    .populate('charity.id', 'name logo');
    
  return challenges;
};

/**
 * Get challenge by ID with security check
 */
export const getChallengeById = async (challengeId: string, userId?: string) => {
  const challenge = await Challenge.findById(challengeId)
    .populate('user', 'username fullName avatar')
    .populate('charity.id', 'name logo');
  
  if (!challenge) {
    throw ApiError.notFound('Challenge not found');
  }

  // If trying to view a draft challenge that is not yours
  if (challenge.status === 'draft' && challenge.user.id.toString() !== userId) {
    throw ApiError.notFound('Challenge not found');
  }
  
  // Increment view count if viewed by others
  if (userId && challenge.user.id.toString() !== userId) {
    challenge.views += 1;
    await challenge.save();
  }
  
  return challenge;
};

/**
 * Update challenge
 */
export const updateChallenge = async (
  challengeId: string, 
  userId: string, 
  updates: any
) => {
  const challenge = await Challenge.findOne({ _id: challengeId, user: userId });
  
  if (!challenge) {
    throw ApiError.notFound('Challenge not found or unauthorized');
  }
  
  // Rules for updating
  if (challenge.status === 'active') {
    // Only allow updating non-critical fields
    const allowedUpdates = ['title', 'description', 'coverImage', 'tags'];
    const updateKeys = Object.keys(updates);
    const hasDisallowedUpdates = updateKeys.some(key => !allowedUpdates.includes(key));
    
    if (hasDisallowedUpdates) {
      throw ApiError.badRequest('Cannot update critical settings of an active challenge');
    }
  }
  
  Object.assign(challenge, updates);
  await challenge.save();
  
  return challenge;
};

/**
 * Delete challenge
 */
export const deleteChallenge = async (challengeId: string, userId: string) => {
  const challenge = await Challenge.findOne({ _id: challengeId, user: userId });
  
  if (!challenge) {
    throw ApiError.notFound('Challenge not found or unauthorized');
  }
  
  if (challenge.status === 'active' || challenge.status === 'completed') {
    throw ApiError.badRequest('Cannot delete active or completed challenge');
  }
  
  await challenge.deleteOne();
  
  // Decrement user stats
  await User.findByIdAndUpdate(userId, {
    $inc: { totalChallenges: -1 }
  });
};
