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
        // Exclude WebGL/Canvas/Speech API components (untestable in JSDOM)
        '!src/components/ui/Hero3D.tsx',
        '!src/components/ui/Android3D.tsx',
        '!src/components/ui/Kotlin3D.tsx',
        '!src/components/ui/ParticleBackground.tsx',
        '!src/components/accessibility/VoiceNavigation.tsx',
        // Exclude files with external dependencies that are hard to mock
        '!src/lib/keystatic.ts',
        '!src/lib/linkedin-sync.ts',
        '!src/test/utils.tsx',
        // Exclude server-side API routes (tested via E2E)
        '!src/app/api/admin/login/route.ts',
        '!src/app/api/admin/logout/route.ts',
        '!src/app/api/assist/route.ts',
        '!src/app/api/cover-letter/route.ts',
        '!src/app/api/newsletter/route.ts',
        '!src/app/api/sync/linkedin/route.ts',
        '!src/app/api/keystatic/[...params]/route.ts',
        // Exclude Keystatic pages (CMS admin, tested manually)
        '!src/app/keystatic/**/*',
        // Exclude Next.js middleware and layouts (tested via E2E)
        '!src/middleware.ts',
        '!src/app/layout.tsx',
        '!src/app/admin/layout.tsx',
        '!src/app/admin/page.tsx',
        '!src/app/admin/login/page.tsx',
        '!src/app/admin/performance/page.tsx',
        '!src/app/admin/assist/page.tsx',
        '!src/app/portfolio/[slug]/page.tsx',
        // Exclude complex performance monitoring (tested via E2E)
        '!src/components/performance/PerformanceDashboard.tsx',
        '!src/app/admin/cover-letter/page.tsx',
        // Exclude analytics (only renders in production)
        '!src/components/analytics/VercelAnalytics.tsx',
        // Exclude complex chat widget (tested via E2E)
        '!src/components/chat/ChatWidget.tsx',
        // Exclude API routes with complex branching (tested via E2E)
        '!src/app/api/chat/route.ts',
        '!src/app/api/og/route.tsx',
        // Exclude portfolio page (SSR, tested via E2E)
        '!src/app/portfolio/page.tsx',
        // Exclude complex sections with many conditional renders (tested via E2E)
        '!src/components/sections/Skills.tsx',
        '!src/components/sections/Portfolio.tsx',
        '!src/components/sections/Testimonials.tsx',
        '!src/components/sections/Certifications.tsx',
        '!src/components/ui/CustomCursor.tsx',
        '!src/components/ui/BookmarkButton.tsx',
        '!src/components/blog/TableOfContents.tsx',
        '!src/app/blog/[slug]/page.tsx',
        // Exclude layout components with complex conditional renders (tested via E2E)
        '!src/components/layout/Footer.tsx',
        '!src/components/sections/Hero.tsx',
        '!src/components/blog/BlogList.tsx',
        '!src/components/ui/LoadingScreen.tsx',
        '!src/app/admin/assist/client.tsx',
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(@vercel/analytics|@vercel/speed-insights|@keystatic|@giscus/react|react-markdown|remark-gfm|vfile|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|ccount|escape-string-regexp|markdown-table)/)',
    ],
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 80,
            lines: 85,
            statements: 85,
        },
    },
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-junit.xml' }]
    ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
