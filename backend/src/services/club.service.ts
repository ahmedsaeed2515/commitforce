import Club, { IClub } from '../models/Club.model';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';
import mongoose from 'mongoose';

// Create a new club
export const createClub = async (
    ownerId: string,
    data: {
        name: string;
        description?: string;
        category?: string;
        isPrivate?: boolean;
    }
): Promise<IClub> => {
    // Check if club name already exists
    const existingClub = await Club.findOne({ name: data.name });
    if (existingClub) {
        throw ApiError.badRequest('Club name already exists');
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    
    const club = await Club.create({
        ...data,
        owner: ownerObjectId,
        admins: [ownerObjectId],
        members: [ownerObjectId]
    });

    return club;
};

// Get club by ID
export const getClubById = async (clubId: string): Promise<IClub> => {
    const club = await Club.findById(clubId)
        .populate('owner', 'fullName username avatar')
        .populate('admins', 'fullName username avatar')
        .populate('members', 'fullName username avatar');

    if (!club) {
        throw ApiError.notFound('Club not found');
    }

    return club;
};

// Search clubs
export const searchClubs = async (
    query: string,
    category?: string,
    page: number = 1,
    limit: number = 20
): Promise<{ clubs: IClub[]; total: number }> => {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query) {
        filter.$or = [
            { name: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') }
        ];
    }
    if (category) {
        filter.category = category;
    }
    filter.isPrivate = false; // Only show public clubs in search

    const [clubs, total] = await Promise.all([
        Club.find(filter)
            .populate('owner', 'fullName avatar')
            .sort({ totalPoints: -1 })
            .skip(skip)
            .limit(limit),
        Club.countDocuments(filter)
    ]);

    return { clubs, total };
};

// Join a club
export const joinClub = async (userId: string, clubId: string): Promise<IClub> => {
    const club = await Club.findById(clubId);
    if (!club) {
        throw ApiError.notFound('Club not found');
    }

    if (club.isPrivate) {
        throw ApiError.forbidden('This club is private. You need an invitation.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (club.members.some(m => m.toString() === userId)) {
        throw ApiError.badRequest('You are already a member of this club');
    }

    club.members.push(userObjectId);
    await club.save();

    return club;
};

// Leave a club
export const leaveClub = async (userId: string, clubId: string): Promise<void> => {
    const club = await Club.findById(clubId);
    if (!club) {
        throw ApiError.notFound('Club not found');
    }

    if (club.owner.toString() === userId) {
        throw ApiError.badRequest('Owner cannot leave the club. Transfer ownership first.');
    }

    club.members = club.members.filter(m => m.toString() !== userId);
    club.admins = club.admins.filter(a => a.toString() !== userId);
    await club.save();
};

// Get club leaderboard
export const getClubLeaderboard = async (
    limit: number = 20
): Promise<IClub[]> => {
    return Club.find({ isPrivate: false })
        .populate('owner', 'fullName avatar')
        .sort({ totalPoints: -1, totalChallengesCompleted: -1 })
        .limit(limit);
};

// Update club stats (called when a member completes a challenge)
export const updateClubStats = async (
    clubId: string,
    pointsEarned: number
): Promise<void> => {
    await Club.findByIdAndUpdate(clubId, {
        $inc: {
            totalChallengesCompleted: 1,
            totalPoints: pointsEarned
        }
    });
};
