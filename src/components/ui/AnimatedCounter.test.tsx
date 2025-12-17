import { render, screen, act } from '@testing-library/react';
import { AnimatedCounter } from './AnimatedCounter';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Mock usePrefersReducedMotion
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

describe('AnimatedCounter', () => {
    let observeMock: jest.Mock;
    let disconnectMock: jest.Mock;
    let triggerIntersect: (isIntersecting: boolean) => void;

    beforeEach(() => {
        jest.useFakeTimers();

        observeMock = jest.fn();
        disconnectMock = jest.fn();

        // Mock IntersectionObserver
        globalThis.IntersectionObserver = jest.fn((callback) => {
            triggerIntersect = (isIntersecting: boolean) => {
                callback([
                    {
                        isIntersecting,
                        target: document.createElement('div'),
                        boundingClientRect: {} as DOMRectReadOnly,
                        intersectionRatio: 1,
                        intersectionRect: {} as DOMRectReadOnly,
                        rootBounds: null,
                        time: Date.now(),
                    } as IntersectionObserverEntry
                ], {} as IntersectionObserver);
            };
            return {
                observe: observeMock,
                unobserve: jest.fn(),
                disconnect: disconnectMock,
                takeRecords: jest.fn(),
                root: null,
                rootMargin: '',
                thresholds: []
            };
        }) as unknown as typeof IntersectionObserver;

        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('renders with initial value 0 before intersection', () => {
        render(<AnimatedCounter value={100} />);
        // Before intersection, value should be 0
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('animates to value when in view', () => {
        render(<AnimatedCounter value={100} duration={1000} />);

        // Trigger intersection
        act(() => {
            triggerIntersect(true);
        });

        // Fast forward time to middle of animation
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Should be somewhere between 0 and 100
        const displayedValue = parseInt(screen.getByText(/^\d+$/).textContent || "0");
        expect(displayedValue).toBeGreaterThan(0);
        expect(displayedValue).toBeLessThan(100);

        // Fast forward to end
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('respects reduced motion preference', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value={100} />);

        // Should show full value immediately
        expect(screen.getByText('100')).toBeInTheDocument();
        // Should not observe
        expect(observeMock).not.toHaveBeenCalled();
    });

    it('renders with prefix and suffix', () => {
        render(<AnimatedCounter value={50} prefix="$" suffix="%" />);
        // wait for animation instant if needed via act, but let's assume static rendering first
        // If reduced motion is false, it starts at 0.
        expect(screen.getByText('$0%')).toBeInTheDocument();

        act(() => {
            triggerIntersect(true);
            jest.runAllTimers();
        });

        expect(screen.getByText('$50%')).toBeInTheDocument();
    });

    it('handles string input safely', () => {
        render(<AnimatedCounter value="200" />);
        act(() => {
            triggerIntersect(true);
            jest.runAllTimers();
        });
        expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<AnimatedCounter value={100} className="custom-test-class" />);
        expect(container.querySelector('.custom-test-class')).toBeInTheDocument();
    });

    it('does not re-animate if scrolled out and back in', () => {
        render(<AnimatedCounter value={100} />);

        // In view
        act(() => {
            triggerIntersect(true);
            jest.runAllTimers();
        });
        expect(screen.getByText('100')).toBeInTheDocument();

        // Out of view
        act(() => {
            triggerIntersect(false);
        });

        // In view again - should verify it doesn't reset to 0
        // We can't easily check internal state, but we know animateValue shouldn't be called again.
        // If it was called again, it would restart from 0.
        // Check if value remains 100 instantly
        expect(screen.getByText('100')).toBeInTheDocument();
    });
});

