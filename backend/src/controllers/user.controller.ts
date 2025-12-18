import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import User from '../models/User.model';
import * as imageService from '../services/image.service';

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { fullName, bio, username } = req.body;

  let updateData: any = { fullName, bio, username };

  // Handle avatar upload
  if (req.file) {
    const avatarUrl = await imageService.uploadImage(req.file.buffer, 'avatars');
    updateData.avatar = avatarUrl;
  }

  // Remove undefined fields
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json(
    ApiResponse.success('Profile updated successfully', user)
  );
});

/**
 * @desc    Get user profile (public)
 * @route   GET /api/v1/users/:username
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.params.username })
        .select('-password -email -version -date -balance'); // Hide sensitive info for public view
        
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(
        ApiResponse.success('User profile fetched', user)
    );
});
