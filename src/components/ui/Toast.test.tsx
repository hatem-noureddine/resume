import { render, screen, act } from '@testing-library/react';
import { Toast } from './Toast';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    CheckCircle: ({ className }: { className?: string }) => <span className={className}>✓</span>,
    AlertCircle: ({ className }: { className?: string }) => <span className={className}>⚠</span>,
    Info: ({ className }: { className?: string }) => <span className={className}>ℹ</span>,
}));

describe('Toast', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders when isVisible is true', () => {
        const onClose = jest.fn();
        render(<Toast message="Hello Toast" isVisible={true} onClose={onClose} type="success" />);
        expect(screen.getByText('Hello Toast')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
        const onClose = jest.fn();
        render(<Toast message="Hello Toast" isVisible={false} onClose={onClose} type="success" />);
        expect(screen.queryByText('Hello Toast')).not.toBeInTheDocument();
    });

    it('renders success toast with correct styling', () => {
        const onClose = jest.fn();
        const { container } = render(<Toast message="Success" isVisible={true} onClose={onClose} type="success" />);
        expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('renders error toast with correct styling', () => {
        const onClose = jest.fn();
        const { container } = render(<Toast message="Error" isVisible={true} onClose={onClose} type="error" />);
        expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    });

    it('renders info toast with correct styling', () => {
        const onClose = jest.fn();
        const { container } = render(<Toast message="Info" isVisible={true} onClose={onClose} type="info" />);
        expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
    });

    it('calls onClose after duration', () => {
        const onClose = jest.fn();
        render(<Toast message="Test" isVisible={true} onClose={onClose} duration={2000} />);

        expect(onClose).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(onClose).toHaveBeenCalled();
    });

    it('uses default duration of 4000ms', () => {
        const onClose = jest.fn();
        render(<Toast message="Test" isVisible={true} onClose={onClose} />);

        act(() => {
            jest.advanceTimersByTime(3900);
        });
        expect(onClose).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(onClose).toHaveBeenCalled();
    });

    it('defaults to success type', () => {
        const onClose = jest.fn();
        const { container } = render(<Toast message="Default" isVisible={true} onClose={onClose} />);
        expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('renders correct icon for each type', () => {
        const onClose = jest.fn();

        const { rerender } = render(<Toast message="Success" isVisible={true} onClose={onClose} type="success" />);
        expect(screen.getByText('✓')).toBeInTheDocument();

        rerender(<Toast message="Error" isVisible={true} onClose={onClose} type="error" />);
        expect(screen.getByText('⚠')).toBeInTheDocument();

        rerender(<Toast message="Info" isVisible={true} onClose={onClose} type="info" />);
        expect(screen.getByText('ℹ')).toBeInTheDocument();
    });
});

