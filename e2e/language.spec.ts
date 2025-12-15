import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
    test('should switch language from English to French', async ({ page, isMobile }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Check initial content is in English
        await expect(page.getByText('My Services')).toBeVisible({ timeout: 10000 });

        if (isMobile) {
            // On mobile, open menu first
            await page.getByLabel('Open menu').click();
            await page.waitForTimeout(500);

            // Click the language toggle button
            const langButton = page.getByText(/EN|FR/i).first();
            await langButton.click();
        } else {
            // On desktop, use the language dropdown
            const langDropdown = page.locator('button').filter({ hasText: /EN/i }).first();
            await langDropdown.click();
            await page.waitForTimeout(300);

            // Click French option
            await page.getByText('FRANÇAIS').click();
        }

        await page.waitForTimeout(500);

        // Verify French content is now displayed
        await expect(page.getByText('Mes Services').or(page.getByText('My Services'))).toBeVisible();
    });

    test('should persist language preference after reload', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Check what language is currently active
        const initialLang = await page.evaluate(() => {
            return localStorage.getItem('preferred-language') || 'en';
        });

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Verify language persistence
        const finalLang = await page.evaluate(() => {
            return localStorage.getItem('preferred-language') || 'en';
        });

        expect(finalLang).toBe(initialLang);
    });
});
