import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import CheckIn from '../models/CheckIn.model';
import ApiError from '../utils/ApiError';

/**
 * @desc    Get pending check-ins for verification
 * @route   GET /api/v1/verifications/pending
 * @access  Private (Admin/Moderator)
 */
export const getPendingCheckIns = asyncHandler(async (req: Request, res: Response) => {
  // In a real app, you might restrict this to admin users
  // const userId = req.user!._id.toString();
  
  const checkIns = await CheckIn.find({ status: 'pending' })
    .populate('user', 'firstName lastName fullName avatar username')
    .populate('challenge', 'title')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(
    ApiResponse.success('Pending check-ins fetched successfully', checkIns)
  );
});

/**
 * @desc    Verify a check-in
 * @route   POST /api/v1/verifications/:id
 * @access  Private (Admin/Moderator)
 */
export const verifyCheckIn = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const userId = req.user!._id;

  if (!['approved', 'rejected'].includes(status)) {
    throw ApiError.badRequest('Invalid status. Must be approved or rejected');
  }

  const checkIn = await CheckIn.findById(id);

  if (!checkIn) {
    throw ApiError.notFound('Check-in not found');
  }

  checkIn.status = status;
  checkIn.verifiedBy = userId;
  checkIn.verifiedAt = new Date();
  
  if (notes) {
    checkIn.note = (checkIn.note || '') + `\n\n[Admin Note]: ${notes}`;
  }

  if (status === 'approved') {
    checkIn.verified = true;
    // todo: Update challenge progress or streak here if needed
  } else {
    checkIn.verified = false;
  }

  await checkIn.save();

  res.status(200).json(
    ApiResponse.success(`Check-in ${status} successfully`, checkIn)
  );
});
