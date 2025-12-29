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
    vibrate: (pattern: number | number[] = 10) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Silently ignore if vibration fails (e.g. user gesture required, but usually handled by browser)
                console.warn('Haptic feedback failed:', e);
            }
        }
    },

    subtle: () => haptic.vibrate(10),
    medium: () => haptic.vibrate(25),
    heavy: () => haptic.vibrate(50),
    error: () => haptic.vibrate([50, 50, 50]),
};
