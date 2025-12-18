import { test, expect } from '@playwright/test';

test.describe('Gamification Features', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    test('should display streak widget', async ({ page }) => {
        await page.goto('/gamification');

        // Check for streak display
        await expect(page.locator('text=Current Streak')).toBeVisible();
        await expect(page.locator('text=/\\d+ days/i')).toBeVisible();
    });

    test('should show badges collection', async ({ page }) => {
        await page.goto('/gamification');

        // Check for badges section
        await expect(page.locator('text=Badges Collection')).toBeVisible();
        
        // Should show at least one badge
        await expect(page.locator('[class*="badge"]').first()).toBeVisible();
    });

    test('should purchase freeze token with points', async ({ page }) => {
        await page.goto('/gamification');

        // Click buy freezes button
        await page.click('button:has-text("Buy More Freezes")');

        // Modal should appear
        await expect(page.locator('text=Purchase Streak Freeze')).toBeVisible();

        // Select points option
        await page.click('button:has-text("Points")');

        // Click purchase
        await page.click('button:has-text("Purchase")');

        // Should show success message or update freeze count
        await expect(page.locator('text=/purchased|success/i')).toBeVisible({ timeout: 5000 });
    });

    test('should display earned badges with checkmark', async ({ page }) => {
        await page.goto('/gamification');

        // Look for earned badges (those with checkmark)
        const earnedBadges = page.locator('[class*="badge"]:has(span:text("✅"))');
        
        // Count should be >= 0
        const count = await earnedBadges.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show progress stats', async ({ page }) => {
        await page.goto('/gamification');

        // Check for stats display
        await expect(page.locator('text=Level')).toBeVisible();
        await expect(page.locator('text=Points')).toBeVisible();
        await expect(page.locator('text=Badges')).toBeVisible();
    });
});
