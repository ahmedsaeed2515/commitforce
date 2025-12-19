import express from 'express';
import * as clubController from '../controllers/club.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/leaderboard', clubController.getClubLeaderboard);
router.get('/search', clubController.searchClubs);
router.get('/:clubId', clubController.getClub);

// Protected routes
router.use(protect);
router.post('/', clubController.createClub);
router.post('/:clubId/join', clubController.joinClub);
router.post('/:clubId/leave', clubController.leaveClub);

export default router;
