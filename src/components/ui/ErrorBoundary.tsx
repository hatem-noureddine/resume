'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child 
 * component tree, logs those errors, and displays a fallback UI instead of 
 * the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`ErrorBoundary caught an error in [${this.props.name || 'Anonymous Section'}]:`, error, errorInfo);
    }

    private readonly handleReset = () => {
        this.setState({ hasError: false, error: null });
        globalThis.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div role="alert" className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center space-y-4 my-8">
                    <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                        <p className="text-secondary-foreground max-w-md mx-auto">
                            The section &quot;{this.props.name || 'Content'}&quot; failed to load. This might be a temporary issue.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={this.handleReset}
                        className="flex items-center gap-2"
                    >
                        <RefreshCcw size={16} />
                        Retry
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * A functional wrapper for ErrorBoundary.
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    boundaryName: string
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary name={boundaryName}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
