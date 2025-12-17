/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/e2e/**/*',
        '!**/node_modules/**',
        '!src/app/manifest.ts',
        '!src/**/index.ts',
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(@vercel/analytics)/)',
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 80,
            statements: 80,
        },
    },
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-junit.xml' }]
    ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
