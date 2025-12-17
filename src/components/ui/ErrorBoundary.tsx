'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showError?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Reusable Error Boundary component for catching JavaScript errors
 * in component trees and displaying a fallback UI.
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Render custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-secondary/20 border border-destructive/20">
                    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-sm text-secondary-foreground text-center mb-4 max-w-sm">
                        An error occurred while rendering this section. Please try again.
                    </p>
                    {this.props.showError && this.state.error && (
                        <div className="text-xs bg-secondary/30 p-3 rounded-lg mb-4 font-mono text-secondary-foreground overflow-auto max-w-full">
                            {this.state.error.message}
                        </div>
                    )}
                    <Button
                        onClick={this.handleReset}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component to wrap a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
