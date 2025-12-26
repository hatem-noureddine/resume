// Unmock to test the real implementation
jest.unmock('@/context/AnnouncerContext');

import { render, screen, act } from '@testing-library/react';
import { AnnouncerProvider, useAnnouncer } from './AnnouncerContext';

// Test component that uses the announcer
function TestAnnouncer() {
    const { announce } = useAnnouncer();

    return (
        <div>
            <button onClick={() => announce("Polite message")}>
                Announce Polite
            </button>
            <button onClick={() => announce("Assertive message", "assertive")}>
                Announce Assertive
            </button>
        </div>
    );
}

describe('AnnouncerContext', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the provider with children', () => {
        render(
            <AnnouncerProvider>
                <div data-testid="child">Child content</div>
            </AnnouncerProvider>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders ARIA live regions', () => {
        render(
            <AnnouncerProvider>
                <div>Test</div>
            </AnnouncerProvider>
        );

        // Check for polite region
        const politeRegion = document.querySelector('[role="status"]');
        expect(politeRegion).toBeInTheDocument();
        expect(politeRegion).toHaveAttribute('aria-live', 'polite');

        // Check for assertive region
        const assertiveRegion = document.querySelector('[role="alert"]');
        expect(assertiveRegion).toBeInTheDocument();
        expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');
    });

    it('announces polite messages', async () => {
        render(
            <AnnouncerProvider>
                <TestAnnouncer />
            </AnnouncerProvider>
        );

        const button = screen.getByText('Announce Polite');
        button.click();

        // Wait for the setTimeout in the announce function
        act(() => {
            jest.advanceTimersByTime(100);
        });

        const politeRegion = document.querySelector('[role="status"]');
        expect(politeRegion).toHaveTextContent('Polite message');
    });

    it('announces assertive messages', async () => {
        render(
            <AnnouncerProvider>
                <TestAnnouncer />
            </AnnouncerProvider>
        );

        const button = screen.getByText('Announce Assertive');
        button.click();

        act(() => {
            jest.advanceTimersByTime(100);
        });

        const assertiveRegion = document.querySelector('[role="alert"]');
        expect(assertiveRegion).toHaveTextContent('Assertive message');
    });

    it('throws error when useAnnouncer is used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestAnnouncer />);
        }).toThrow('useAnnouncer must be used within an AnnouncerProvider');

        consoleSpy.mockRestore();
    });
});
