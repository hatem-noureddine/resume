import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
    const subscribe = (callback: () => void) => {
        const mediaQuery = window.matchMedia(QUERY);
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
    };

    const getSnapshot = () => {
        return window.matchMedia(QUERY).matches;
    };

    const getServerSnapshot = () => {
        return false;
    };

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
