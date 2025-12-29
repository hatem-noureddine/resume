
import { renderHook, act } from '@testing-library/react';
import { ExperimentProvider, useExperiment } from './ExperimentContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
});

describe('ExperimentContext', () => {
    // Mock crypto for deterministic testing
    const originalCrypto = globalThis.crypto;

    beforeAll(() => {
        Object.defineProperty(globalThis, 'crypto', {
            value: {
                getRandomValues: (arr: Uint32Array) => {
                    // Return consistent value for testing distribution
                    // For 50% split (random * 2), 0.1 -> index 0
                    arr[0] = 0x10000000; // ~0.06
                    return arr;
                }
            }
        });
    });

    afterAll(() => {
        Object.defineProperty(globalThis, 'crypto', { value: originalCrypto });
    });

    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    it('should provide default values', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ExperimentProvider>{children}</ExperimentProvider>
        );

        const { result } = renderHook(() => useExperiment(), { wrapper });

        expect(result.current.assignments).toEqual({});
        expect(typeof result.current.getVariant).toBe('function');
    });

    it('should assign a variant when requested', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ExperimentProvider>{children}</ExperimentProvider>
        );

        const { result } = renderHook(() => useExperiment(), { wrapper });

        let variant;
        act(() => {
            variant = result.current.getVariant('test-exp', ['A', 'B']);
        });

        expect(variant).toBe('A'); // Based on our mocked crypto
        expect(result.current.assignments['test-exp']).toBe('A');
    });

    it('should return existing assignment if available', () => {
        // Setup existing assignment
        localStorageMock.setItem('experiment-assignments', JSON.stringify({
            'test-exp': 'B'
        }));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ExperimentProvider>{children}</ExperimentProvider>
        );

        const { result } = renderHook(() => useExperiment(), { wrapper });

        // Wait for useEffect to load from localStorage (it's async-ish in React flow)
        // In renderHook, effects run.

        let variant;
        act(() => {
            variant = result.current.getVariant('test-exp', ['A', 'B']);
        });

        expect(variant).toBe('B');
    });

    it('should persist assignments to localStorage', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ExperimentProvider>{children}</ExperimentProvider>
        );

        const { result } = renderHook(() => useExperiment(), { wrapper });

        act(() => {
            result.current.getVariant('new-exp', ['control', 'variant']);
        });

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'experiment-assignments',
            expect.stringContaining('"new-exp":"control"')
        );
    });

    it('should default to control if no variants provided', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ExperimentProvider>{children}</ExperimentProvider>
        );

        const { result } = renderHook(() => useExperiment(), { wrapper });

        let variant;
        act(() => {
            variant = result.current.getVariant('test-empty', []);
        });

        expect(variant).toBe('control');
    });

    it('should throw error if used outside provider', () => {
        // Suppress console error for this test
        const consoleError = console.error;
        console.error = jest.fn();

        expect(() => {
            renderHook(() => useExperiment());
        }).toThrow('useExperiment must be used within an ExperimentProvider');

        console.error = consoleError;
    });
});
