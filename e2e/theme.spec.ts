import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
    test('should toggle between light and dark themes', async ({ page, isMobile }) => {
        // Force explicit URL to debug baseURL issue
        await page.goto('');

        // Wait for the page to fully hydrate
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Get initial theme state
        const html = page.locator('html');
        const initialClass = await html.getAttribute('class');
        const isInitiallyDark = initialClass?.includes('dark');

        // Find and click theme toggle button
        let themeToggle;

        if (isMobile) {
            await page.getByLabel('Open menu').click();
            await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
            // In mobile menu overlay
            themeToggle = page.locator('.fixed.inset-0 button[aria-label="Toggle theme"]');
        } else {
            // In desktop nav (inside header)
            themeToggle = page.locator('header nav button[aria-label="Toggle theme"]');
        }

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

    test('should persist theme preference', async ({ page, isMobile }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Toggle theme
        let themeToggle;
        if (isMobile) {
            await page.getByLabel('Open menu').click();
            themeToggle = page.locator('.fixed.inset-0 button[aria-label="Toggle theme"]');
        } else {
            themeToggle = page.locator('header nav button[aria-label="Toggle theme"]');
        }
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
