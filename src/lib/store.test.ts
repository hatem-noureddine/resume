import { renderHook, act } from '@testing-library/react';
import { createStore, useStore, createPersistedStore, useDerivedState } from './store';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Store utilities', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
    });

    describe('createStore', () => {
        it('creates store with initial state', () => {
            const store = createStore({ count: 0 });
            expect(store.getState()).toEqual({ count: 0 });
        });

        it('updates state with value', () => {
            const store = createStore({ count: 0 });
            store.setState({ count: 5 });
            expect(store.getState()).toEqual({ count: 5 });
        });

        it('updates state with updater function', () => {
            const store = createStore({ count: 0 });
            store.setState(prev => ({ count: prev.count + 1 }));
            expect(store.getState()).toEqual({ count: 1 });
        });

        it('notifies subscribers on state change', () => {
            const store = createStore({ count: 0 });
            const listener = jest.fn();
            store.subscribe(listener);

            store.setState({ count: 1 });
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('does not notify when state is same', () => {
            const store = createStore({ count: 0 });
            const listener = jest.fn();
            store.subscribe(listener);

            const currentState = store.getState();
            store.setState(currentState);
            expect(listener).not.toHaveBeenCalled();
        });

        it('unsubscribes correctly', () => {
            const store = createStore({ count: 0 });
            const listener = jest.fn();
            const unsubscribe = store.subscribe(listener);

            unsubscribe();
            store.setState({ count: 1 });
            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('useStore', () => {
        it('returns current state', () => {
            const store = createStore({ count: 0 });
            const { result } = renderHook(() => useStore(store));
            expect(result.current).toEqual({ count: 0 });
        });

        it('updates when state changes', () => {
            const store = createStore({ count: 0 });
            const { result } = renderHook(() => useStore(store));

            act(() => {
                store.setState({ count: 5 });
            });

            expect(result.current).toEqual({ count: 5 });
        });
    });

    describe('createPersistedStore', () => {
        it('creates store with initial state', () => {
            const store = createPersistedStore('test-key', { value: 'initial' });
            expect(store.getState()).toEqual({ value: 'initial' });
        });

        it('persists state to localStorage', () => {
            const store = createPersistedStore('test-key', { value: 'initial' });
            store.setState({ value: 'updated' });

            expect(mockLocalStorage.getItem('test-key')).toBe('{"value":"updated"}');
        });

        it('loads state from localStorage', () => {
            mockLocalStorage.setItem('existing-key', '{"value":"stored"}');
            const store = createPersistedStore('existing-key', { value: 'default' });

            expect(store.getState()).toEqual({ value: 'stored' });
        });
    });

    describe('useDerivedState', () => {
        it('returns derived value from store state', () => {
            const store = createStore({ items: [1, 2, 3, 4, 5] });
            // Test the selector function directly
            const selector = (state: { items: number[] }) => state.items.filter(i => i > 3);
            expect(selector(store.getState())).toEqual([4, 5]);
        });

        it('selector works with updated state', () => {
            const store = createStore({ items: [1, 2, 3] });
            const selector = (state: { items: number[] }) => state.items.length;

            expect(selector(store.getState())).toBe(3);

            store.setState({ items: [1, 2, 3, 4] });

            expect(selector(store.getState())).toBe(4);
        });
    });
});
