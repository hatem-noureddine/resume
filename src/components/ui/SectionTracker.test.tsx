import { render } from '@testing-library/react';
import { track } from '@vercel/analytics';

// Unmock SectionTracker so we test the real component
jest.unmock('@/components/ui/SectionTracker');
import { SectionTracker } from './SectionTracker';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
    track: jest.fn(),
}));

describe('SectionTracker', () => {
    let intersectionCallback: (entries: any[]) => void;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock IntersectionObserver to capture the callback
        globalThis.IntersectionObserver = jest.fn().mockImplementation((callback) => {
            intersectionCallback = callback;
            return {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders children correctly', () => {
        const { getByText } = render(
            <SectionTracker sectionId="test-section">
                <div>Test Child</div>
            </SectionTracker>
        );
        expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('tracks event after being visible for 2 seconds', () => {
        render(
            <SectionTracker sectionId="test-section">
                <div>Test Child</div>
            </SectionTracker>
        );

        // Simulate intersection entering viewport
        intersectionCallback([{ isIntersecting: true }]);

        // Fast-forward 1.9 seconds - should not have tracked yet
        jest.advanceTimersByTime(1900);
        expect(track).not.toHaveBeenCalled();

        // Fast-forward another 200ms (total 2.1s) - should have tracked
        jest.advanceTimersByTime(200);
        expect(track).toHaveBeenCalledWith('section_view', expect.objectContaining({
            section_id: 'test-section'
        }));
    });

    it('does not track if section leaves viewport before 2 seconds', () => {
        render(
            <SectionTracker sectionId="test-section">
                <div>Test Child</div>
            </SectionTracker>
        );

        // Enter viewport
        intersectionCallback([{ isIntersecting: true }]);
        jest.advanceTimersByTime(1000);

        // Leave viewport
        intersectionCallback([{ isIntersecting: false }]);
        jest.advanceTimersByTime(2000);

        expect(track).not.toHaveBeenCalled();
    });

    it('only tracks once per mount', () => {
        render(
            <SectionTracker sectionId="test-section">
                <div>Test Child</div>
            </SectionTracker>
        );

        // First view
        intersectionCallback([{ isIntersecting: true }]);
        jest.advanceTimersByTime(2100);
        expect(track).toHaveBeenCalledTimes(1);

        // Second view (exit then re-enter)
        intersectionCallback([{ isIntersecting: false }]);
        intersectionCallback([{ isIntersecting: true }]);
        jest.advanceTimersByTime(2100);

        expect(track).toHaveBeenCalledTimes(1);
    });

    it('cleans up timer and observer on unmount', () => {
        const { unmount } = render(
            <SectionTracker sectionId="test-section">
                <div>Test Child</div>
            </SectionTracker>
        );

        const disconnectMock = (globalThis.IntersectionObserver as jest.Mock).mock.results[0].value.disconnect;

        unmount();
        expect(disconnectMock).toHaveBeenCalled();
    });
});
