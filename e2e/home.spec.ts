import { test, expect } from '@playwright/test';

test.describe('Homepage Responsive & Functionality', () => {

    test('should display desktop navigation correctly', async ({ page, isMobile }) => {
        if (isMobile) test.skip();

        await page.goto('');

        // Check key sections are visible
        // Check key sections are visible
        // Use more specific locators that wait for hydration
        await expect(page.getByRole('heading', { name: /My Services|Services/i })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('heading', { name: /My Skills/i })).toBeVisible({ timeout: 10000 });

        // Check navigation links
        const nav = page.locator('nav').first();
        await expect(nav).toBeVisible();
        await expect(nav.getByText('Services')).toBeVisible();
        await expect(nav.getByText('Projects').or(nav.getByText('Portfolio'))).toBeVisible();
    });

    test('should function correctly on mobile', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('');

        // Check header layout reorder (Image above text check handled visually, functional check here)
        // Check Menu Toggle
        const menuButton = page.getByLabel('Open menu');
        await expect(menuButton).toBeAttached({ timeout: 10000 });
        await expect(menuButton).toBeVisible({ timeout: 10000 });

        // Open Menu
        await menuButton.click();

        const mobileMenu = page.locator('.fixed.inset-0.z-50'); // Updated z-index based on Header.tsx
        await expect(mobileMenu).toBeVisible();

        // Check Links in Mobile Menu
        await expect(mobileMenu.getByText('Services')).toBeVisible();

        // Test Close Button (Critical fix verification)
        const closeButton = page.getByLabel('Close menu');
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        await expect(mobileMenu).not.toBeVisible();
    });

    test('should display skills sections on mobile', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('');

        // Scroll to skills
        const skillsSection = page.locator('#skills');
        await skillsSection.scrollIntoViewIfNeeded();

        // Check Headers exist (Stacked on mobile)
        await expect(page.getByRole('heading', { name: /Professional/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Technical/i })).toBeVisible();

        // Check content
        await expect(page.getByText('Team Management')).toBeVisible();
        // Technical skills tag cloud
        await expect(page.getByText('Kotlin', { exact: true }).first()).toBeVisible();
    });

    test('should not have horizontal scroll', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('');

        // Wait for animations/rendering
        await page.waitForTimeout(1000);

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 50); // +50 buffer for scrollbars and sub-pixel rendering
    });
});
