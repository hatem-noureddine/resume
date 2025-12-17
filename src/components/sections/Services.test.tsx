import { render, screen, fireEvent, act } from '@testing-library/react';
import { Services } from './Services';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} onClick={onClick} {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock SectionHeading
jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div data-testid="section-heading">
            <h2>{title}</h2>
            <span>{subtitle}</span>
        </div>
    )
}));

// Mock Button
jest.mock('@/components/ui/Button', () => ({
    Button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

// Mock reduced motion preference
const mockPrefersReducedMotion = jest.fn().mockReturnValue(false);
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => mockPrefersReducedMotion()
}));

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

const renderWithProviders = () => {
    return render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
            <LanguageProvider>
                <Services />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('Services Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPrefersReducedMotion.mockReturnValue(false);
    });

    it('renders the section with correct id', () => {
        renderWithProviders();
        expect(document.getElementById('services')).toBeInTheDocument();
    });

    it('displays section heading with title', () => {
        renderWithProviders();
        expect(screen.getByTestId('section-heading')).toBeInTheDocument();
        expect(screen.getByText('My Services')).toBeInTheDocument();
    });

    it('renders service cards on desktop', () => {
        renderWithProviders();
        // Services render in both mobile and desktop views, so use getAllByText
        expect(screen.getAllByText('Web Design').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Development').length).toBeGreaterThan(0);
        expect(screen.getAllByText('UI/UX Design').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Graphics Design').length).toBeGreaterThan(0);
    });

    it('displays service descriptions', () => {
        renderWithProviders();
        expect(screen.getAllByText(/visually stunning/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/robust and scalable/i).length).toBeGreaterThan(0);
    });

    describe('Mobile Carousel', () => {
        it('shows carousel navigation buttons', () => {
            renderWithProviders();
            expect(screen.getByLabelText('Previous service')).toBeInTheDocument();
            expect(screen.getByLabelText('Next service')).toBeInTheDocument();
        });

        it('displays current slide indicator', () => {
            renderWithProviders();
            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });

        it('advances to next slide on next button click', () => {
            renderWithProviders();

            const nextButton = screen.getByLabelText('Next service');
            fireEvent.click(nextButton);

            expect(screen.getByText(/2 \/ /)).toBeInTheDocument();
        });

        it('goes to previous slide on prev button click', () => {
            renderWithProviders();

            // Go to slide 2 first
            fireEvent.click(screen.getByLabelText('Next service'));
            expect(screen.getByText(/2 \/ /)).toBeInTheDocument();

            // Go back to slide 1
            fireEvent.click(screen.getByLabelText('Previous service'));
            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });

        it('wraps to last slide when pressing prev on first slide', () => {
            renderWithProviders();

            // On slide 1, press prev to go to last
            fireEvent.click(screen.getByLabelText('Previous service'));
            expect(screen.getByText(/4 \/ /)).toBeInTheDocument();
        });

        it('wraps to first slide when pressing next on last slide', () => {
            renderWithProviders();

            // Go to last slide
            fireEvent.click(screen.getByLabelText('Previous service'));
            expect(screen.getByText(/4 \/ /)).toBeInTheDocument();

            // Press next to wrap to first
            fireEvent.click(screen.getByLabelText('Next service'));
            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });

        it('allows direct navigation via dot indicators', () => {
            renderWithProviders();

            const slide3Button = screen.getByLabelText('Go to slide 3');
            fireEvent.click(slide3Button);

            expect(screen.getByText(/3 \/ /)).toBeInTheDocument();
        });
    });

    describe('Keyboard Navigation', () => {
        it('navigates to next slide with ArrowRight key', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            fireEvent.keyDown(carousel, { key: 'ArrowRight' });

            expect(screen.getByText(/2 \/ /)).toBeInTheDocument();
        });

        it('navigates to previous slide with ArrowLeft key', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            // First go to slide 2
            fireEvent.keyDown(carousel, { key: 'ArrowRight' });

            // Then go back
            fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });
    });

    describe('Touch Swipe', () => {
        it('handles touch start', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            fireEvent.touchStart(carousel, {
                targetTouches: [{ clientX: 200 }]
            });

            // Touch should be registered (no error)
            expect(carousel).toBeInTheDocument();
        });

        it('handles touch move', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            fireEvent.touchStart(carousel, {
                targetTouches: [{ clientX: 200 }]
            });

            fireEvent.touchMove(carousel, {
                targetTouches: [{ clientX: 100 }]
            });

            expect(carousel).toBeInTheDocument();
        });

        it('advances slide on left swipe', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            // Simulate left swipe (start at 200, end at 100)
            fireEvent.touchStart(carousel, {
                targetTouches: [{ clientX: 200 }]
            });
            fireEvent.touchMove(carousel, {
                targetTouches: [{ clientX: 100 }]
            });
            fireEvent.touchEnd(carousel);

            expect(screen.getByText(/2 \/ /)).toBeInTheDocument();
        });

        it('goes to previous slide on right swipe', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            // First advance one slide
            fireEvent.click(screen.getByLabelText('Next service'));
            expect(screen.getByText(/2 \/ /)).toBeInTheDocument();

            // Simulate right swipe (start at 100, end at 200)
            fireEvent.touchStart(carousel, {
                targetTouches: [{ clientX: 100 }]
            });
            fireEvent.touchMove(carousel, {
                targetTouches: [{ clientX: 200 }]
            });
            fireEvent.touchEnd(carousel);

            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });

        it('does nothing on small swipe', () => {
            renderWithProviders();

            const carousel = screen.getByRole('region', { name: /carousel/i });

            // Small swipe (less than minSwipeDistance of 50)
            fireEvent.touchStart(carousel, {
                targetTouches: [{ clientX: 200 }]
            });
            fireEvent.touchMove(carousel, {
                targetTouches: [{ clientX: 180 }]
            });
            fireEvent.touchEnd(carousel);

            // Should still be on slide 1
            expect(screen.getByText(/1 \/ /)).toBeInTheDocument();
        });
    });

    describe('Reduced Motion', () => {
        it('respects prefersReducedMotion preference', () => {
            mockPrefersReducedMotion.mockReturnValue(true);
            renderWithProviders();

            // Should still render without errors
            expect(screen.getByText('My Services')).toBeInTheDocument();
        });
    });
});

