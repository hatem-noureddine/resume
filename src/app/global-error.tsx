'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground font-inter">
                <div className="text-center space-y-6 max-w-md">
                    <h2 className="text-3xl font-bold font-outfit">Something went wrong!</h2>
                    <p className="text-secondary-foreground mb-4">
                        We apologize for the inconvenience. An unexpected error occurred.
                    </p>
                    <div className="text-sm bg-secondary/20 p-4 rounded-lg overflow-auto max-h-40 text-left mb-6 font-mono border border-foreground/10">
                        {error.message || "Unknown error"}
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => reset()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Try again
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            className="border border-foreground/20 bg-transparent text-foreground hover:bg-secondary/20"
                        >
                            Go Home
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
