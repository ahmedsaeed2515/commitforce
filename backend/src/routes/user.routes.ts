import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/:username', userController.getUserProfile);

// Protected routes
router.use(protect);
router.put('/profile', upload.single('avatar'), userController.updateProfile);

export default router;
