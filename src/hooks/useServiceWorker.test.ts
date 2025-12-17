import { renderHook, act, waitFor } from '@testing-library/react';
import { useServiceWorker } from './useServiceWorker';

describe('useServiceWorker', () => {
    let mockRegistration: any;
    let mockServiceWorker: any;
    let onlineHandler: () => void;
    let offlineHandler: () => void;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRegistration = {
            installing: null,
            waiting: null,
            active: null,
            addEventListener: jest.fn(),
        };

        mockServiceWorker = {
            register: jest.fn().mockResolvedValue(mockRegistration),
            controller: null,
        };

        // Mock navigator.serviceWorker
        Object.defineProperty(navigator, 'serviceWorker', {
            value: mockServiceWorker,
            writable: true,
            configurable: true,
        });

        // Mock navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            value: true,
            writable: true,
            configurable: true
        });

        // Capture event handlers
        jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
            if (event === 'online') onlineHandler = handler as () => void;
            if (event === 'offline') offlineHandler = handler as () => void;
        });
        jest.spyOn(window, 'removeEventListener').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initialization', () => {
        it('detects service worker support', () => {
            const { result } = renderHook(() => useServiceWorker());
            expect(result.current.isSupported).toBe(true);
        });

        it('starts with online status', () => {
            const { result } = renderHook(() => useServiceWorker());
            expect(result.current.isOnline).toBe(true);
        });

        it('detects offline state on init', () => {
            Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
            const { result } = renderHook(() => useServiceWorker());
            expect(result.current.isOnline).toBe(false);
        });

        it('starts with no update available', () => {
            const { result } = renderHook(() => useServiceWorker());
            expect(result.current.hasUpdate).toBe(false);
        });

        it('starts as not registered', () => {
            const { result } = renderHook(() => useServiceWorker());
            expect(result.current.isRegistered).toBe(false);
        });
    });

    describe('registration', () => {
        it('registers service worker', async () => {
            renderHook(() => useServiceWorker());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
        });

        it('updates state after successful registration', async () => {
            const { result } = renderHook(() => useServiceWorker());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });

            await waitFor(() => {
                expect(result.current.isRegistered).toBe(true);
            });
        });

        it('handles registration failure gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockServiceWorker.register.mockRejectedValueOnce(new Error('Registration failed'));

            renderHook(() => useServiceWorker());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                'Service worker registration failed:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });

    describe('online/offline events', () => {
        it('adds online/offline event listeners', () => {
            renderHook(() => useServiceWorker());

            expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
            expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
        });

        it('sets isOnline to true when online event fires', async () => {
            Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
            const { result } = renderHook(() => useServiceWorker());

            await act(async () => {
                onlineHandler();
            });

            expect(result.current.isOnline).toBe(true);
        });

        it('sets isOnline to false when offline event fires', async () => {
            const { result } = renderHook(() => useServiceWorker());

            await act(async () => {
                offlineHandler();
            });

            expect(result.current.isOnline).toBe(false);
        });

        it('removes event listeners on unmount', () => {
            const { unmount } = renderHook(() => useServiceWorker());

            unmount();

            expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
            expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
        });
    });

    describe('update function', () => {
        it('provides update function', () => {
            const { result } = renderHook(() => useServiceWorker());
            expect(typeof result.current.update).toBe('function');
        });

        it('sends SKIP_WAITING message when waiting worker exists', async () => {
            const mockWaiting = {
                postMessage: jest.fn(),
            };
            mockRegistration.waiting = mockWaiting;

            const reloadSpy = jest.fn();
            Object.defineProperty(window, 'location', {
                value: { reload: reloadSpy },
                writable: true,
                configurable: true
            });

            const { result } = renderHook(() => useServiceWorker());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });

            act(() => {
                result.current.update();
            });

            expect(mockWaiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('does nothing when no waiting worker', () => {
            const { result } = renderHook(() => useServiceWorker());

            // Should not throw
            act(() => {
                result.current.update();
            });

            // No error means success
            expect(true).toBe(true);
        });
    });

    describe('update detection', () => {
        it('listens for updatefound events', async () => {
            renderHook(() => useServiceWorker());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });

            expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
                'updatefound',
                expect.any(Function)
            );
        });
    });

    it('handles unsupported environment', () => {
        // Remove serviceWorker from navigator
        Object.defineProperty(navigator, 'serviceWorker', { value: undefined });
        const { result } = renderHook(() => useServiceWorker());
        expect(result.current.isSupported).toBe(false);
    });
});
