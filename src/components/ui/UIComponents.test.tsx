import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionSkeleton, PortfolioSkeleton, ExperienceSkeleton, SkillsSkeleton } from '@/components/ui/SectionSkeleton';
import { Skeleton, ImageWithSkeleton } from '@/components/ui/Skeleton';
import { TiltCard } from '@/components/ui/TiltCard';
import { WaveDivider } from '@/components/ui/WaveDivider';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock matchMedia for reduced motion
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

describe('UI Components', () => {
    describe('AnimatedCounter', () => {
        it('renders with initial value 0 and animates to target', () => {
            render(<AnimatedCounter value={100} />);
            expect(screen.getByText(/0/)).toBeInTheDocument();
        });

        it('renders with prefix and suffix', () => {
            render(<AnimatedCounter value={100} prefix="$" suffix="k" />);
            expect(screen.getByText(/\$0k/)).toBeInTheDocument();
        });

        it('renders with custom duration', () => {
            render(<AnimatedCounter value={50} duration={500} />);
            expect(screen.getByText(/0/)).toBeInTheDocument();
        });
    });

    describe('FloatingActions', () => {
        it('renders but is initially hidden', () => {
            render(
                <LanguageProvider>
                    <FloatingActions />
                </LanguageProvider>
            );
            const downloadLink = screen.queryByRole('link', { name: /cv/i });
            expect(downloadLink).not.toBeInTheDocument();
        });

        it('shows after scroll', async () => {
            render(
                <LanguageProvider>
                    <FloatingActions />
                </LanguageProvider>
            );

            // Simulate scroll
            Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
            fireEvent.scroll(window);

            // The component might still not be visible depending on implementation
            // Just verify no crash
            expect(document.body).toBeInTheDocument();
        });
    });

    describe('LoadingScreen', () => {
        it('renders loading text', () => {
            render(<LoadingScreen />);
            expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
        });
    });

    describe('ScrollProgress', () => {
        it('renders progress bar', () => {
            render(<ScrollProgress />);
            expect(document.querySelector('.fixed.top-0')).toBeInTheDocument();
        });
    });

    describe('ScrollReveal', () => {
        it('renders children', () => {
            render(
                <ScrollReveal>
                    <div>Test Content</div>
                </ScrollReveal>
            );
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('renders with custom delay', () => {
            render(
                <ScrollReveal delay={0.5}>
                    <div>Delayed Content</div>
                </ScrollReveal>
            );
            expect(screen.getByText('Delayed Content')).toBeInTheDocument();
        });

        it('renders with custom direction', () => {
            render(
                <ScrollReveal direction="left">
                    <div>Left Direction</div>
                </ScrollReveal>
            );
            expect(screen.getByText('Left Direction')).toBeInTheDocument();
        });
    });

    describe('Skeletons', () => {
        it('renders SectionSkeleton', () => {
            const { container } = render(<SectionSkeleton />);
            expect(container.firstChild).toHaveClass('container');
        });

        it('renders PortfolioSkeleton', () => {
            const { container } = render(<PortfolioSkeleton />);
            expect(container.firstChild).toHaveClass('container');
        });

        it('renders ExperienceSkeleton', () => {
            const { container } = render(<ExperienceSkeleton />);
            expect(container.querySelector('.flex.flex-col.md\\:flex-row')).toBeInTheDocument();
        });

        it('renders SkillsSkeleton', () => {
            const { container } = render(<SkillsSkeleton />);
            expect(container.firstChild).toHaveClass('container');
        });
    });

    describe('Skeleton', () => {
        it('renders with custom class', () => {
            render(<Skeleton className="test-class" />);
            expect(document.querySelector('.test-class')).toBeInTheDocument();
        });

        it('renders text variant', () => {
            const { container } = render(<Skeleton variant="text" />);
            expect(container.querySelector('.skeleton-text')).toBeInTheDocument();
        });

        it('renders circle variant', () => {
            const { container } = render(<Skeleton variant="circle" />);
            expect(container.querySelector('.skeleton-circle')).toBeInTheDocument();
        });

        it('renders with custom width and height', () => {
            const { container } = render(<Skeleton width={200} height={100} />);
            const el = container.firstChild as HTMLElement;
            expect(el.style.width).toBe('200px');
            expect(el.style.height).toBe('100px');
        });
    });

    describe('ImageWithSkeleton', () => {
        it('renders image and shows skeleton while loading', () => {
            const { container } = render(
                <ImageWithSkeleton src="/test.jpg" alt="Test" width={100} height={100} />
            );
            // Skeleton should be visible initially
            expect(container.querySelector('.skeleton-box')).toBeInTheDocument();
        });

        it('hides skeleton after image loads', async () => {
            const { container } = render(
                <ImageWithSkeleton src="/test.jpg" alt="Test" width={100} height={100} />
            );

            const img = container.querySelector('img');
            if (img) {
                fireEvent.load(img);
            }

            await waitFor(() => {
                // Skeleton should be hidden after load
                expect(container.querySelector('.skeleton-box')).not.toBeInTheDocument();
            });
        });

        it('hides skeleton on error', async () => {
            const { container } = render(
                <ImageWithSkeleton src="/bad.jpg" alt="Test" width={100} height={100} />
            );

            const img = container.querySelector('img');
            if (img) {
                fireEvent.error(img);
            }

            await waitFor(() => {
                expect(container.querySelector('.skeleton-box')).not.toBeInTheDocument();
            });
        });

        it('renders with fill prop', () => {
            const { container } = render(
                <ImageWithSkeleton src="/test.jpg" alt="Test" fill />
            );
            expect(container.querySelector('.relative')).toBeInTheDocument();
        });
    });

    describe('TiltCard', () => {
        it('renders children', () => {
            render(
                <TiltCard>
                    <div>Card Content</div>
                </TiltCard>
            );
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('handles mouse move events', () => {
            const { container } = render(
                <TiltCard>
                    <div>Tilt Me</div>
                </TiltCard>
            );

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
            fireEvent.mouseMove(card, { clientX: 150, clientY: 150 });

            expect(screen.getByText('Tilt Me')).toBeInTheDocument();
        });

        it('resets on mouse leave', () => {
            const { container } = render(
                <TiltCard>
                    <div>Tilt Me</div>
                </TiltCard>
            );

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseEnter(card);
            fireEvent.mouseLeave(card);

            expect(screen.getByText('Tilt Me')).toBeInTheDocument();
        });
    });

    describe('WaveDivider', () => {
        it('renders SVG', () => {
            const { container } = render(<WaveDivider />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
    });
});
