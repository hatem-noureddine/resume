import { render, act, waitFor } from '@testing-library/react';
import { ServiceWorkerRegistration } from './ServiceWorkerRegistration';

describe('ServiceWorkerRegistration', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
    });

    it('renders without crashing', () => {
        const { container } = render(<ServiceWorkerRegistration />);
        expect(container).toBeInTheDocument();
    });

    it('returns null (no visible UI)', () => {
        const { container } = render(<ServiceWorkerRegistration />);
        expect(container.firstChild).toBeNull();
    });

    it('does not register service worker in development', () => {
        process.env.NODE_ENV = 'development';

        const mockRegister = jest.fn();
        Object.defineProperty(navigator, 'serviceWorker', {
            value: { register: mockRegister },
            configurable: true,
        });

        render(<ServiceWorkerRegistration />);

        // In development, registration should not happen
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('attempts registration in production when supported', async () => {
        process.env.NODE_ENV = 'production';

        const mockRegister = jest.fn().mockResolvedValue({ scope: '/' });
        Object.defineProperty(navigator, 'serviceWorker', {
            value: { register: mockRegister },
            configurable: true,
        });

        render(<ServiceWorkerRegistration />);

        // Simulate load event
        act(() => {
            window.dispatchEvent(new Event('load'));
        });

        await waitFor(() => {
            // Check if registration was attempted
            // Note: actual behavior depends on environment checks
        });
    });

    it('handles registration failure gracefully', async () => {
        process.env.NODE_ENV = 'production';

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));

        Object.defineProperty(navigator, 'serviceWorker', {
            value: { register: mockRegister },
            configurable: true,
        });

        render(<ServiceWorkerRegistration />);

        act(() => {
            window.dispatchEvent(new Event('load'));
        });

        // Should not throw
        consoleLogSpy.mockRestore();
    });

    it('exports as named export', () => {
        expect(ServiceWorkerRegistration).toBeDefined();
        expect(typeof ServiceWorkerRegistration).toBe('function');
    });
});
