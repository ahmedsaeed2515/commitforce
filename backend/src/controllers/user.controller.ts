import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import User from '../models/User.model';
import * as imageService from '../services/image.service';
import Challenge from '../models/Challenge.model';

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

/**
 * @desc    Search users
 * @route   GET /api/v1/users/search
 * @access  Public
 */
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!query || query.length < 2) {
        res.status(200).json(ApiResponse.success('Search results', { users: [], total: 0 }));
        return;
    }

    const searchRegex = new RegExp(query, 'i');
    const filter = {
        $or: [
            { username: searchRegex },
            { fullName: searchRegex }
        ]
    };

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('fullName username avatar completedChallenges')
            .sort({ completedChallenges: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter)
    ]);

    res.status(200).json(ApiResponse.success('Search results', { users, total }));
});

/**
 * @desc    Get recommended friends based on similar categories
 * @route   GET /api/v1/users/recommended
 * @access  Private
 */
export const getRecommendedFriends = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get current user's challenge categories
    const userChallenges = await Challenge.find({ user: userId }).select('category');
    const userCategories = [...new Set(userChallenges.map((c) => c.category))];

    if (userCategories.length === 0) {
        res.status(200).json(ApiResponse.success('Recommended friends', []));
        return;
    }

    // Find users with similar categories
    const similarChallenges = await Challenge.find({
        user: { $ne: userId },
        category: { $in: userCategories }
    }).select('user').limit(100);

    const similarUserIds = [...new Set(similarChallenges.map((c) => c.user.toString()))];

    const recommendedUsers = await User.find({
        _id: { $in: similarUserIds.slice(0, limit) }
    }).select('fullName username avatar completedChallenges');

    res.status(200).json(ApiResponse.success('Recommended friends', recommendedUsers));
});

/**
 * @desc    Update password
 * @route   PUT /api/v1/users/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid current password');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json(ApiResponse.success('Password updated successfully'));
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users
 * @access  Private
 */
// ... (existing imports)
import CheckIn from '../models/CheckIn.model';

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users
 * @access  Private
 */
import Comment from '../models/Comment.model';
import Notification from '../models/Notification.model';
import Transaction from '../models/Transaction.model';
import Club from '../models/Club.model';

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    // 1. Delete user's challenges
    await Challenge.deleteMany({ user: userId });

    // 2. Delete check-ins
    await CheckIn.deleteMany({ user: userId });

    // 3. Delete notifications
    await Notification.deleteMany({ recipient: userId });

    // 4. Delete transactions
    await Transaction.deleteMany({ user: userId });

    // 5. Delete comments
    await Comment.deleteMany({ user: userId });

    // 6. Remove member from clubs
    await Club.updateMany(
        { members: userId },
        { $pull: { members: userId } }
    );

    // 7. Delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(ApiResponse.success('Account and related data deleted successfully'));
});

/**
 * @desc    Get user analytics
 * @route   GET /api/v1/users/analytics
 * @access  Private
 */
export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    // 1. Challenge Stats
    const challenges = await Challenge.find({ user: userId });
    const total = challenges.length;
    const completed = challenges.filter(c => c.status === 'completed').length;
    const failed = challenges.filter(c => c.status === 'failed').length;
    const active = challenges.filter(c => c.status === 'active').length;

    // 2. Monthly Activity (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyCheckIns = await CheckIn.aggregate([
        {
            $match: {
                user: userId,
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: { 
                    month: { $month: "$createdAt" }, 
                    year: { $year: "$createdAt" } 
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth(); 
    
    // Create array of last 6 months labels
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        last6Months.push({
            label: months[d.getMonth()],
            monthIdx: d.getMonth() + 1,
            year: d.getFullYear(),
            checkIns: 0
        });
    }

    // Merge DB data with labels
    monthlyCheckIns.forEach((item: any) => {
        const found = last6Months.find(m => m.monthIdx === item._id.month && m.year === item._id.year);
        if (found) {
            found.checkIns = item.count;
        }
    });

    const monthlyData = last6Months.map(m => ({
        month: m.label,
        checkIns: m.checkIns,
        completed: 0 // Placeholder or calculate if needed
    }));

    res.status(200).json(ApiResponse.success('Analytics fetched', {
        stats: { total, completed, failed, active },
        monthlyData
    }));
});
