import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as clubService from '../services/club.service';

// Create club
export const createClub = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { name, description, category, isPrivate } = req.body;

    if (!name || name.trim().length < 3) {
        res.status(400).json(ApiResponse.error('Club name must be at least 3 characters'));
        return;
    }

    const club = await clubService.createClub(userId, {
        name,
        description,
        category,
        isPrivate
    });

    res.status(201).json(ApiResponse.created('Club created successfully', club));
});

// Get club by ID
export const getClub = asyncHandler(async (req: Request, res: Response) => {
    const { clubId } = req.params;

    const club = await clubService.getClubById(clubId);

    res.status(200).json(ApiResponse.success('Club fetched', club));
});

// Search clubs
export const searchClubs = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    const category = req.query.category as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await clubService.searchClubs(query, category, page, limit);

    res.status(200).json(ApiResponse.success('Clubs fetched', result));
});

// Join club
export const joinClub = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { clubId } = req.params;

    const club = await clubService.joinClub(userId, clubId);

    res.status(200).json(ApiResponse.success('Joined club successfully', club));
});

// Leave club
export const leaveClub = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { clubId } = req.params;

    await clubService.leaveClub(userId, clubId);

    res.status(200).json(ApiResponse.success('Left club successfully'));
});

// Get club leaderboard
export const getClubLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;

    const clubs = await clubService.getClubLeaderboard(limit);

    res.status(200).json(ApiResponse.success('Club leaderboard fetched', clubs));
});
