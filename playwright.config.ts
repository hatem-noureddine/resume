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
    expect: {
        toHaveScreenshot: {
            pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
        },
    },
    use: {
        baseURL: 'http://localhost:3002/',
        trace: 'on-first-retry',
        locale: 'en-US',
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
    ],
    webServer: {
        command: process.env.CI ? 'npm run start -- -p 3002' : 'npm run build && npm run start -- -p 3002',
        url: 'http://localhost:3002',
        reuseExistingServer: true,
        timeout: 300 * 1000,
    },
});
