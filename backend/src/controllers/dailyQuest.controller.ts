import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as dailyQuestService from '../services/dailyQuest.service';

// Get daily quests for current user
export const getDailyQuests = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const dailyQuests = await dailyQuestService.getDailyQuests(userId);

    res.status(200).json(ApiResponse.success('Daily quests fetched', dailyQuests));
});

// Get quest type descriptions
export const getQuestDescriptions = asyncHandler(async (_req: Request, res: Response) => {
    const descriptions = dailyQuestService.getQuestDescriptions();

    res.status(200).json(ApiResponse.success('Quest descriptions', descriptions));
});
