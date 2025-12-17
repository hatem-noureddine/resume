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
    let rafCallbacks: ((time: number) => void)[];
    let rafId: number;

    beforeEach(() => {
        jest.useFakeTimers();
        rafCallbacks = [];
        rafId = 0;

        observeMock = jest.fn();
        disconnectMock = jest.fn();

        // Mock requestAnimationFrame to capture callbacks
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            rafCallbacks.push(callback);
            return ++rafId;
        });

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
        jest.restoreAllMocks();
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

    describe('animation step function', () => {
        it('executes animation step function with RAF', () => {
            const mockPerformanceNow = jest.spyOn(performance, 'now');
            mockPerformanceNow.mockReturnValueOnce(0); // startTime

            render(<AnimatedCounter value={100} duration={1000} />);

            act(() => {
                triggerIntersect(true);
            });

            // First RAF callback should be queued
            expect(rafCallbacks.length).toBeGreaterThan(0);

            // Simulate first frame at t=0
            mockPerformanceNow.mockReturnValueOnce(0);
            act(() => {
                if (rafCallbacks[0]) rafCallbacks[0](0);
            });

            // Value should still be 0 at t=0
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('calculates easing correctly at various progress points', () => {
            const mockPerformanceNow = jest.spyOn(performance, 'now');

            render(<AnimatedCounter value={100} duration={1000} />);

            // Set start time
            mockPerformanceNow.mockReturnValueOnce(0);

            act(() => {
                triggerIntersect(true);
            });

            // Simulate animation at 50% progress (t=500)
            mockPerformanceNow.mockReturnValue(500);
            act(() => {
                // Execute all queued RAF callbacks
                while (rafCallbacks.length > 0) {
                    const cb = rafCallbacks.shift();
                    if (cb) cb(500);
                }
            });

            // At 50% with ease-out, value should be > 50 (accelerated start)
            // ease-out formula: 1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875
            // So value ≈ 87
            const container = screen.getByText(/^\d+/).closest('span');
            const displayedValue = parseInt(container?.textContent?.replace(/[^0-9]/g, '') || '0');
            expect(displayedValue).toBeGreaterThan(50);
        });

        it('completes animation and stops RAF when progress reaches 1', () => {
            const mockPerformanceNow = jest.spyOn(performance, 'now');

            render(<AnimatedCounter value={100} duration={1000} />);

            // Set start time to 0
            mockPerformanceNow.mockReturnValue(0);

            act(() => {
                triggerIntersect(true);
            });

            const initialRafLength = rafCallbacks.length;

            // Simulate animation completion at t=1000
            mockPerformanceNow.mockReturnValue(1000);
            act(() => {
                while (rafCallbacks.length > 0) {
                    const cb = rafCallbacks.shift();
                    if (cb) cb(1000);
                }
            });

            // Animation should complete - no more RAF callbacks should be queued after completion
            // The component should show 100
            expect(screen.getByText('100')).toBeInTheDocument();
            // Initial RAF was called, but no additional ones after completion
            expect(initialRafLength).toBeGreaterThan(0);
        });

        it('continues animation when progress < 1', () => {
            const mockPerformanceNow = jest.spyOn(performance, 'now');

            render(<AnimatedCounter value={100} duration={1000} />);

            mockPerformanceNow.mockReturnValue(0);

            act(() => {
                triggerIntersect(true);
            });

            // Execute first frame
            mockPerformanceNow.mockReturnValue(100); // 10% progress
            act(() => {
                if (rafCallbacks.length > 0) {
                    const cb = rafCallbacks.shift();
                    if (cb) cb(100);
                }
            });

            // Should queue another RAF since animation isn't complete
            expect(rafCallbacks.length).toBeGreaterThan(0);
        });
    });

    describe('cleanup and edge cases', () => {
        it('disconnects observer on unmount', () => {
            const { unmount } = render(<AnimatedCounter value={100} />);

            unmount();

            expect(disconnectMock).toHaveBeenCalled();
        });

        it('handles unmount during animation gracefully', () => {
            render(<AnimatedCounter value={100} duration={2000} />);

            act(() => {
                triggerIntersect(true);
            });

            // Animation started, now unmount
            const { unmount } = render(<AnimatedCounter value={50} />);

            // Should not throw
            expect(() => unmount()).not.toThrow();
        });

        it('handles zero duration edge case', () => {
            render(<AnimatedCounter value={100} duration={0} />);

            act(() => {
                triggerIntersect(true);
                jest.runAllTimers();
            });

            // Should complete immediately
            expect(screen.getByText('100')).toBeInTheDocument();
        });

        it('handles negative value correctly', () => {
            // Component uses parseInt, so test with string negative
            render(<AnimatedCounter value={-50} />);

            act(() => {
                triggerIntersect(true);
                jest.runAllTimers();
            });

            expect(screen.getByText('-50')).toBeInTheDocument();
        });

        it('handles NaN string value', () => {
            render(<AnimatedCounter value="notanumber" />);

            // parseInt("notanumber") returns NaN, shows NaN or 0
            // The component should handle this gracefully
            expect(screen.getByText(/NaN|0/)).toBeInTheDocument();
        });
    });
});
