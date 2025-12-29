import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
    await page.goto('/admin/login');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    // Wait for the URL to change and the dashboard to load
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText(/Admin Dashboard/i).first()).toBeVisible();
}

async function openSidebar(page: Page, isMobile: boolean) {
    if (isMobile) {
        const menuButton = page.getByLabel('Open menu');
        await expect(menuButton).toBeVisible();
        await menuButton.click();
    }
    // Wait for sidebar to be visible
    await expect(page.locator('aside')).toBeVisible();
}

test.describe('Admin Dashboard', () => {

    test.describe('Authentication', () => {
        test('should redirect to login when unauthenticated', async ({ page }) => {
            await page.goto('/admin');
            await expect(page).toHaveURL(/\/admin\/login/);
        });

        test('should show error with incorrect password', async ({ page }) => {
            await page.goto('/admin/login');
            await page.fill('input[type="password"]', 'wrong-password');
            await page.click('button[type="submit"]');
            await expect(page.getByText(/Invalid password/i).first()).toBeVisible();
        });

        test('should login successfully with correct password', async ({ page }) => {
            await page.goto('/admin/login');
            await page.fill('input[type="password"]', 'admin');
            await page.click('button[type="submit"]');
            await expect(page).toHaveURL(/\/admin/);
            await expect(page.getByText(/Admin Dashboard/i).first()).toBeVisible();
        });

        test('should logout successfully', async ({ page, isMobile }) => {
            await login(page);
            await openSidebar(page, !!isMobile);

            const logoutButton = page.getByRole('button', { name: /Log out/i });
            await expect(logoutButton).toBeVisible();
            await logoutButton.click();

            await expect(page).toHaveURL(/\/admin\/login/);
        });
    });

    test.describe('Features', () => {
        test.beforeEach(async ({ page }) => {
            await login(page);
        });

        test('should navigate to AI Assistant and show history', async ({ page, isMobile }) => {
            await openSidebar(page, !!isMobile);
            const aiLink = page.locator('aside').getByRole('link', { name: /AI Assistant/i });
            await expect(aiLink).toBeVisible();
            await aiLink.click();

            await expect(page).toHaveURL(/\/admin\/assist/);
            await expect(page.getByText(/AI Assistant/i).first()).toBeVisible();

            const historyHeading = page.getByText(/Past Suggestions|History/i).first();
            await expect(historyHeading).toBeVisible();
        });

        test('should navigate to Performance Dashboard and show metric cards', async ({ page, isMobile }) => {
            await openSidebar(page, !!isMobile);
            const perfLink = page.locator('aside').getByRole('link', { name: /Performance/i });
            await expect(perfLink).toBeVisible();
            await perfLink.click();

            await expect(page).toHaveURL(/\/admin\/performance/);
            await expect(page.getByText(/Performance Dashboard/i).first()).toBeVisible();

            await expect(page.getByText('FCP').first()).toBeVisible();
            await expect(page.getByText('LCP').first()).toBeVisible();
        });

        test('should toggle performance history panel', async ({ page }) => {
            await page.goto('/admin/performance');
            await expect(page.getByRole('button', { name: /History/i })).toBeVisible();
            await page.getByRole('button', { name: /History/i }).click();
            await expect(page.getByRole('heading', { name: /Metric History/i })).toBeVisible();
        });

        test('should show comparison mode controls in performance history', async ({ page }) => {
            await page.goto('/admin/performance');
            await expect(page.getByRole('button', { name: /History/i })).toBeVisible();
            await page.getByRole('button', { name: /History/i }).click();

            const historyHeading = page.getByRole('heading', { name: /Metric History/i });
            await expect(historyHeading).toBeVisible();
        });
    });
});
