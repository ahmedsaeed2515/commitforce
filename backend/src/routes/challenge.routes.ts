import express from 'express';
import * as challengeController from '../controllers/challenge.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import checkInRoutes from './checkin.routes';

const router = express.Router();

// Mount checkin routes (e.g. /api/v1/challenges/:challengeId/checkins)
router.use('/:challengeId/checkins', checkInRoutes);

// All routes require authentication
router.use(protect);

router.route('/')
  .post(upload.single('coverImage'), challengeController.createChallenge)
  .get(challengeController.getUserChallenges);

router.route('/:id')
  .get(challengeController.getChallenge)
  .put(upload.single('coverImage'), challengeController.updateChallenge)
  .delete(challengeController.deleteChallenge);

export default router;
