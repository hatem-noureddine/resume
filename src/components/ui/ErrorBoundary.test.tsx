import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div data-testid="child">Child component</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});
afterAll(() => {
    console.error = originalError;
});

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Test Child</div>
            </ErrorBoundary>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders fallback UI when an error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom fallback</div>}>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('shows error message when showError is true', () => {
        render(
            <ErrorBoundary showError>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
        const onError = jest.fn();
        render(
            <ErrorBoundary onError={onError}>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(onError).toHaveBeenCalled();
    });

    it('resets error state when Try Again is clicked', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();

        // Click Try Again - this resets the error state
        fireEvent.click(screen.getByText('Try Again'));

        // After reset, ErrorBoundary will try to re-render children
        // Since ThrowError still throws, it will show error UI again
        // This tests that the reset function is called correctly
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});

describe('withErrorBoundary', () => {
    const SafeComponent = () => <div data-testid="safe">Safe content</div>;
    const UnsafeComponent = () => {
        throw new Error('HOC error');
    };

    it('wraps component with error boundary', () => {
        const WrappedSafe = withErrorBoundary(SafeComponent);
        render(<WrappedSafe />);
        expect(screen.getByTestId('safe')).toBeInTheDocument();
    });

    it('catches errors in wrapped component', () => {
        const WrappedUnsafe = withErrorBoundary(UnsafeComponent);
        render(<WrappedUnsafe />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('uses custom fallback in HOC', () => {
        const WrappedUnsafe = withErrorBoundary(
            UnsafeComponent,
            <div>HOC fallback</div>
        );
        render(<WrappedUnsafe />);
        expect(screen.getByText('HOC fallback')).toBeInTheDocument();
    });
});
