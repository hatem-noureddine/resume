import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { act } from 'react';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn()
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Sun: () => <div data-testid="sun-icon" />,
    Moon: () => <div data-testid="moon-icon" />,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders toggle button in light theme', async () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });
        render(<ThemeToggle />);

        // Advance timers to trigger mounted state
        await act(async () => {
            jest.runAllTimers();
        });

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders sun icon in light theme when mounted', async () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });
        render(<ThemeToggle />);

        await act(async () => {
            jest.runAllTimers();
        });

        expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('renders moon icon in dark theme when mounted', async () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'dark', setTheme: jest.fn() });
        render(<ThemeToggle />);

        await act(async () => {
            jest.runAllTimers();
        });

        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('toggles from light to dark on click', async () => {
        const setTheme = jest.fn();
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme });
        render(<ThemeToggle />);

        await act(async () => {
            jest.runAllTimers();
        });

        fireEvent.click(screen.getByRole('button'));
        expect(setTheme).toHaveBeenCalledWith('dark');
    });

    it('toggles from dark to light on click', async () => {
        const setTheme = jest.fn();
        (useTheme as jest.Mock).mockReturnValue({ theme: 'dark', setTheme });
        render(<ThemeToggle />);

        await act(async () => {
            jest.runAllTimers();
        });

        fireEvent.click(screen.getByRole('button'));
        expect(setTheme).toHaveBeenCalledWith('light');
    });

    it('renders placeholder button before mounting', () => {
        // We need to render without triggering useEffect
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });

        // Don't advance timers to keep mounted=false
        const { container } = render(<ThemeToggle />);

        // Should have a button with opacity-50 class
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button?.className).toContain('opacity-50');
    });

    it('has accessible aria-label', async () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });
        render(<ThemeToggle />);

        await act(async () => {
            jest.runAllTimers();
        });

        expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    });
});
