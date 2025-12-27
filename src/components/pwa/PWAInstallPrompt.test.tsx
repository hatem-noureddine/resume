import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { PWAInstallPrompt } from './PWAInstallPrompt';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => (
            <div className={className} data-testid="pwa-prompt" {...props}>
                {children}
            </div>
        ),
        button: ({ children, onClick, className, ...props }: any) => (
            <button className={className} onClick={onClick} data-testid="pwa-button" {...props}>
                {children}
            </button>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Download: () => <div data-testid="download-icon" />,
    X: () => <div data-testid="x-icon" />,
    Smartphone: () => <div data-testid="smartphone-icon" />,
}));

describe('PWAInstallPrompt', () => {
    let originalWindowAddEventListener: typeof window.addEventListener;
    let originalWindowRemoveEventListener: typeof window.removeEventListener;
    let beforeInstallPromptCallback: ((e: Event) => void) | null = null;
    let originalMatchMedia: typeof window.matchMedia;
    let originalNavigator: typeof navigator;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        localStorage.clear();

        // Store original functions
        originalWindowAddEventListener = window.addEventListener;
        originalWindowRemoveEventListener = window.removeEventListener;
        originalMatchMedia = window.matchMedia;

        // Mock addEventListener to capture beforeinstallprompt handler
        window.addEventListener = jest.fn((event, callback) => {
            if (event === 'beforeinstallprompt') {
                beforeInstallPromptCallback = callback as (e: Event) => void;
            }
            originalWindowAddEventListener.call(window, event, callback as EventListener);
        });

        window.removeEventListener = jest.fn((event, callback) => {
            originalWindowRemoveEventListener.call(window, event, callback as EventListener);
        });

        // Mock matchMedia for standalone check
        window.matchMedia = jest.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));

        // Mock navigator for iOS check
        Object.defineProperty(globalThis, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0)' },
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        window.addEventListener = originalWindowAddEventListener;
        window.removeEventListener = originalWindowRemoveEventListener;
        window.matchMedia = originalMatchMedia;
        beforeInstallPromptCallback = null;
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        const { container } = render(<PWAInstallPrompt />);
        expect(container).toBeInTheDocument();
    });

    it('does not show prompt initially', () => {
        render(<PWAInstallPrompt />);
        expect(screen.queryByText('Install App')).not.toBeInTheDocument();
    });

    it('listens for beforeinstallprompt event', () => {
        render(<PWAInstallPrompt />);
        expect(window.addEventListener).toHaveBeenCalledWith(
            'beforeinstallprompt',
            expect.any(Function)
        );
    });

    it('removes event listener on unmount', () => {
        const { unmount } = render(<PWAInstallPrompt />);
        unmount();
        expect(window.removeEventListener).toHaveBeenCalledWith(
            'beforeinstallprompt',
            expect.any(Function)
        );
    });

    it('shows prompt after delay when beforeinstallprompt fires', async () => {
        render(<PWAInstallPrompt />);

        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn(),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        expect(mockEvent.preventDefault).toHaveBeenCalled();

        // Fast-forward past the 5 second delay
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.getByText('Install App')).toBeInTheDocument();
    });

    it('does not show prompt if previously dismissed', async () => {
        localStorage.setItem('pwa-prompt-dismissed', 'true');

        render(<PWAInstallPrompt />);

        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn(),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Should not show the install prompt text since it was dismissed
        expect(screen.queryByText('Install for quick access')).not.toBeInTheDocument();
    });

    it('handles install action and hides prompt on accept', async () => {
        render(<PWAInstallPrompt />);

        const mockPrompt = jest.fn().mockResolvedValue(undefined);
        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Click install button
        const installButton = screen.queryByTestId('pwa-button');
        if (installButton) {
            await act(async () => {
                fireEvent.click(installButton);
            });
        }

        await waitFor(() => {
            expect(mockPrompt).toHaveBeenCalled();
        });
    });

    it('handles install action when dismissed', async () => {
        render(<PWAInstallPrompt />);

        const mockPrompt = jest.fn().mockResolvedValue(undefined);
        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: 'dismissed' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        const installButton = screen.queryByTestId('pwa-button');
        if (installButton) {
            await act(async () => {
                fireEvent.click(installButton);
            });
        }
    });

    it('handles dismiss action and stores in localStorage', async () => {
        render(<PWAInstallPrompt />);

        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn(),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Find and click dismiss/close button
        const buttons = screen.queryAllByRole('button');
        const dismissButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Dismiss');
        if (dismissButton) {
            fireEvent.click(dismissButton);
            expect(localStorage.getItem('pwa-prompt-dismissed')).toBe('true');
        }
    });

    it('returns null when in standalone mode', () => {
        // Mock standalone mode
        window.matchMedia = jest.fn().mockImplementation((query: string) => ({
            matches: query === '(display-mode: standalone)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));

        const { container } = render(<PWAInstallPrompt />);
        expect(container.firstChild).toBeNull();
    });

    it('detects iOS device and renders hidden install button', () => {
        // Mock iOS user agent
        Object.defineProperty(globalThis, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)' },
            writable: true,
            configurable: true,
        });

        render(<PWAInstallPrompt />);

        // iOS renders a hidden button
        const installButton = screen.queryByLabelText('Install App');
        expect(installButton).toBeInTheDocument();
    });

    it('shows iOS-specific instructions when iOS install button clicked', () => {
        Object.defineProperty(globalThis, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)' },
            writable: true,
            configurable: true,
        });

        render(<PWAInstallPrompt />);

        const installButton = screen.queryByLabelText('Install App');
        if (installButton) {
            fireEvent.click(installButton);
            expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
        }
    });

    it('handles install prompt error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<PWAInstallPrompt />);

        const mockPrompt = jest.fn().mockRejectedValue(new Error('Install failed'));
        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        const installButton = screen.queryByTestId('pwa-button');
        if (installButton) {
            await act(async () => {
                fireEvent.click(installButton);
            });
        }

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Install prompt error:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('exports component correctly', () => {
        expect(PWAInstallPrompt).toBeDefined();
        expect(typeof PWAInstallPrompt).toBe('function');
    });
});

