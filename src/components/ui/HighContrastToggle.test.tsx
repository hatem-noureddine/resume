import { render, screen, fireEvent } from '@testing-library/react';
import { HighContrastToggle } from './HighContrastToggle';

// Mock ThemeContext
const mockSetHighContrast = jest.fn();
let mockHighContrast = false;

jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        highContrast: mockHighContrast,
        setHighContrast: mockSetHighContrast,
        theme: 'light',
        setTheme: jest.fn(),
    }),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Contrast: () => <div data-testid="icon-contrast" />,
}));

describe('HighContrastToggle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHighContrast = false;
    });

    it('renders the toggle button', () => {
        render(<HighContrastToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByTestId('icon-contrast')).toBeInTheDocument();
    });

    it('has correct accessibility attributes when disabled', () => {
        mockHighContrast = false;
        render(<HighContrastToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).toHaveAttribute('aria-label', 'Enable high contrast mode');
    });

    it('has correct accessibility attributes when enabled', () => {
        mockHighContrast = true;
        render(<HighContrastToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).toHaveAttribute('aria-label', 'Disable high contrast mode');
    });

    it('calls setHighContrast when clicked', () => {
        mockHighContrast = false;
        render(<HighContrastToggle />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockSetHighContrast).toHaveBeenCalledWith(true);
    });

    it('toggles off when clicking while enabled', () => {
        mockHighContrast = true;
        render(<HighContrastToggle />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockSetHighContrast).toHaveBeenCalledWith(false);
    });
});
