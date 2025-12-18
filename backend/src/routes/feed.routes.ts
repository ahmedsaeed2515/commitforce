import express from 'express';
import * as feedController from '../controllers/feed.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', feedController.getFeed);

router.post('/:checkInId/like', protect, feedController.toggleLike);

export default router;
