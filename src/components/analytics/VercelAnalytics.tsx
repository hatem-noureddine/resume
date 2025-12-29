"use client";

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';

/**
 * Vercel Analytics and Speed Insights components.
 * 
 * Only renders in production environments and skips localhost to avoid console errors.
 */
export function VercelAnalytics() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, []);

    if (!mounted) return null;

    const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    if (process.env.NODE_ENV !== "production" || isLocalhost) return null;

    return (
        <>
            <Analytics />
            <SpeedInsights />
        </>
    );
}
