import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'reports/playwright-results.json' }],
        ['junit', { outputFile: 'playwright-report/results.xml' }]
    ],
    use: {
        baseURL: 'http://localhost:3001/',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        // Mobile Safari is disabled due to flaky behavior in headless environments
        // {
        //     name: 'mobile-safari',
        //     use: { ...devices['iPhone 12'] },
        // }
    ],
    webServer: {
        command: 'npm run start -- -p 3001',
        url: 'http://localhost:3001',
        reuseExistingServer: true,
        timeout: 120 * 1000,
    },
});
