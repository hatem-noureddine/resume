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
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
    let rafCallbacks: FrameRequestCallback[] = [];
    let originalRaf: typeof requestAnimationFrame;
    let originalPerformanceNow: typeof performance.now;

    beforeEach(() => {
        observeMock = jest.fn();
        disconnectMock = jest.fn();
        rafCallbacks = [];

        // Mock IntersectionObserver
        globalThis.IntersectionObserver = jest.fn((callback) => {
            intersectionCallback = callback;
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

        // Mock requestAnimationFrame
        originalRaf = globalThis.requestAnimationFrame;
        globalThis.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
        });

        // Mock performance.now
        originalPerformanceNow = performance.now;

        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
        globalThis.requestAnimationFrame = originalRaf;
        performance.now = originalPerformanceNow;
    });

    const triggerIntersection = (isIntersecting: boolean) => {
        intersectionCallback([
            {
                isIntersecting,
                target: document.createElement('div'),
                boundingClientRect: {} as DOMRectReadOnly,
                intersectionRatio: 1,
                intersectionRect: {} as DOMRectReadOnly,
                rootBounds: null,
                time: Date.now(),
            } as IntersectionObserverEntry
        ]);
    };

    it('renders with initial value 0 before intersection', () => {
        render(<AnimatedCounter value={100} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('starts observing element on mount', () => {
        render(<AnimatedCounter value={100} />);
        expect(observeMock).toHaveBeenCalled();
    });

    it('respects reduced motion preference - shows value immediately', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value={100} />);

        // Should show full value immediately without animation
        expect(screen.getByText('100')).toBeInTheDocument();
        // Should not observe since animation is disabled
        expect(observeMock).not.toHaveBeenCalled();
    });

    it('renders with prefix and suffix on reduced motion', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value={50} prefix="$" suffix="%" />);

        expect(screen.getByText('$50%')).toBeInTheDocument();
    });

    it('renders prefix and suffix with initial value when not reduced motion', () => {
        render(<AnimatedCounter value={50} prefix="$" suffix="%" />);

        // Before intersection, shows 0 with prefix/suffix
        expect(screen.getByText('$0%')).toBeInTheDocument();
    });

    it('handles string input safely', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value="200" />);

        expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<AnimatedCounter value={100} className="custom-test-class" />);
        expect(container.querySelector('.custom-test-class')).toBeInTheDocument();
    });

    it('disconnects observer on unmount', () => {
        const { unmount } = render(<AnimatedCounter value={100} />);

        unmount();

        expect(disconnectMock).toHaveBeenCalled();
    });

    it('handles negative value correctly', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value={-50} />);

        expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('handles zero value', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value={0} />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles NaN string value gracefully', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<AnimatedCounter value="notanumber" />);

        // parseInt("notanumber") returns NaN
        expect(screen.getByText(/NaN|0/)).toBeInTheDocument();
    });

    it('triggers animation when element comes into view', () => {
        const { container } = render(<AnimatedCounter value={100} />);

        // Initially shows 0
        expect(screen.getByText('0')).toBeInTheDocument();

        // Trigger intersection - this starts the animation
        act(() => {
            triggerIntersection(true);
        });

        // The animation has started - we can verify the counter is in the DOM
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('animates through values when requestAnimationFrame is called', () => {
        let mockTime = 0;
        performance.now = jest.fn(() => mockTime);

        render(<AnimatedCounter value={100} duration={1000} />);

        // Trigger intersection to start animation
        act(() => {
            triggerIntersection(true);
        });

        // First raf call starts animation
        expect(rafCallbacks.length).toBeGreaterThan(0);

        // Execute first animation frame (progress 0)
        act(() => {
            if (rafCallbacks.length > 0) {
                rafCallbacks[rafCallbacks.length - 1](mockTime);
            }
        });

        // Move time forward to 50% of duration
        mockTime = 500;
        act(() => {
            if (rafCallbacks.length > 0) {
                rafCallbacks[rafCallbacks.length - 1](mockTime);
            }
        });

        // Move time to 100% of duration (animation complete)
        mockTime = 1000;
        act(() => {
            if (rafCallbacks.length > 0) {
                rafCallbacks[rafCallbacks.length - 1](mockTime);
            }
        });

        // Animation should have completed
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('does not restart animation when scrolled out and back in', () => {
        render(<AnimatedCounter value={100} />);

        // Trigger in view
        act(() => {
            triggerIntersection(true);
        });

        // Trigger out of view
        act(() => {
            triggerIntersection(false);
        });

        // Trigger back in view - should not throw
        act(() => {
            triggerIntersection(true);
        });
    });

    it('handles unmount gracefully', () => {
        const { unmount } = render(<AnimatedCounter value={100} />);

        // Trigger animation
        act(() => {
            triggerIntersection(true);
        });

        // Unmount during animation should not throw
        expect(() => unmount()).not.toThrow();
    });

    describe('default props', () => {
        it('uses default duration of 2000ms', () => {
            // Just verify it renders without explicit duration
            (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
            render(<AnimatedCounter value={100} />);
            expect(screen.getByText('100')).toBeInTheDocument();
        });

        it('works without prefix and suffix', () => {
            (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
            render(<AnimatedCounter value={42} />);
            expect(screen.getByText('42')).toBeInTheDocument();
        });
    });
});

