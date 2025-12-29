"use client";

import { useEffect, useCallback } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { usePathname } from "next/navigation";
import { savePerformanceSnapshot } from "@/lib/performance-store";

const VITALS_TO_REPORT = new Set(['CLS', 'FCP', 'INP', 'LCP', 'TTFB']);

export function PerformanceReporter() {
    const pathname = usePathname();

    const handleMetric = useCallback((metric: Metric) => {
        if (!VITALS_TO_REPORT.has(metric.name)) return;

        // Save current metrics
        savePerformanceSnapshot(pathname, { [metric.name]: metric.value }, null);

        // Notify parent if we are in an iframe (e.g., being measured by the dashboard)
        if (typeof globalThis.window !== 'undefined' && globalThis.window !== globalThis.window.parent) {
            globalThis.window.parent.postMessage({
                type: 'PERFORMANCE_METRIC',
                metric: {
                    name: metric.name,
                    value: metric.value,
                    rating: metric.rating
                },
                pathname
            }, globalThis.window.location.origin);
        }
    }, [pathname]);

    useEffect(() => {
        // Only run in production or if specific flag is set, 
        // but for this personal site, we'll run it always for the admin to see results.
        onCLS(handleMetric);
        onFCP(handleMetric);
        onINP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);
    }, [handleMetric]);

    return null; // Side-effect component
}
