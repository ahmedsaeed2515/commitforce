import express from 'express';
import * as dailyQuestController from '../controllers/dailyQuest.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Daily quest routes
router.get('/', dailyQuestController.getDailyQuests);
router.get('/descriptions', dailyQuestController.getQuestDescriptions);

export default router;
