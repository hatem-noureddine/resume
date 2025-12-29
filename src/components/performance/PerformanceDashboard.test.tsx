import { render, screen, fireEvent, act } from '@testing-library/react';
import { PerformanceDashboard } from './PerformanceDashboard';
import * as webVitals from 'web-vitals';
import * as performanceStore from '@/lib/performance-store';
import { usePathname } from 'next/navigation';

jest.mock('web-vitals');
jest.mock('@/lib/performance-store');
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock URL and Blob for export
globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();
globalThis.Blob = class {
    constructor(content: any[], options: any) {
        return { content, options } as any;
    }
} as any;

describe('PerformanceDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (usePathname as jest.Mock).mockReturnValue('/');
        (performanceStore.getPerformanceHistory as jest.Mock).mockReturnValue({});
    });

    it('renders initial state correctly', () => {
        render(<PerformanceDashboard />);
        expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Measuring:')).toBeInTheDocument();
        // Initial cards
        expect(screen.getByText('LCP')).toBeInTheDocument();
        expect(screen.getByText('FCP')).toBeInTheDocument();
        expect(screen.getByText('CLS')).toBeInTheDocument();
    });

    it('runs a page test simulation', async () => {
        jest.useFakeTimers();
        render(<PerformanceDashboard />);

        const runBtn = screen.getByTitle('Re-run test');
        fireEvent.click(runBtn);

        // Should show progress bar
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        // Should eventually finish
        await act(async () => {
            jest.advanceTimersByTime(5000);
        });

        // Progress should reset
        await act(async () => {
            jest.advanceTimersByTime(2000);
        });

        jest.useRealTimers();
        expect(performanceStore.getPerformanceHistory).toHaveBeenCalled();
    });

    it('updates metrics when web-vitals report', async () => {
        render(<PerformanceDashboard />);

        const mockMetric = { name: 'LCP', value: 1200 };

        // Simulate web vital callback
        const onLCPMock = webVitals.onLCP as jest.Mock;
        // Verify mock was registered
        expect(onLCPMock).toHaveBeenCalled();

        // Execute callback
        const callback = onLCPMock.mock.calls[0][0];
        act(() => {
            callback(mockMetric);
        });

        expect(screen.getByText('1200ms')).toBeInTheDocument();
    });

    it('calculates overall score correctly', async () => {
        render(<PerformanceDashboard />);

        // Simulate good metrics
        const metrics = [
            { name: 'LCP', value: 100 }, // Good
            { name: 'CLS', value: 0 },   // Good
        ];

        act(() => {
            (webVitals.onLCP as jest.Mock).mock.calls[0][0](metrics[0]);
            (webVitals.onCLS as jest.Mock).mock.calls[0][0](metrics[1]);
        });

        // 100% score (2 good metrics)
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('toggles history view', () => {
        render(<PerformanceDashboard />);
        const historyBtn = screen.getByText('History');

        fireEvent.click(historyBtn);
        expect(screen.getByText('Metric History for /')).toBeInTheDocument();

        fireEvent.click(historyBtn);
        expect(screen.queryByText('Metric History for /')).not.toBeInTheDocument();
    });

    it('exports to JSON', () => {
        render(<PerformanceDashboard />);
        const jsonBtn = screen.getByText('JSON');
        fireEvent.click(jsonBtn);
        expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    it('handles iframe messages', async () => {
        render(<PerformanceDashboard />);

        const messageEvent = new MessageEvent('message', {
            data: {
                type: 'PERFORMANCE_METRIC',
                pathname: '/',
                metric: { name: 'LCP', value: 1500 }
            },
            origin: window.location.origin
        });

        act(() => {
            window.dispatchEvent(messageEvent);
        });

        expect(screen.getByText('1500ms')).toBeInTheDocument();
    });
});
