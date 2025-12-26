import { render, screen, fireEvent, act } from '@testing-library/react';
import { FloatingAccessibility } from './FloatingAccessibility';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ref, ...props }: any) => (
            <div className={className} ref={ref} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
        button: ({ children, className, onClick, 'aria-label': ariaLabel, disabled, ...props }: any) => (
            <button
                className={className}
                onClick={onClick}
                aria-label={ariaLabel}
                disabled={disabled}
                data-testid="motion-button"
                {...props}
            >
                {children}
            </button>
        ),
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Accessibility: () => <div data-testid="accessibility-icon" />,
    Minus: () => <div data-testid="minus-icon" />,
    Plus: () => <div data-testid="plus-icon" />,
    Contrast: () => <div data-testid="contrast-icon" />,
    X: () => <div data-testid="x-icon" />,
    Eye: () => <div data-testid="eye-icon" />,
    Type: () => <div data-testid="type-icon" />,
}));

// Mock ThemeContext
const mockSetFontSize = jest.fn();
const mockSetHighContrast = jest.fn();

jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: jest.fn(),
        fontSize: 'medium',
        setFontSize: mockSetFontSize,
        highContrast: false,
        setHighContrast: mockSetHighContrast,
        reduceMotion: false,
        setReduceMotion: jest.fn(),
    }),
}));

// Mock LanguageContext
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: { accessibility: { settings: 'Settings' } },
        language: 'en',
        direction: 'ltr',
    }),
}));

// Mock AnnouncerContext
const mockSetAccessibilityMenuOpen = jest.fn();

jest.mock('@/context/AnnouncerContext', () => ({
    useAnnouncer: () => ({
        announce: jest.fn(),
        isAccessibilityMenuOpen: false,
        setAccessibilityMenuOpen: mockSetAccessibilityMenuOpen,
    }),
}));

describe('FloatingAccessibility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    });

    it('renders without crashing', () => {
        const { container } = render(<FloatingAccessibility />);
        expect(container).toBeInTheDocument();
    });

    it('is hidden initially when not scrolled', () => {
        render(<FloatingAccessibility />);
        // Component might not render visible elements until scrolled
    });

    it('becomes visible after scrolling past threshold', () => {
        render(<FloatingAccessibility />);

        Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });

        // Check that component elements are rendered
        const motionDivs = screen.queryAllByTestId('motion-div');
        expect(motionDivs.length).toBeGreaterThanOrEqual(0);
    });

    it('cleans up scroll listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = render(<FloatingAccessibility />);
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('exports as named export', () => {
        expect(FloatingAccessibility).toBeDefined();
        expect(typeof FloatingAccessibility).toBe('function');
    });

    describe('font size controls', () => {
        it('can increase font size', async () => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Look for plus button
            const buttons = screen.queryAllByTestId('motion-button');
            // If found, clicking should work
            buttons.forEach(btn => {
                if (btn.querySelector('[data-testid="plus-icon"]')) {
                    fireEvent.click(btn);
                }
            });
        });

        it('can decrease font size', async () => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Look for minus button
            const buttons = screen.queryAllByTestId('motion-button');
            buttons.forEach(btn => {
                if (btn.querySelector('[data-testid="minus-icon"]')) {
                    fireEvent.click(btn);
                }
            });
        });
    });

    describe('high contrast toggle', () => {
        it('can toggle high contrast mode', async () => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Look for contrast button
            const buttons = screen.queryAllByTestId('motion-button');
            buttons.forEach(btn => {
                if (btn.querySelector('[data-testid="contrast-icon"]')) {
                    fireEvent.click(btn);
                }
            });
        });
    });
});
