import express from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();

// Public route
router.get('/', leaderboardController.getLeaderboard);

export default router;
