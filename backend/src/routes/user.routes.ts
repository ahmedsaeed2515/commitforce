import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public specific routes
router.get('/search', userController.searchUsers);

// Specific Private routes (Must be defined before /:username)
router.get('/analytics', protect, userController.getAnalytics);

// Generic Public routes
router.get('/:username', userController.getUserProfile);

// Protected routes
router.use(protect);
router.put('/profile', upload.single('avatar'), userController.updateProfile);
router.put('/password', userController.updatePassword);
router.delete('/', userController.deleteAccount);
router.get('/friends/recommended', userController.getRecommendedFriends);

export default router;
