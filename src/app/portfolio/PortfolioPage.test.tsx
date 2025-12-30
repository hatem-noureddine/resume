import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PortfolioClient } from './PortfolioClient';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Mock dependencies
jest.mock('@/components/layout/Header', () => ({
    Header: () => <div data-testid="header" />,
}));

jest.mock('@/components/layout/Footer', () => ({
    Footer: () => <div data-testid="footer" />,
}));

jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn().mockReturnValue(false),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');
    const MotionDiv = React.forwardRef(function MotionDiv(
        { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLDivElement>
    ) {
        return React.createElement('div', { ...props, ref }, children);
    });
    MotionDiv.displayName = 'MotionDiv';

    const MotionSpan = React.forwardRef(function MotionSpan(
        { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLSpanElement>
    ) {
        return React.createElement('span', { ...props, ref }, children);
    });
    MotionSpan.displayName = 'MotionSpan';

    const MotionButton = React.forwardRef(function MotionButton(
        { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLButtonElement>
    ) {
        return React.createElement('button', { ...props, ref }, children);
    });
    MotionButton.displayName = 'MotionButton';

    return {
        motion: {
            div: MotionDiv,
            span: MotionSpan,
            button: MotionButton,
        },
        AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    };
});

const mockUsePrefersReducedMotion = jest.mocked(usePrefersReducedMotion);

// Mock project data that matches the PortfolioClient interface
const mockProjects = [
    { id: '1', title: 'Project 1', category: 'Web', image: '/img1.jpg', link: 'https://example.com', language: 'en' },
    { id: '2', title: 'Project 2', category: 'Mobile', image: '/img2.jpg', link: 'https://example.com', language: 'en' },
    { id: '3', title: 'Project 3', category: 'Web', image: '/img3.jpg', link: 'https://example.com', language: 'en' },
];

const renderWithProviders = (items = mockProjects) => {
    return render(
        <ThemeProvider>
            <LanguageProvider>
                <PortfolioClient items={items} />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('PortfolioClient', () => {
    beforeEach(() => {
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
        mockUsePrefersReducedMotion.mockReturnValue(false);
    });

    it('renders page title', () => {
        renderWithProviders();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders category filters', () => {
        renderWithProviders();
        // Use getAllByRole for buttons since text content might match multiple elements
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(3); // All, Web, Mobile
    });

    it('filters projects when category is clicked', async () => {
        renderWithProviders();

        // Initially shows all 3 projects
        expect(screen.getAllByRole('img').length).toBe(3);

        // Click Mobile filter
        const mobileButton = screen.getByRole('button', { name: /Mobile/i });
        fireEvent.click(mobileButton);

        await waitFor(() => {
            // Should only show 1 Mobile project
            expect(screen.getAllByRole('img').length).toBe(1);
        });
    });

    it('resets filter when All is clicked', async () => {
        renderWithProviders();

        // Click Mobile filter first
        const mobileButton = screen.getByRole('button', { name: /Mobile/i });
        fireEvent.click(mobileButton);

        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(1);
        });

        // Click All filter
        const allButton = screen.getByRole('button', { name: /All/i });
        fireEvent.click(allButton);

        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });
    });

    it('shows project count in category badges', () => {
        renderWithProviders();
        // "All" count (3), "Web" count (2), "Mobile" count (1)
        // Multiple elements may have these counts, so use getAllByText
        expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    });

    it('handles mobile viewport', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
        window.dispatchEvent(new Event('resize'));

        renderWithProviders();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('applies reduced motion preferences', () => {
        mockUsePrefersReducedMotion.mockReturnValue(true);

        renderWithProviders();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('filters projects by language', () => {
        const multiLangProjects = [
            { id: '1', title: 'English Project', category: 'Web', image: '/img1.jpg', link: 'https://example.com', language: 'en' },
            { id: '2', title: 'French Project', category: 'Web', image: '/img2.jpg', link: 'https://example.com', language: 'fr' },
        ];

        renderWithProviders(multiLangProjects);
        // By default, LanguageProvider uses 'en', so only English project should show
        expect(screen.getAllByRole('img').length).toBe(1);
    });

    it('renders empty state when no projects', () => {
        renderWithProviders([]);
        // Should still render the heading
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
});
