import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PortfolioPage from '@/app/portfolio/page';
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

// Mock portfolio data
jest.mock('@/data/portfolio.json', () => [
    { id: 1, title: 'Project 1', category: 'Web', image: '/img1.jpg', link: 'https://example.com' },
    { id: 2, title: 'Project 2', category: 'Mobile', image: '/img2.jpg', link: 'https://example.com' },
    { id: 3, title: 'Project 3', category: 'Web', image: '/img3.jpg', link: 'https://example.com' },
]);

const mockUsePrefersReducedMotion = jest.mocked(usePrefersReducedMotion);

const renderWithProviders = () => {
    return render(
        <ThemeProvider>
            <LanguageProvider>
                <PortfolioPage />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('PortfolioPage', () => {
    beforeEach(() => {
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    });

    it('renders header and footer', () => {
        renderWithProviders();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
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

    it('renders breadcrumbs correctly', () => {
        renderWithProviders();
        expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
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
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('applies reduced motion preferences', () => {
        mockUsePrefersReducedMotion.mockReturnValue(true);

        renderWithProviders();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
});
