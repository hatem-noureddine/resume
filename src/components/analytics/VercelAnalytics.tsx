import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * Vercel Analytics and Speed Insights components.
 * 
 * Analytics automatically tracks page views and custom events.
 * Speed Insights provides Core Web Vitals monitoring.
 * 
 * Both are automatically configured when deployed to Vercel.
 * No additional configuration needed - they work out of the box.
 * 
 * @see https://vercel.com/docs/analytics
 * @see https://vercel.com/docs/speed-insights
 */
export function VercelAnalytics() {
    return (
        <>
            <Analytics />
            <SpeedInsights />
        </>
    );
}
