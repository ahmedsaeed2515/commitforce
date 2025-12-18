import express from 'express';
import * as checkInController from '../controllers/checkin.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router({ mergeParams: true }); 
// mergeParams needed because we might mount on /challenges/:challengeId/checkins

router.use(protect);

router.route('/')
  .post(upload.single('image'), checkInController.createCheckIn)
  .get(checkInController.getChallengeCheckIns);

export default router;
