import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExperimentProvider, useExperiment } from './ExperimentContext';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
    track: jest.fn(),
}));

import { track } from '@vercel/analytics';

// Test component that uses the hook
function TestComponent({ experimentId = 'test-experiment' }) {
    const { getVariant, assignments } = useExperiment();
    const variant = getVariant(experimentId, ['control', 'variant-a', 'variant-b']);

    return (
        <div>
            <span data-testid="variant">{variant}</span>
            <span data-testid="assignments">{JSON.stringify(assignments)}</span>
        </div>
    );
}

function TestWithButton() {
    const { getVariant } = useExperiment();
    const [variant, setVariant] = React.useState<string | null>(null);

    const handleClick = () => {
        setVariant(getVariant('click-experiment', ['a', 'b']));
    };

    return (
        <div>
            <button onClick={handleClick}>Get Variant</button>
            {variant && <span data-testid="result">{variant}</span>}
        </div>
    );
}

describe('ExperimentContext', () => {
    const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: jest.fn((key: string) => store[key] || null),
            setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
            removeItem: jest.fn((key: string) => { delete store[key]; }),
            clear: jest.fn(() => { store = {}; }),
        };
    })();

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            configurable: true
        });
    });

    it('provides experiment context to children', () => {
        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        expect(screen.getByTestId('variant')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        render(
            <ExperimentProvider>
                <div data-testid="child">Child Content</div>
            </ExperimentProvider>
        );

        expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('assigns a variant from available options', () => {
        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        const variant = screen.getByTestId('variant').textContent;
        expect(['control', 'variant-a', 'variant-b']).toContain(variant);
    });

    it('returns consistent variant for same experiment', async () => {
        render(
            <ExperimentProvider>
                <TestWithButton />
            </ExperimentProvider>
        );

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(screen.getByTestId('result')).toBeInTheDocument();
        });

        const firstVariant = screen.getByTestId('result').textContent;

        // Click again - should get same variant
        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('result').textContent).toBe(firstVariant);
    });

    it('loads assignments from localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce(
            JSON.stringify({ 'test-experiment': 'variant-a' })
        );

        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        expect(localStorageMock.getItem).toHaveBeenCalledWith('experiment-assignments');
    });

    it('persists assignments to localStorage', async () => {
        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        // Wait for effects to run
        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
    });

    it('tracks experiment exposure', () => {
        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        expect(track).toHaveBeenCalledWith('experiment_exposure', expect.objectContaining({
            experiment_id: 'test-experiment',
            variant_id: expect.any(String),
        }));
    });

    it('returns control for empty variants array', () => {
        function EmptyVariantsTest() {
            const { getVariant } = useExperiment();
            const variant = getVariant('empty-test', []);
            return <span data-testid="empty-variant">{variant}</span>;
        }

        render(
            <ExperimentProvider>
                <EmptyVariantsTest />
            </ExperimentProvider>
        );

        expect(screen.getByTestId('empty-variant')).toHaveTextContent('control');
    });

    it('handles localStorage errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        localStorageMock.getItem.mockImplementationOnce(() => {
            throw new Error('Storage error');
        });

        render(
            <ExperimentProvider>
                <TestComponent />
            </ExperimentProvider>
        );

        // Should still render without crashing
        expect(screen.getByTestId('variant')).toBeInTheDocument();
        consoleSpy.mockRestore();
    });

    it('throws error when useExperiment is used outside provider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useExperiment must be used within an ExperimentProvider');

        consoleSpy.mockRestore();
    });

    it('exports provider and hook', () => {
        expect(ExperimentProvider).toBeDefined();
        expect(useExperiment).toBeDefined();
    });
});
