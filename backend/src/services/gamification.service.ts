import User from '../models/User.model';
import ApiError from '../utils/ApiError';

export const updateStreak = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    const lastCheckIn = user.streak.lastCheckIn ? new Date(user.streak.lastCheckIn) : null;
    
    // Normalize to midnight for date comparison
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    if (lastCheckIn) {
        const lastCheckInMidnight = new Date(lastCheckIn);
        lastCheckInMidnight.setHours(0, 0, 0, 0);
        
        const diffTime = todayMidnight.getTime() - lastCheckInMidnight.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already checked in today, do nothing regarding streak
            return; 
        } else if (diffDays === 1) {
            // Consecutive day
            user.streak.current += 1;
        } else {
            // Missed one or more days
            // Here we could implement auto-freeze usage logic provided checking 'freezesAvailable'
            // For now, reset to 1
            user.streak.current = 1;
        }
    } else {
        // First check-in ever
        user.streak.current = 1;
    }

    user.streak.lastCheckIn = today;
    if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
    }

    // Award points for daily check-in
    user.points += 10; 

    await user.save();
};

export const useStreakFreeze = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    if (user.streak.freezesAvailable <= 0) {
        throw ApiError.badRequest('No streak freezes available');
    }

    // Decrement available freezes
    user.streak.freezesAvailable -= 1;
    user.streak.freezesUsed += 1;
    
    // Logic to "repair" streak could go here if we tracked missed days history
    // For now, we just consume the item as requested
    
    await user.save();

    return { message: 'Streak freeze used successfully', streak: user.streak };
};

export const purchaseStreakFreeze = async (userId: string, paymentMethod: string) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const FREEZE_COST_POINTS = 500;
    const FREEZE_COST_MONEY = 5;

    if (paymentMethod === 'points') {
        if (user.points < FREEZE_COST_POINTS) {
            throw ApiError.badRequest('Insufficient points');
        }
        user.points -= FREEZE_COST_POINTS;
    } else if (paymentMethod === 'money') {
        if (user.balance.amount < FREEZE_COST_MONEY) {
             throw ApiError.badRequest('Insufficient balance');
        }
        user.balance.amount -= FREEZE_COST_MONEY;
    } else {
        throw ApiError.badRequest('Invalid payment method');
    }

    user.streak.freezesAvailable += 1;
    await user.save();

    return { message: 'Streak freeze purchased', freezesAvailable: user.streak.freezesAvailable };
};
