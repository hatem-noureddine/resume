import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn()
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Sun: () => <div data-testid="sun-icon" />,
    Moon: () => <div data-testid="moon-icon" />,
}));

describe('ThemeToggle Component', () => {
    it('renders toggle button', () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        const setTheme = jest.fn();
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme });
        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button'));
        expect(setTheme).toHaveBeenCalledWith('dark');
    });
});
