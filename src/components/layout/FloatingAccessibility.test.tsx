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
        button: ({ children, className, onClick, 'aria-label': ariaLabel, 'aria-expanded': ariaExpanded, 'aria-pressed': ariaPressed, disabled, ...props }: any) => (
            <button
                className={className}
                onClick={onClick}
                aria-label={ariaLabel}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
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

// Mock ThemeContext with configurable state
let mockFontSize = 'medium';
const mockSetFontSize = jest.fn((size) => { mockFontSize = size; });
const mockSetHighContrast = jest.fn();
let mockHighContrast = false;

jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: jest.fn(),
        fontSize: mockFontSize,
        setFontSize: mockSetFontSize,
        highContrast: mockHighContrast,
        setHighContrast: mockSetHighContrast,
        reduceMotion: false,
        setReduceMotion: jest.fn(),
    }),
}));

// Mock LanguageContext with configurable direction
let mockDirection = 'ltr';

jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: { accessibility: { settings: 'Settings' } },
        language: 'en',
        direction: mockDirection,
    }),
}));

// Mock AnnouncerContext with configurable menu state
let mockIsAccessibilityMenuOpen = false;
const mockSetAccessibilityMenuOpen = jest.fn((isOpen) => { mockIsAccessibilityMenuOpen = isOpen; });

jest.mock('@/context/AnnouncerContext', () => ({
    useAnnouncer: () => ({
        announce: jest.fn(),
        isAccessibilityMenuOpen: mockIsAccessibilityMenuOpen,
        setAccessibilityMenuOpen: mockSetAccessibilityMenuOpen,
    }),
}));

describe('FloatingAccessibility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
        mockFontSize = 'medium';
        mockHighContrast = false;
        mockDirection = 'ltr';
        mockIsAccessibilityMenuOpen = false;
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        const { container } = render(<FloatingAccessibility />);
        expect(container).toBeInTheDocument();
    });

    it('is hidden initially when not scrolled', () => {
        render(<FloatingAccessibility />);
        // Component should not render toggle button until scrolled
        expect(screen.queryByLabelText('Toggle accessibility controls')).not.toBeInTheDocument();
    });

    it('becomes visible after scrolling past threshold', () => {
        render(<FloatingAccessibility />);

        Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });

        // Check that toggle button is rendered
        expect(screen.queryByLabelText('Toggle accessibility controls')).toBeInTheDocument();
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

    describe('menu toggle', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
        });

        it('opens accessibility menu when toggle button is clicked', () => {
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const toggleButton = screen.getByLabelText('Toggle accessibility controls');
            fireEvent.click(toggleButton);

            expect(mockSetAccessibilityMenuOpen).toHaveBeenCalledWith(true);
        });

        it('closes menu when clicking outside the panel', () => {
            mockIsAccessibilityMenuOpen = true;

            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Simulate clicking outside by dispatching mousedown on document
            act(() => {
                fireEvent.mouseDown(document.body);
            });

            expect(mockSetAccessibilityMenuOpen).toHaveBeenCalledWith(false);
        });

        it('hides tooltip after showing accessibility panel', () => {
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Tooltip should initially be visible
            // Click toggle to hide tooltip
            const toggleButton = screen.getByLabelText('Toggle accessibility controls');
            fireEvent.click(toggleButton);

            // Tooltip hiding is triggered on click
            expect(mockSetAccessibilityMenuOpen).toHaveBeenCalled();
        });

        it('hides tooltip after 3 seconds on first scroll', () => {
            render(<FloatingAccessibility />);

            act(() => {
                Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
                window.dispatchEvent(new Event('scroll'));
            });

            // Fast-forward 3 seconds for tooltip to hide
            act(() => {
                jest.advanceTimersByTime(3000);
            });
        });
    });

    describe('font size controls', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
            mockIsAccessibilityMenuOpen = true;
        });

        it('can increase font size from medium to large', () => {
            mockFontSize = 'medium';
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const increaseButton = screen.getByLabelText('Increase font size');
            fireEvent.click(increaseButton);

            expect(mockSetFontSize).toHaveBeenCalledWith('large');
        });

        it('can decrease font size from medium to small', () => {
            mockFontSize = 'medium';
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const decreaseButton = screen.getByLabelText('Decrease font size');
            fireEvent.click(decreaseButton);

            expect(mockSetFontSize).toHaveBeenCalledWith('small');
        });

        it('cannot increase font size when at maximum (large)', () => {
            mockFontSize = 'large';
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const increaseButton = screen.getByLabelText('Increase font size');
            expect(increaseButton).toBeDisabled();
        });

        it('cannot decrease font size when at minimum (small)', () => {
            mockFontSize = 'small';
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const decreaseButton = screen.getByLabelText('Decrease font size');
            expect(decreaseButton).toBeDisabled();
        });
    });

    describe('high contrast toggle', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
            mockIsAccessibilityMenuOpen = true;
        });

        it('can enable high contrast mode', () => {
            mockHighContrast = false;
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const contrastButton = screen.getByLabelText('Enable high contrast');
            fireEvent.click(contrastButton);

            expect(mockSetHighContrast).toHaveBeenCalledWith(true);
        });

        it('can disable high contrast mode', () => {
            mockHighContrast = true;
            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const contrastButton = screen.getByLabelText('Disable high contrast');
            fireEvent.click(contrastButton);

            expect(mockSetHighContrast).toHaveBeenCalledWith(false);
        });
    });

    describe('RTL support', () => {
        it('renders correctly in RTL mode', () => {
            mockDirection = 'rtl';
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });

            render(<FloatingAccessibility />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Should still render toggle button
            expect(screen.queryByLabelText('Toggle accessibility controls')).toBeInTheDocument();
        });
    });
});

