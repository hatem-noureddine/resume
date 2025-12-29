/**
 * Simple haptic feedback utility using the Navigator Vibration API.
 * 
 * Pattern examples:
 * - subtle: 5-10ms
 * - medium: 20-30ms
 * - heavy: 50ms
 * - error: [50, 50, 50]
 */
export const haptic = {
    isSupported: () => typeof navigator !== 'undefined' && !!navigator.vibrate,

    vibrate: (pattern: number | number[] = 10) => {
        if (typeof navigator === 'undefined' || !navigator.vibrate) return;

        try {
            // Check for reduced motion preference
            const prefersReducedMotion = typeof globalThis !== 'undefined' &&
                globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            navigator.vibrate(pattern);
        } catch {
            // Silently ignore if vibration fails
        }
    },

    subtle: () => haptic.vibrate(10),
    medium: () => haptic.vibrate(25),
    heavy: () => haptic.vibrate(50),
    error: () => haptic.vibrate([50, 50, 50]),
};
