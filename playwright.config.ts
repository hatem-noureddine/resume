import { defineConfig, devices } from '@playwright/test';
import os from 'node:os';

// Determine platform for snapshot naming
const platform = os.platform(); // 'darwin', 'linux', 'win32'

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
    // Update screenshots only when running with --update-snapshots
    updateSnapshots: 'missing',
    expect: {
        toHaveScreenshot: {
            // Include platform in path to allow different baselines for different OS
            pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}',
        },
    },
    snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-' + platform + '{ext}',
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3002/',
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
