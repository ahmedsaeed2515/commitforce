import User from '../models/User.model';
import Badge from '../models/Badge.model';
import CheckIn from '../models/CheckIn.model';
import { emitToUser } from '../config/socket';

/**
 * Update user streak after check-in
 */
export const updateStreak = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const now = new Date();
    const lastCheckIn = user.streak?.lastCheckIn;

    if (!lastCheckIn) {
        // First check-in ever
        user.streak = {
            current: 1,
            longest: 1,
            lastCheckIn: now,
            freezesAvailable: user.streak?.freezesAvailable || 0,
            freezesUsed: user.streak?.freezesUsed || 0
        };
    } else {
        const hoursSinceLastCheckIn = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastCheckIn < 24) {
            // Same day - no change
            return user;
        } else if (hoursSinceLastCheckIn < 48) {
            // Next day - increment streak
            user.streak.current += 1;
            user.streak.lastCheckIn = now;

            // Update longest if needed
            if (user.streak.current > user.streak.longest) {
                user.streak.longest = user.streak.current;
            }

            // Award freeze tokens at milestones
            if (user.streak.current % 7 === 0) {
                user.streak.freezesAvailable += 1;
                console.log(`🎁 User ${userId} earned a freeze token! (${user.streak.current} day streak)`);
            }
        } else {
            // Streak broken - reset
            console.log(`💔 Streak broken for user ${userId}`);
            user.streak.current = 1;
            user.streak.lastCheckIn = now;
        }
    }

    await user.save();
    
    // Check for streak badges
    await checkAndAwardBadges(userId);
    
    return user;
};

/**
 * Use a streak freeze
 */
export const useStreakFreeze = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!user.streak || user.streak.freezesAvailable <= 0) {
        throw new Error('No freeze tokens available');
    }

    const now = new Date();
    const lastCheckIn = user.streak.lastCheckIn;

    if (!lastCheckIn) {
        throw new Error('No active streak to freeze');
    }

    const hoursSinceLastCheckIn = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastCheckIn < 48) {
        throw new Error('Streak is not in danger yet');
    }

    // Use freeze
    user.streak.freezesAvailable -= 1;
    user.streak.freezesUsed += 1;
    user.streak.lastCheckIn = now; // Extend the streak

    await user.save();

    return {
        success: true,
        message: 'Streak frozen! Your streak is safe 🧊',
        freezesRemaining: user.streak.freezesAvailable
    };
};

/**
 * Purchase streak freeze with points or money
 */
export const purchaseStreakFreeze = async (userId: string, paymentMethod: 'points' | 'money') => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const FREEZE_COST_POINTS = 100;
    const FREEZE_COST_MONEY = 2; // $2

    if (paymentMethod === 'points') {
        if (user.points < FREEZE_COST_POINTS) {
            throw new Error(`Insufficient points. Need ${FREEZE_COST_POINTS}, have ${user.points}`);
        }
        user.points -= FREEZE_COST_POINTS;
    } else {
        if (user.balance.amount < FREEZE_COST_MONEY) {
            throw new Error(`Insufficient balance. Need $${FREEZE_COST_MONEY}`);
        }
        user.balance.amount -= FREEZE_COST_MONEY;
    }

    user.streak.freezesAvailable += 1;
    await user.save();

    return {
        success: true,
        message: 'Freeze token purchased! 🎟️',
        freezesAvailable: user.streak.freezesAvailable
    };
};

/**
 * Check and award badges based on user activity
 */
