import { render, screen, act } from '@testing-library/react';
import { LoadingScreen } from './LoadingScreen';

// Mock Logo component
jest.mock('@/components/ui/Logo', () => ({
    Logo: ({ className }: { className?: string }) => (
        <div className={className} data-testid="logo">HN</div>
    ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string; 'data-testid'?: string }>) => (
            <div className={className} data-testid={props['data-testid']} {...props}>{children}</div>
        ),
        p: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <p className={className} {...props}>{children}</p>
        ),
        span: ({ children, ...props }: React.PropsWithChildren) => (
            <span {...props}>{children}</span>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('LoadingScreen', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders loading screen initially', () => {
        render(<LoadingScreen />);
        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    it('shows logo', () => {
        render(<LoadingScreen />);
        expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('shows loading text', () => {
        render(<LoadingScreen />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('hides after minDuration', () => {
        render(<LoadingScreen minDuration={1000} />);

        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1100);
        });

        // Loading screen should be gone after duration
        expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    it('uses default minDuration of 1500ms', () => {
        render(<LoadingScreen />);

        act(() => {
            jest.advanceTimersByTime(1400);
        });

        // Still visible before default duration
        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(200);
        });

        // Gone after default duration
        expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });
});
