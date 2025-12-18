import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import CheckIn from '../models/CheckIn.model';

/**
 * @desc    Get public feed (latest verified check-ins)
 * @route   GET /api/v1/feed
 * @access  Public (or Private)
 */
export const getFeed = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Fetch verified check-ins and populate needed data
  const checkIns = await CheckIn.find({ 
      verified: true 
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'fullName avatar username')
    .populate('challenge', 'title category');

  const total = await CheckIn.countDocuments({ verified: true });

  res.status(200).json(
    ApiResponse.success('Feed fetched successfully', {
        checkIns,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    })
  );
});

/**
 * @desc    Toggle like on a check-in
 * @route   POST /api/v1/feed/:checkInId/like
 * @access  Private
 */
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { checkInId } = req.params;

    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) {
        res.status(404);
        throw new Error('Check-in not found');
    }

    // Check if already liked
    const index = checkIn.likes.indexOf(userId);
    if (index === -1) {
        // Not liked -> Like
        checkIn.likes.push(userId);
    } else {
        // Liked -> Unlike
        checkIn.likes.splice(index, 1);
    }

    await checkIn.save();

    res.status(200).json(
        ApiResponse.success('Like toggled', { likes: checkIn.likes })
    );
});
