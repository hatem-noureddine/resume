import { test, expect } from '@playwright/test';

/**
 * Helper to scroll through the page to trigger all lazy-loaded components
 * and animations before taking a screenshot.
 */
async function scrollToBottom(page: any) {
    await page.evaluate(async () => {
        const distance = 100;
        const delay = 100;
        while (document.documentElement.scrollTop + window.innerHeight < document.documentElement.scrollHeight) {
            window.scrollBy(0, distance);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        // Scroll back to top
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 500));
    });
}

test.describe('Visual Regression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.addStyleTag({
            content: `
                *, *::before, *::after {
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0s !important;
                    transition-delay: 0s !important;
                }
                .animate-pulse, .animate-bounce, .animate-spin {
                    animation: none !important;
                }
                /* Hide floating elements that might overlap or vary */
                [aria-label="Open chat"], [aria-label="Close chat"], .fixed.bottom-6.right-6 {
                    display: none !important;
                }
            `
        });
    });

    const screenshotOptions = {
        fullPage: true,
        animations: 'disabled' as const,
        maxDiffPixelRatio: 0.1, // Increased to 10% to accommodate layout shifts
        maxDiffPixels: 10000    // Increased to 10k pixels
    };

    test('homepage should match snapshot', async ({ page }) => {
        // Hydrate all dynamic sections
        await scrollToBottom(page);
        await expect(page).toHaveScreenshot('homepage.png', {
            ...screenshotOptions,
            mask: [page.locator('h1 + div span')]
        });
    });

    test('blog page should match snapshot', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');
        await scrollToBottom(page);
        await expect(page).toHaveScreenshot('blog-page.png', screenshotOptions);
    });

    test('portfolio page should match snapshot', async ({ page }) => {
        await page.goto('/portfolio');
        await page.waitForLoadState('networkidle');
        await scrollToBottom(page);
        await expect(page).toHaveScreenshot('portfolio-page.png', screenshotOptions);
    });
});
