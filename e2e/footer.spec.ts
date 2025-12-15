import { test, expect } from '@playwright/test';

test.describe('Footer', () => {
    test('should display footer on homepage', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should have copyright text', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Scroll to footer
        const footer = page.locator('footer');
        await footer.scrollIntoViewIfNeeded();

        // Check for copyright or year
        await expect(footer.getByText(/©|2024|2025|Hatem/i).first()).toBeVisible();
    });

    test('should have social media links', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const footer = page.locator('footer');
        await footer.scrollIntoViewIfNeeded();

        // Check for at least one social link (GitHub, LinkedIn, etc.)
        const socialLinks = footer.locator('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
        const count = await socialLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have navigation links in footer', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const footer = page.locator('footer');
        await footer.scrollIntoViewIfNeeded();

        // Check footer exists and has links
        const links = footer.locator('a');
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
    });
});
