import express from 'express';
import * as groupChallengeController from '../controllers/groupChallenge.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/group', groupChallengeController.createGroupChallenge);
router.post('/:id/join', groupChallengeController.joinGroupChallenge);
router.post('/:id/decline', groupChallengeController.declineInvitation);
router.get('/:id/leaderboard', groupChallengeController.getGroupLeaderboard);

export default router;
