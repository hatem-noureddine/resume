import { renderHook, act } from '@testing-library/react';
import { useServiceWorker } from './useServiceWorker';

// Mock service worker
const mockRegistration = {
    installing: null,
    waiting: null,
    active: null,
    addEventListener: jest.fn(),
};

const mockServiceWorker = {
    register: jest.fn().mockResolvedValue(mockRegistration),
    controller: null,
};

Object.defineProperty(navigator, 'serviceWorker', {
    value: mockServiceWorker,
    writable: true,
});

Object.defineProperty(navigator, 'onLine', {
    value: true,
    writable: true,
});

describe('useServiceWorker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset navigator.onLine
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    });

    it('detects service worker support', () => {
        const { result } = renderHook(() => useServiceWorker());
        expect(result.current.isSupported).toBe(true);
    });

    it('starts with online status', () => {
        const { result } = renderHook(() => useServiceWorker());
        expect(result.current.isOnline).toBe(true);
    });

    it('registers service worker', async () => {
        renderHook(() => useServiceWorker());

        // Wait for registration
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('provides update function', () => {
        const { result } = renderHook(() => useServiceWorker());
        expect(typeof result.current.update).toBe('function');
    });

    it('starts with no update available', () => {
        const { result } = renderHook(() => useServiceWorker());
        expect(result.current.hasUpdate).toBe(false);
    });

    it('detects offline state', () => {
        Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
        const { result } = renderHook(() => useServiceWorker());
        expect(result.current.isOnline).toBe(false);
    });
});
