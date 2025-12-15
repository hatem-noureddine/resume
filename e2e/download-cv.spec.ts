import { test, expect } from '@playwright/test';

test.describe('Download CV Feature', () => {
    test('should have CV download button visible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Look for Download CV button in hero section
        const downloadButton = page.getByRole('link', { name: /Download.*CV|CV.*Download|Resume/i });
        await expect(downloadButton.first()).toBeVisible();
    });

    test('CV download button should have valid href', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Find the download button
        const downloadButton = page.getByRole('link', { name: /Download.*CV|CV.*Download|Resume/i }).first();

        // Check it has an href attribute pointing to a PDF
        const href = await downloadButton.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toContain('.pdf');
    });
});
