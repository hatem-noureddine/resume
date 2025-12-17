'use client';

import { useEffect, useState } from 'react';

interface ServiceWorkerState {
    isSupported: boolean;
    isRegistered: boolean;
    isOnline: boolean;
    hasUpdate: boolean;
    registration: ServiceWorkerRegistration | null;
}

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
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        setState(prev => ({ ...prev, isSupported: true }));

        // Set initial online state
        setState(prev => ({ ...prev, isOnline: navigator.onLine }));

        // Listen for online/offline events
        const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Register service worker
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                setState(prev => ({
                    ...prev,
                    isRegistered: true,
                    registration,
                }));

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                setState(prev => ({ ...prev, hasUpdate: true }));
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.error('Service worker registration failed:', error);
            });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Function to apply pending update
    const update = () => {
        if (state.registration?.waiting) {
            state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    };

    return {
        ...state,
        update,
    };
}
