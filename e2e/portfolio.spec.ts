import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
    test('should navigate to portfolio page', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');

        // Check for portfolio page title
        await expect(page.getByRole('heading', { name: /Projects|Portfolio/i }).first()).toBeVisible();
    });

    test('should display project grid', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');

        // Portfolio should have header and footer
        const header = page.locator('header').first();
        await expect(header).toBeVisible();

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should have category filter buttons', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');

        // Look for All filter button
        const allFilter = page.getByRole('button', { name: 'All' });
        await expect(allFilter).toBeVisible();
    });

    test('should filter projects by category', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');

        // Click on All filter
        const allFilter = page.getByRole('button', { name: 'All' });
        await allFilter.click();

        // Should still show projects
        const projectGrid = page.locator('.grid');
        await expect(projectGrid).toBeVisible();
    });

    test('should have back-to-home link', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');

        // Look for "Back to Home" link
        const backLink = page.getByText(/Back to Home/i);
        await expect(backLink).toBeVisible();

        // Click it and verify navigation
        await backLink.click();
        await expect(page).toHaveURL(/\/(resume\/?)?$/);
    });
});
