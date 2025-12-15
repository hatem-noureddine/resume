import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');

        // Wait for content to load
        await page.waitForTimeout(1000);

        const accessibilityScanResults = await new AxeBuilder({ page })
            .exclude('iframe') // Exclude iframes if any
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass a11y on mobile', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('/');
        await page.waitForTimeout(1000);

        // Open menu to test menu a11y
        await page.getByLabel('Open menu').click();
        await expect(page.getByLabel('Close menu')).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
