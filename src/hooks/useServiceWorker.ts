'use client';

import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerState {
    isSupported: boolean;
    isRegistered: boolean;
    isOnline: boolean;
    hasUpdate: boolean;
    registration: ServiceWorkerRegistration | null;
}

/**
 * Handle service worker state changes when new version is installed
 */
const handleWorkerStateChange = (
    newWorker: ServiceWorker,
    setState: React.Dispatch<React.SetStateAction<ServiceWorkerState>>
) => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        setState(prev => ({ ...prev, hasUpdate: true }));
    }
};

/**
 * Handle service worker update found event
 */
const handleUpdateFound = (
    registration: ServiceWorkerRegistration,
    setState: React.Dispatch<React.SetStateAction<ServiceWorkerState>>
) => {
    const newWorker = registration.installing;
    if (newWorker) {
        newWorker.addEventListener('statechange', () =>
            handleWorkerStateChange(newWorker, setState)
        );
    }
};

/**
 * Hook for managing Service Worker registration and state.
 * 
 * Usage:
 * ```tsx
 * function App() {
 *   const { isOnline, hasUpdate, update } = useServiceWorker();
 *   
 *   if (!isOnline) return <OfflineBanner />;
 *   if (hasUpdate) return <UpdateBanner onUpdate={update} />;
 *   return <MainContent />;
 * }
 * ```
 */
export function useServiceWorker() {
    const [state, setState] = useState<ServiceWorkerState>({
        isSupported: false,
        isRegistered: false,
        isOnline: true,
        hasUpdate: false,
        registration: null,
    });

    useEffect(() => {
        // Check if service workers are supported
        if (typeof globalThis.window === 'undefined' || !navigator.serviceWorker) {
            return;
        }

        // Set initial state for supported and online
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(prev => ({
            ...prev,
            isSupported: true,
            isOnline: navigator.onLine
        }));

        // Listen for online/offline events
        const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

        globalThis.window.addEventListener('online', handleOnline);
        globalThis.window.addEventListener('offline', handleOffline);

        // Register service worker
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                setState(prev => ({
                    ...prev,
                    isRegistered: true,
                    registration,
                }));

                // Check for updates - using extracted handler to reduce nesting
                registration.addEventListener('updatefound', () =>
                    handleUpdateFound(registration, setState)
                );
            })
            .catch((error) => {
                console.error('Service worker registration failed:', error);
            });

        return () => {
            globalThis.window.removeEventListener('online', handleOnline);
            globalThis.window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Function to apply pending update
    const update = useCallback(() => {
        if (state.registration?.waiting) {
            state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            globalThis.window.location.reload();
        }
    }, [state.registration]);

    return {
        ...state,
        update,
    };
}
