import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
    // Skip visual regression in CI - snapshots are OS-specific (darwin vs linux)
    test.skip(() => !!process.env.CI, 'Visual regression tests are skipped in CI');

    // Force reduced motion to ensure consistent snapshots without animations
    test.use({
        contextOptions: {
            reducedMotion: 'reduce',
        },
    });

    test('home page matches snapshot', async ({ page }) => {
        await page.goto('');
        // Wait for fonts/images
        await page.waitForLoadState('networkidle');
        // Mask dynamic elements if any (e.g. random text, dates)
        await expect(page).toHaveScreenshot('home-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.1
        });
    });

    test('portfolio page matches snapshot', async ({ page }) => {
        await page.goto('portfolio');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('portfolio-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.1
        });
    });

    test('blog page matches snapshot', async ({ page }) => {
        // Check if blog link exists, otherwise go directly
        await page.goto('blog');
        // Blog typically has dynamic content, might need masking if dates change often or random order
        // But with fixed mock data it should be fine. E2E might use real build?
        // Assuming SSG content is stable.

        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('blog-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.1,
            mask: [page.locator('.text-sm.text-muted-foreground')] // Mask dates if flaky
        });
    });
});
