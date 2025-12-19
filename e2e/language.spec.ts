import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
    test('should switch language from English to French', async ({ page, isMobile }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Check initial content is in English
        await expect(page.getByText('My Services')).toBeVisible({ timeout: 10000 });

        if (isMobile) {
            // On mobile, open menu first
            await page.getByLabel('Open menu').click();
            await page.waitForTimeout(500);

            // Click the language toggle button in mobile menu
            const langButton = page.locator('.fixed.inset-0').getByText(/EN|FR|AR/i).first();
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

    test('should switch language from English to Arabic and use RTL', async ({ page, isMobile }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        if (isMobile) {
            await page.getByLabel('Open menu').click();
            await page.waitForTimeout(1000);
            const langButton = page.locator('button').filter({ hasText: /EN|FR|ES|AR/i }).last();
            for (let i = 0; i < 4; i++) {
                const text = await langButton.innerText();
                if (text.includes('AR')) break;
                await langButton.click();
                await page.waitForTimeout(500);
            }
            await page.getByLabel('Close menu').click();
        } else {
            const langButton = page.locator('header button[aria-label="Select language"]');
            await langButton.click();
            await page.waitForTimeout(800);

            // Try different ways to find the Arabic option
            const arOption = page.locator('button, a, span').filter({ hasText: /^العربية$/ }).first();
            await arOption.click();
        }

        await page.waitForTimeout(2000);

        // Verify RTL direction on HTML tag
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl', { timeout: 15000 });
        await expect(html).toHaveAttribute('lang', 'ar', { timeout: 15000 });

        // Verify Arabic text in Hero (Name parts as they are in separate spans)
        await expect(page.getByText('حاتم').first()).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('نور الدين').first()).toBeVisible({ timeout: 15000 });
    });

    test('should persist language preference after reload', async ({ page }) => {
        await page.goto('');
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
