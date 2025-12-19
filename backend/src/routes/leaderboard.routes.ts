import express from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();

// Public routes
router.get('/', leaderboardController.getLeaderboard);
router.get('/streaks', leaderboardController.getStreakLeaderboard);
router.get('/points', leaderboardController.getPointsLeaderboard);

export default router;
