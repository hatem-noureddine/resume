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
            `
        });
    });

    test('homepage should match snapshot', async ({ page }) => {
        // Freeze jumping elements
        await page.evaluate(() => {
            // Fix typing animation
            const typingElement = document.querySelector('h1 + div span');
            if (typingElement) typingElement.innerHTML = 'Android Developer |';

            // Fix any other moving parts if necessary
        });
        await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 1000 });
    });

    test('blog page should match snapshot', async ({ page }) => {
        await page.goto('/blog');
        await expect(page).toHaveScreenshot('blog-page.png', { fullPage: true, maxDiffPixels: 1000 });
    });

    test('portfolio page should match snapshot', async ({ page }) => {
        await page.goto('/portfolio');
        await expect(page).toHaveScreenshot('portfolio-page.png', { fullPage: true, maxDiffPixels: 1000 });
    });
});
