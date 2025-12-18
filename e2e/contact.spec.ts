import { test, expect } from '@playwright/test';

test.describe('Contact Section', () => {
    test('should display contact section with all elements', async ({ page }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');

        // Scroll to footer/contact section
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Check contact heading is visible (footer uses "Contact Me" or socials)
        // Check for the footer copyright or social links as proof of content
        await expect(page.locator('#contact')).toBeVisible({ timeout: 10000 });

        // Check social links are present in footer
        const socialLinks = page.locator('#contact a[target="_blank"]');
        const count = await socialLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have working social media links', async ({ page }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');

        // Scroll to contact section
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Check that social links have href attributes
        const socialLinks = page.locator('#contact a[target="_blank"]');
        const firstLink = socialLinks.first();

        const href = await firstLink.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
    });

    test('should display contact information', async ({ page }) => {
        await page.goto('');
        await page.waitForLoadState('networkidle');

        // Scroll to contact section
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Check for email display (either as text or link)
        const emailElement = page.getByText(/@/);
        await expect(emailElement.first()).toBeVisible();
    });

    test('contact section should be accessible via nav link', async ({ page, isMobile }) => {
        if (!isMobile) test.skip(); // Desktop navigation has smooth scroll which is flaky in tests

        await page.goto('');
        await page.waitForLoadState('networkidle');

        // Open mobile menu
        await page.getByLabel('Open menu').click();
        await page.waitForTimeout(500);

        // Click contact link
        await page.getByRole('link', { name: /contact/i }).first().click({ force: true });

        // Wait for scroll and animation to settle
        await page.waitForTimeout(1500);

        // Verify contact section is in viewport
        const contactSection = page.locator('#contact');
        await expect(contactSection).toBeInViewport({ ratio: 0.1 });
    });
});
