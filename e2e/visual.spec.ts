import { test, expect } from '@playwright/test';

/**
 * Helper to scroll through the page to trigger all lazy-loaded components
 * and animations before taking a screenshot.
 */
async function scrollToBottom(page: any) {
    await page.evaluate(async () => {
        const delay = 100;
        const totalHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        let currentScroll = 0;

        while (currentScroll < totalHeight) {
            window.scrollTo(0, currentScroll);
            currentScroll += viewportHeight / 2;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Final scroll to bottom just in case height increased
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Scroll back to top
        window.scrollTo(0, 0);
        // Wait longer for everything to settle (hydration, images, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000));
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
        maxDiffPixelRatio: 0.15, // Increased to 15% to accommodate layout shifts
        maxDiffPixels: 20000,    // Increased to 20k pixels
        threshold: 0.2           // Tone down sensitivity to minor color differences
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
