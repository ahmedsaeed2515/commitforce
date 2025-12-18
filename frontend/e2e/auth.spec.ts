import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should register a new user', async ({ page }) => {
        await page.goto('/register');

        // Fill registration form
        await page.fill('input[name="fullName"]', 'Test User');
        await page.fill('input[name="username"]', 'testuser123');
        await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
        await page.fill('input[name="password"]', 'Password123!');

        // Submit form
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/dashboard');
        
        // Should see welcome message or user name
        await expect(page.locator('text=Test User')).toBeVisible();
    });

    test('should login existing user', async ({ page }) => {
        await page.goto('/login');

        // Fill login form
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password123');

        // Submit
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/dashboard');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="email"]', 'wrong@example.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('text=/invalid|error/i')).toBeVisible();
    });

    test('should logout user', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for dashboard
        await page.waitForURL('/dashboard');

        // Click logout
        await page.click('button:has-text("Logout")');

        // Should redirect to home
        await expect(page).toHaveURL('/');
    });
});
