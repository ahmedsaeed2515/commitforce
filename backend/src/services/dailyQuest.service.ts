import DailyQuest, { IDailyQuest } from '../models/DailyQuest.model';
import User from '../models/User.model';
import { emitToUser } from '../config/socket';

// Quest templates
const QUEST_TEMPLATES = [
    { type: 'like_posts' as const, target: 3, rewardPoints: 10, description: 'Like 3 posts' },
    { type: 'view_challenges' as const, target: 5, rewardPoints: 15, description: 'View 5 challenges' },
    { type: 'comment' as const, target: 2, rewardPoints: 20, description: 'Leave 2 comments' },
    { type: 'check_in' as const, target: 1, rewardPoints: 25, description: 'Complete a check-in' },
    { type: 'share' as const, target: 1, rewardPoints: 15, description: 'Share a challenge' }
];

// Get today's date at midnight
const getToday = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Get or create daily quests for a user
export const getDailyQuests = async (userId: string): Promise<IDailyQuest> => {
    const today = getToday();

    let dailyQuest = await DailyQuest.findOne({ user: userId, date: today });

    if (!dailyQuest) {
        // Select 3 random quests for the day
        const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
        const selectedQuests = shuffled.slice(0, 3).map(q => ({
            type: q.type,
            target: q.target,
            progress: 0,
            completed: false,
            rewardPoints: q.rewardPoints
        }));

        dailyQuest = await DailyQuest.create({
            user: userId,
            date: today,
            quests: selectedQuests,
            bonusReward: 50
        });
    }

    return dailyQuest;
};

// Update quest progress
export const updateQuestProgress = async (
    userId: string,
    questType: 'like_posts' | 'view_challenges' | 'comment' | 'check_in' | 'share',
    increment: number = 1
): Promise<void> => {
    const today = getToday();

    const dailyQuest = await DailyQuest.findOne({ user: userId, date: today });
    if (!dailyQuest) return;

    const quest = dailyQuest.quests.find(q => q.type === questType && !q.completed);
    if (!quest) return;

    quest.progress = Math.min(quest.progress + increment, quest.target);
    
    if (quest.progress >= quest.target && !quest.completed) {
        quest.completed = true;

        // Award points
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.points': quest.rewardPoints }
        });

        // Notify user
        emitToUser(userId, 'quest:completed', {
            quest: questType,
            reward: quest.rewardPoints
        });
    }

    // Check if all quests completed
    const allCompleted = dailyQuest.quests.every(q => q.completed);
    if (allCompleted && !dailyQuest.allCompleted) {
        dailyQuest.allCompleted = true;

        // Award bonus
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.points': dailyQuest.bonusReward }
        });

        emitToUser(userId, 'quest:all_completed', {
            bonus: dailyQuest.bonusReward
        });
    }

    await dailyQuest.save();
};

// Get quest descriptions for frontend
export const getQuestDescriptions = () => {
    return QUEST_TEMPLATES.map(q => ({
        type: q.type,
        description: q.description,
        rewardPoints: q.rewardPoints
    }));
};
