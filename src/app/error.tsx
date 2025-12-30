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
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <h2 className="text-3xl font-bold font-outfit">Something went wrong!</h2>
                <p className="text-secondary-foreground mb-4">
                    An unexpected error occurred in this section.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}
