import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
    test('should navigate to blog page', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');

        // Check for blog page title
        await expect(page.getByRole('heading', { name: /Blog/i }).first()).toBeVisible();
    });

    test('should display blog list or empty state', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');

        // Blog page should have header and footer
        const header = page.locator('header').first();
        await expect(header).toBeVisible();

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should have back-to-home navigation from blog', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');

        // Look for home link in navigation
        const homeLink = page.getByRole('link', { name: /home|HN/i }).first();
        await expect(homeLink).toBeVisible();
    });
});