export const checkAndAwardBadges = async (userId: string) => {
    const user = await User.findById(userId).populate('achievements.badge');
    if (!user) return;

    const badges = await Badge.find({ active: true });
    const newBadges: any[] = [];

    for (const badge of badges) {
        // Check if already earned
        const alreadyEarned = user.achievements?.some(
            a => a.badge.toString() === badge._id.toString()
        );

        if (alreadyEarned) continue;

        let earned = false;

        switch (badge.criteria.type) {
            case 'streak_days':
                if (user.streak?.current >= (badge.criteria.value || 0)) {
                    earned = true;
                }
                break;

            case 'challenges_completed':
                if (user.completedChallenges >= (badge.criteria.value || 0)) {
                    earned = true;
                }
                break;

            case 'early_bird':
                // Check if last check-in was before 6 AM
                const lastCheckIn = await CheckIn.findOne({ user: userId })
                    .sort({ createdAt: -1 });
                if (lastCheckIn) {
                    const hour = new Date(lastCheckIn.createdAt).getHours();
                    if (hour >= 4 && hour < 6) {
                        earned = true;
                    }
                }
                break;

            case 'weekend_warrior':
                // Check if user has check-ins on both Saturday and Sunday
                const weekendCheckIns = await CheckIn.find({
                    user: userId,
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                });
                const hasSaturday = weekendCheckIns.some(c => new Date(c.createdAt).getDay() === 6);
                const hasSunday = weekendCheckIns.some(c => new Date(c.createdAt).getDay() === 0);
                if (hasSaturday && hasSunday) {
                    earned = true;
                }
                break;

            case 'perfect_week':
                // 7 consecutive days
                if (user.streak?.current >= 7) {
                    earned = true;
                }
                break;
        }

        if (earned) {
            user.achievements?.push({
                badge: badge._id,
                earnedAt: new Date(),
                progress: 100
            });

            // Award rewards
            if (badge.reward?.points) {
                user.points += badge.reward.points;
            }
            if (badge.reward?.freezeTokens) {
                user.streak.freezesAvailable += badge.reward.freezeTokens;
            }

            newBadges.push(badge);
            console.log(`🏆 User ${userId} earned badge: ${badge.name}`);
        }
    }

    if (newBadges.length > 0) {
        await user.save();
        
        // 🔔 Send real-time notification for each badge
        try {
            for (const badge of newBadges) {
                emitToUser(userId, 'badge:earned', {
                    badge: {
                        name: badge.name,
                        description: badge.description,
                        icon: badge.icon,
                        rarity: badge.rarity
                    },
                    rewards: badge.reward
                });
            }
        } catch (error) {
            console.error('Failed to emit badge notification:', error);
        }
    }

    return newBadges;
};

/**
 * Initialize default badges (run once on server start)
 */
export const initializeDefaultBadges = async () => {
    const defaultBadges = [
        {
            name: 'First Step',
            description: 'Complete your first check-in',
            icon: '👣',
            category: 'achievement',
            rarity: 'common',
            criteria: { type: 'streak_days', value: 1 },
            reward: { points: 10 }
        },
        {
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            category: 'streak',
            rarity: 'common',
            criteria: { type: 'perfect_week' },
            reward: { points: 50, freezeTokens: 1 }
        },
        {
            name: 'Unstoppable',
            description: 'Maintain a 30-day streak',
            icon: '💪',
            category: 'streak',
            rarity: 'rare',
            criteria: { type: 'streak_days', value: 30 },
            reward: { points: 200, freezeTokens: 2 }
        },
        {
            name: 'Century Club',
            description: 'Maintain a 100-day streak',
            icon: '👑',
            category: 'streak',
            rarity: 'epic',
            criteria: { type: 'streak_days', value: 100 },
            reward: { points: 1000, freezeTokens: 5 }
        },
        {
            name: 'Early Bird',
            description: 'Check in before 6 AM',
            icon: '🌅',
            category: 'special',
            rarity: 'rare',
            criteria: { type: 'early_bird' },
            reward: { points: 30 }
        },
        {
            name: 'Weekend Warrior',
            description: 'Check in on both weekend days',
            icon: '⚔️',
            category: 'special',
            rarity: 'rare',
            criteria: { type: 'weekend_warrior' },
            reward: { points: 40 }
        },
        {
            name: 'Champion',
            description: 'Complete 10 challenges',
            icon: '🏆',
            category: 'achievement',
            rarity: 'epic',
            criteria: { type: 'challenges_completed', value: 10 },
            reward: { points: 500, freezeTokens: 3 }
        }
    ];

    for (const badgeData of defaultBadges) {
        await Badge.findOneAndUpdate(
            { name: badgeData.name },
            badgeData,
            { upsert: true, new: true }
        );
    }

    console.log('✅ Default badges initialized');
};
