import { render, screen, fireEvent } from '@testing-library/react';
import { AdminBar } from './AdminBar';
import { useTheme } from '@/context/ThemeContext';
import { useCommandPalette } from './CommandPalette';

// Mock dependencies
jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

jest.mock('./CommandPalette', () => ({
    CommandPalette: () => <div data-testid="command-palette" />,
    useCommandPalette: jest.fn(() => ({ isOpen: false, open: jest.fn(), close: jest.fn() })),
}));

jest.mock('lucide-react', () => ({
    ChevronLeft: () => <div data-testid="icon-chevron-left" />,
    Activity: () => <div data-testid="icon-activity" />,
    MessageSquare: () => <div data-testid="icon-message-square" />,
    Moon: () => <div data-testid="icon-moon" />,
    Sun: () => <div data-testid="icon-sun" />,
    Search: () => <div data-testid="icon-search" />,
    Command: () => <div data-testid="icon-command" />,
    Settings: () => <div data-testid="icon-settings" />,
}));

describe('AdminBar', () => {
    const mockSetTheme = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    });

    it('renders correctly', () => {
        render(<AdminBar currentPage="Test Page" />);
        expect(screen.getByText('Test Page')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('toggles theme', () => {
        render(<AdminBar />);

        const toggleBtn = screen.getByTitle('Switch to Dark Mode');
        fireEvent.click(toggleBtn);

        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('toggles theme from dark to light', () => {
        (useTheme as jest.Mock).mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
        render(<AdminBar />);

        const toggleBtn = screen.getByTitle('Switch to Light Mode');
        fireEvent.click(toggleBtn);

        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('opens command palette', () => {
        const mockOpen = jest.fn();
        (useCommandPalette as jest.Mock).mockReturnValue({ isOpen: false, open: mockOpen, close: jest.fn() });

        render(<AdminBar />);

        // Find trigger button
        const trigger = screen.getByTitle('Command Palette (⌘K)');
        fireEvent.click(trigger);

        expect(mockOpen).toHaveBeenCalled();
    });
});
