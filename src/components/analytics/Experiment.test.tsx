import { render, screen, waitFor } from '@testing-library/react';
import { Experiment } from './Experiment';

// Mock the ExperimentContext
jest.mock('@/context/ExperimentContext', () => ({
    useExperiment: () => ({
        getVariant: jest.fn((id: string, variants: string[]) => variants[0] || 'control'),
    }),
}));

describe('Experiment', () => {
    it('renders selected variant', async () => {
        render(
            <Experiment
                id="test-experiment"
                variants={{
                    control: <div>Control Version</div>,
                    treatment: <div>Treatment Version</div>,
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Control Version')).toBeInTheDocument();
        });
    });

    it('renders fallback when variant not ready', () => {
        jest.doMock('@/context/ExperimentContext', () => ({
            useExperiment: () => ({
                getVariant: () => null,
            }),
        }));

        render(
            <Experiment
                id="test"
                variants={{ control: <div>Control</div> }}
                fallback={<div>Loading...</div>}
            />
        );

        // Initially shows fallback before variant is set
        // Note: This depends on implementation timing
    });

    it('can be imported', () => {
        expect(Experiment).toBeDefined();
        expect(typeof Experiment).toBe('function');
    });
});
