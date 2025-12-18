import express from 'express';
import * as gamificationController from '../controllers/gamification.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/badges', gamificationController.getAllBadges);

// Protected routes
router.use(protect);

router.get('/stats', gamificationController.getGamificationStats);
router.get('/my-badges', gamificationController.getMyBadges);
router.post('/freeze/use', gamificationController.useFreeze);
router.post('/freeze/purchase', gamificationController.purchaseFreeze);

export default router;
