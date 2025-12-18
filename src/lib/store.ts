'use client';

import { useSyncExternalStore } from 'react';

type Listener = () => void;
type Updater<T> = (prev: T) => T;

/**
 * Creates a simple store with subscribe/getState pattern.
 * Follows React's useSyncExternalStore pattern for safe concurrent updates.
 * 
 * Usage:
 * ```tsx
 * const counterStore = createStore({ count: 0 });
 * 
 * function Counter() {
 *   const state = useStore(counterStore);
 *   return <button onClick={() => counterStore.setState(s => ({ count: s.count + 1 }))}>
 *     {state.count}
 *   </button>;
 * }
 * ```
 */
export function createStore<T>(initialState: T) {
    let state = initialState;
    const listeners = new Set<Listener>();

    const getState = () => state;

    const setState = (updater: Updater<T> | T) => {
        const newState = typeof updater === 'function'
            ? (updater as Updater<T>)(state)
            : updater;

        if (newState !== state) {
            state = newState;
            listeners.forEach(listener => listener());
        }
    };

    const subscribe = (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { getState, setState, subscribe };
}

type Store<T> = ReturnType<typeof createStore<T>>;

/**
 * Hook to use a store created with createStore.
 * Uses useSyncExternalStore for concurrent-safe updates.
 */
export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

/**
 * Creates a persisted store that saves to localStorage.
 * 
 * Usage:
 * ```tsx
 * const prefsStore = createPersistedStore('prefs', { theme: 'dark' });
 * 
 * function ThemeToggle() {
 *   const prefs = useStore(prefsStore);
 *   return <button onClick={() => prefsStore.setState(s => ({ 
 *     ...s, 
 *     theme: s.theme === 'dark' ? 'light' : 'dark' 
 *   }))}>
 *     Toggle Theme
 *   </button>;
 * }
 * ```
 */
export function createPersistedStore<T>(key: string, initialState: T) {
    // Try to load from localStorage
    let storedState = initialState;
    if (globalThis.window !== undefined) {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                storedState = JSON.parse(stored);
            }
        } catch {
            // Ignore parse errors
        }
    }

    const store = createStore(storedState);

    // Wrap setState to persist
    const originalSetState = store.setState;
    store.setState = (updater: Updater<T> | T) => {
        originalSetState(updater);
        if (globalThis.window !== undefined) {
            localStorage.setItem(key, JSON.stringify(store.getState()));
        }
    };

    return store;
}

/**
 * Hook for derived state from a store.
 * Note: selector should be memoized or defined outside component for best performance.
 * 
 * Usage:
 * ```tsx
 * const selector = useCallback((state) => state.items.filter(i => i.active), []);
 * const items = useDerivedState(store, selector);
 * ```
 */
export function useDerivedState<T, R>(store: Store<T>, selector: (state: T) => R): R {
    const getSnapshot = () => selector(store.getState());
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
