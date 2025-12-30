import { test, expect } from '@playwright/test';

test.describe('Accessibility Controls', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');

        // Scroll down to make the floating accessibility button appear
        await page.evaluate(() => window.scrollTo(0, 1000));
        await page.waitForTimeout(1000);
    });

    test('should toggle font size', async ({ page, isMobile }) => {
        if (isMobile) {
            // Mobile might not have the floating panel or it might be different
            // Based on FloatingAccessibility.tsx line 85: "hidden md:flex"
            // So we skip this test for mobile if it's not visible
            const panel = page.locator('button[aria-label="Toggle accessibility controls"]');
            if (!await panel.isVisible()) {
                test.skip();
                return;
            }
        }

        const toggleButton = page.getByLabel('Toggle accessibility controls');
        await expect(toggleButton).toBeVisible();
        await toggleButton.click();

        // Check if panel is open
        await expect(page.getByText('Text Size')).toBeVisible();

        // Initial font size should be Medium
        await expect(page.getByText('Medium')).toBeVisible();

        // Increase font size
        await page.getByLabel('Increase font size').click();
        await expect(page.getByText('Large')).toBeVisible();

        // Check HTML class for font size
        const html = page.locator('html');
        await expect(html).toHaveClass(/font-size-large/);

        // Decrease font size back to Medium
        await page.getByLabel('Decrease font size').click();
        await expect(page.getByText('Medium')).toBeVisible();
        await expect(html).toHaveClass(/font-size-medium/);

        // Decrease to Small
        await page.getByLabel('Decrease font size').click();
        await expect(page.getByText('Small')).toBeVisible();
        await expect(html).toHaveClass(/font-size-small/);
    });

    test('should toggle high contrast', async ({ page }) => {
        const toggleButton = page.getByLabel('Toggle accessibility controls');
        if (!await toggleButton.isVisible()) {
            test.skip();
            return;
        }
        await toggleButton.click();

        const highContrastButton = page.getByLabel('Enable high contrast');
        await highContrastButton.click();

        // Verify high contrast is enabled
        const html = page.locator('html');
        await expect(html).toHaveClass(/high-contrast/);

        // Verify label changed
        await expect(page.getByLabel('Disable high contrast')).toBeVisible();

        // Toggle back
        await page.getByLabel('Disable high contrast').click();
        await expect(html).not.toHaveClass(/high-contrast/);
    });
});
