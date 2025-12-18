import { describe, it, expect, beforeEach } from 'vitest';
import User from '../../models/User.model';
import * as gamificationService from '../../services/gamification.service';

describe('Gamification Service', () => {
    let testUser: any;

    beforeEach(async () => {
        // Create test user
        testUser = await User.create({
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser',
            fullName: 'Test User',
            streak: {
                current: 0,
                longest: 0,
                freezesAvailable: 0,
                freezesUsed: 0
            },
            points: 0,
            level: 1
        });
    });

    describe('updateStreak', () => {
        it('should initialize streak on first check-in', async () => {
            const result = await gamificationService.updateStreak(testUser._id.toString());
            
            expect(result.streak.current).toBe(1);
            expect(result.streak.longest).toBe(1);
        });

        it('should increment streak on consecutive days', async () => {
            // First check-in
            await gamificationService.updateStreak(testUser._id.toString());
            
            // Simulate next day (24+ hours later)
            const user = await User.findById(testUser._id);
            if (user) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                user.streak.lastCheckIn = yesterday;
                await user.save();
            }
            
            // Second check-in
            const result = await gamificationService.updateStreak(testUser._id.toString());
            expect(result.streak.current).toBe(2);
        });

        it('should award freeze token at 7-day milestone', async () => {
            const user = await User.findById(testUser._id);
            if (user) {
                user.streak.current = 6;
                user.streak.lastCheckIn = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
                await user.save();
            }
            
            const result = await gamificationService.updateStreak(testUser._id.toString());
            expect(result.streak.current).toBe(7);
            expect(result.streak.freezesAvailable).toBe(1);
        });
    });

    describe('purchaseStreakFreeze', () => {
        it('should purchase freeze with points', async () => {
            const user = await User.findById(testUser._id);
            if (user) {
                user.points = 150;
                await user.save();
            }

            const result = await gamificationService.purchaseStreakFreeze(
                testUser._id.toString(),
                'points'
            );

            expect(result.success).toBe(true);
            expect(result.freezesAvailable).toBe(1);

            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser?.points).toBe(50); // 150 - 100
        });

        it('should fail if insufficient points', async () => {
            await expect(
                gamificationService.purchaseStreakFreeze(testUser._id.toString(), 'points')
            ).rejects.toThrow('Insufficient points');
        });
    });

    describe('useStreakFreeze', () => {
        it('should use freeze to save streak', async () => {
            const user = await User.findById(testUser._id);
            if (user) {
                user.streak.current = 5;
                user.streak.freezesAvailable = 1;
                user.streak.lastCheckIn = new Date(Date.now() - 50 * 60 * 60 * 1000); // 50 hours ago (danger!)
                await user.save();
            }

            const result = await gamificationService.useStreakFreeze(testUser._id.toString());
            
            expect(result.success).toBe(true);
            expect(result.freezesRemaining).toBe(0);

            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser?.streak.freezesUsed).toBe(1);
        });

        it('should fail if no freezes available', async () => {
            const user = await User.findById(testUser._id);
            if (user) {
                user.streak.lastCheckIn = new Date(Date.now() - 50 * 60 * 60 * 1000);
                await user.save();
            }

            await expect(
                gamificationService.useStreakFreeze(testUser._id.toString())
            ).rejects.toThrow('No freeze tokens available');
        });
    });
});
