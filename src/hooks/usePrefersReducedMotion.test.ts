import { renderHook } from '@testing-library/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Mock matchMedia
const createMockMediaQuery = (matches: boolean) => {
    return jest.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
};

describe('usePrefersReducedMotion', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

    it('returns false when reduced motion is not preferred', () => {
        window.matchMedia = createMockMediaQuery(false);

        const { result } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
        window.matchMedia = createMockMediaQuery(true);

        const { result } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(true);
    });

    it('listens for media query changes', () => {
        const mockAddEventListener = jest.fn();
        const mockRemoveEventListener = jest.fn();

        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
            dispatchEvent: jest.fn(),
        }));

        const { unmount } = renderHook(() => usePrefersReducedMotion());

        expect(mockAddEventListener).toHaveBeenCalled();

        unmount();

        expect(mockRemoveEventListener).toHaveBeenCalled();
    });
});
