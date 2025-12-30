import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import NotFound from '@/app/not-found';
import GlobalError from '@/app/global-error';
import ErrorPage from '@/app/error';

// Mock next/font/google
jest.mock('next/font/google', () => ({
    Inter: () => ({ variable: '--font-inter' }),
    Outfit: () => ({ variable: '--font-outfit' }),
}));

// Mock dependencies
jest.mock('@/lib/posts', () => ({
    getSortedPostsData: jest.fn().mockResolvedValue([
        {
            slug: 'test-post',
            title: 'Test Post',
            date: '2024-01-01',
            description: 'Test Description',
            tags: ['tag1'],
            category: 'General',
            content: 'Content',
            readingTime: '5 min read'
        }
    ]),
}));

jest.mock('@/lib/keystatic', () => ({
    getBlogPosts: jest.fn().mockResolvedValue([]),
    getProjects: jest.fn().mockResolvedValue([
        {
            slug: 'test-project',
            entry: {
                title: 'Test Project',
                category: 'Web',
                description: 'Test Description',
                image: '/img1.jpg',
                link: 'https://example.com',
                technologies: ['React'],
                gallery: [],
                language: 'en',
            }
        }
    ]),
    getLanguages: jest.fn().mockResolvedValue([]),
    getExperience: jest.fn().mockResolvedValue([]),
    getSkills: jest.fn().mockResolvedValue([]),
    getResumes: jest.fn().mockResolvedValue([]),
    getCertifications: jest.fn().mockResolvedValue([]),
    getTestimonials: jest.fn().mockResolvedValue([]),
}));

// Mock child components to avoid deep rendering issues
jest.mock('@/components/sections/Hero', () => ({ Hero: () => <div data-testid="hero" /> }));
jest.mock('@/components/sections/Services', () => ({ Services: () => <div data-testid="services" /> }));
jest.mock('@/components/sections/Experience', () => ({ Experience: () => <div data-testid="experience" /> }));
jest.mock('@/components/sections/Skills', () => ({ Skills: () => <div data-testid="skills" /> }));
jest.mock('@/components/sections/Portfolio', () => ({ Portfolio: () => <div data-testid="portfolio" /> }));
jest.mock('@/components/sections/Blog', () => ({ Blog: () => <div data-testid="blog" /> }));


jest.mock('@/components/layout/Header', () => ({ Header: () => <div data-testid="header" /> }));
jest.mock('@/components/layout/Footer', () => ({ Footer: () => <div data-testid="footer" /> }));
jest.mock('@/components/layout/FloatingActions', () => ({ FloatingActions: () => <div data-testid="floating-actions" /> }));
jest.mock('@/components/layout/FloatingAccessibility', () => ({ FloatingAccessibility: () => <div data-testid="floating-accessibility" /> }));
jest.mock('@/components/ui/LoadingScreen', () => ({ LoadingScreen: () => <div data-testid="loading-screen" /> }));
jest.mock('@/components/ui/ThemeToggle', () => ({ ThemeToggle: () => <div data-testid="theme-toggle" /> }));
jest.mock('@/context/ThemeContext', () => ({
    ThemeProvider: ({ children }: any) => <div>{children}</div>
}));
jest.mock('@/context/LanguageContext', () => ({
    LanguageProvider: ({ children }: any) => <div>{children}</div>,
    useLanguage: () => ({
        t: {
            notFound: {
                title: "404",
                subtitle: "Page Not Found",
                message: "Sorry, the page you're looking for doesn't exist.",
                home: "Go Home",
                contact: "Contact Support"
            },
            chat: {
                welcome: "Welcome",
                typing: "Typing...",
                inputPlaceholder: "Ask me anything..."
            },
            blog: {
                title: "Blog",
                description: "My blog"
            }
        },
        language: 'en',
    })
}));

// Mock FeatureFlags so projects section is visible
jest.mock('@/context/FeatureFlags', () => ({
    FeatureFlagProvider: ({ children }: any) => <div>{children}</div>,
    useFeatureFlags: () => ({
        flags: { projects: true },
        isEnabled: (flag: string) => flag === 'projects' ? true : false,
        setFlag: jest.fn(),
    }),
    Feature: ({ children, flag }: any) => flag === 'projects' ? <>{children}</> : null,
}));

describe('App Directory', () => {
    describe('Home Page', () => {
        it('renders all sections', async () => {
            const page = await Home();
            render(page);

            expect(screen.getByTestId('hero')).toBeInTheDocument();
            // Use findByTestId for dynamic components as they might load asynchronously
            expect(await screen.findByTestId('services')).toBeInTheDocument();
            expect(await screen.findByTestId('experience')).toBeInTheDocument();
            expect(await screen.findByTestId('skills')).toBeInTheDocument();
            expect(await screen.findByTestId('portfolio')).toBeInTheDocument();
            expect(await screen.findByTestId('blog')).toBeInTheDocument();
        });
    });

    // RootLayout test removed - Server Components with html/body tags
    // cannot be tested with @testing-library/react in JSDOM environment.
    // RootLayout is implicitly tested via integration/E2E tests.

    describe('NotFound', () => {
        it('renders 404 content', () => {
            render(<NotFound />);
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent(/Page/i); // Adjusted to match "Page Not Found"
            expect(screen.getByText(/Sorry, the page you're looking for/i)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Go Home/i })).toBeInTheDocument();
        });
    });

    describe('GlobalError', () => {
        beforeEach(() => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('renders error content', () => {
            render(
                <GlobalError
                    error={new Error('Test Error')}
                    reset={() => { }}
                />
            );
            expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
        });
    });

    describe('ErrorPage', () => {
        beforeEach(() => {
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('renders error content', () => {
            render(
                <ErrorPage
                    error={new Error('Test Error')}
                    reset={() => { }}
                />
            );
            expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
        });
    });
});
