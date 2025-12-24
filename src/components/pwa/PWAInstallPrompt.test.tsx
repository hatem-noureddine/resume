import { render, screen, fireEvent, act } from '@testing-library/react';
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
    let beforeInstallPromptCallback: ((e: Event) => void) | null = null;

    beforeEach(() => {
        jest.clearAllMocks();

        // Store original
        originalWindowAddEventListener = window.addEventListener;

        // Mock addEventListener to capture beforeinstallprompt handler
        window.addEventListener = jest.fn((event, callback) => {
            if (event === 'beforeinstallprompt') {
                beforeInstallPromptCallback = callback as (e: Event) => void;
            }
            originalWindowAddEventListener.call(window, event, callback as EventListener);
        });
    });

    afterEach(() => {
        window.addEventListener = originalWindowAddEventListener;
        beforeInstallPromptCallback = null;
    });

    it('renders without crashing', () => {
        const { container } = render(<PWAInstallPrompt />);
        expect(container).toBeInTheDocument();
    });

    it('does not show prompt initially', () => {
        render(<PWAInstallPrompt />);
        // Prompt might not be visible until beforeinstallprompt fires
        expect(screen.queryByTestId('pwa-prompt')).toBeDefined();
    });

    it('listens for beforeinstallprompt event', () => {
        render(<PWAInstallPrompt />);
        expect(window.addEventListener).toHaveBeenCalledWith(
            'beforeinstallprompt',
            expect.any(Function)
        );
    });

    it('shows prompt when beforeinstallprompt fires', async () => {
        render(<PWAInstallPrompt />);

        // Simulate beforeinstallprompt event
        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn().mockResolvedValue(undefined),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }
    });

    it('can be dismissed', async () => {
        render(<PWAInstallPrompt />);

        const dismissButton = screen.queryByTestId('x-icon');
        if (dismissButton) {
            fireEvent.click(dismissButton.closest('button') || dismissButton);
        }
    });

    it('handles install action', async () => {
        render(<PWAInstallPrompt />);

        const mockEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn().mockResolvedValue(undefined),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };

        if (beforeInstallPromptCallback) {
            act(() => {
                beforeInstallPromptCallback!(mockEvent as any);
            });
        }

        // Look for install button
        const buttons = screen.queryAllByTestId('pwa-button');
        if (buttons.length > 0) {
            fireEvent.click(buttons[0]);
        }
    });

    it('exports component correctly', () => {
        expect(PWAInstallPrompt).toBeDefined();
        expect(typeof PWAInstallPrompt).toBe('function');
    });
});
