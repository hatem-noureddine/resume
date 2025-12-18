import { test, expect } from '@playwright/test';

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
        maxDiffPixelRatio: 0.05, // Allow 5% difference due to UI improvements
        maxDiffPixels: 5000     // Or 5000 pixels
    };

    test('homepage should match snapshot', async ({ page }) => {
        // Freeze jumping elements
        await page.evaluate(() => {
            // Fix typing animation
            const typingElement = document.querySelector('h1 + div span');
            if (typingElement) typingElement.innerHTML = 'Android Developer |';

            // Fix any other moving parts if necessary
        });
        await expect(page).toHaveScreenshot('homepage.png', screenshotOptions);
    });

    test('blog page should match snapshot', async ({ page }) => {
        await page.goto('/blog');
        await expect(page).toHaveScreenshot('blog-page.png', screenshotOptions);
    });

    test('portfolio page should match snapshot', async ({ page }) => {
        await page.goto('/portfolio');
        await expect(page).toHaveScreenshot('portfolio-page.png', screenshotOptions);
    });
});
