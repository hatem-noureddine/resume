import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
    test('should toggle between light and dark themes', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to fully hydrate
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Get initial theme state
        const html = page.locator('html');
        const initialClass = await html.getAttribute('class');
        const isInitiallyDark = initialClass?.includes('dark');

        // Find and click theme toggle button
        // Theme toggle is inside nav on desktop
        const themeToggle = page.getByRole('button', { name: /toggle theme/i });
        await expect(themeToggle).toBeVisible({ timeout: 10000 });
        await themeToggle.click();

        // Wait for theme transition
        await page.waitForTimeout(500);

        // Verify theme changed
        const newClass = await html.getAttribute('class');
        if (isInitiallyDark) {
            expect(newClass).not.toContain('dark');
        } else {
            expect(newClass).toContain('dark');
        }
    });

    test('should persist theme preference', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Toggle theme
        const themeToggle = page.getByRole('button', { name: /toggle theme/i });
        await themeToggle.click();
        await page.waitForTimeout(500);

        const themeAfterToggle = await page.locator('html').getAttribute('class');

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Verify theme persisted
        const themeAfterReload = await page.locator('html').getAttribute('class');
        expect(themeAfterReload).toBe(themeAfterToggle);
    });
});
