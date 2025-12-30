import { render, screen, fireEvent } from '@testing-library/react';
import { CommandPalette, useCommandPalette } from './CommandPalette';
import { useRouter } from 'next/navigation';

// Mock mocks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('lucide-react', () => ({
    Search: () => <div data-testid="icon-search" />,
    Home: () => <div data-testid="icon-home" />,
    FileText: () => <div data-testid="icon-file-text" />,
    Activity: () => <div data-testid="icon-activity" />,
    MessageSquare: () => <div data-testid="icon-message-square" />,
    BarChart3: () => <div data-testid="icon-bar-chart" />,
    Palette: () => <div data-testid="icon-palette" />,
    X: () => <div data-testid="icon-x" />,
    ArrowRight: () => <div data-testid="icon-arrow-right" />,
    Command: () => <div data-testid="icon-command" />,
}));

describe('CommandPalette', () => {
    const mockPush = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        // Mock window.open
        globalThis.open = jest.fn();
    });

    it('does not render when closed', () => {
        render(<CommandPalette isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByPlaceholderText('Type a command or search...')).not.toBeInTheDocument();
    });

    it('renders when open', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument();
        // Should auto-focus input
        expect(screen.getByPlaceholderText('Type a command or search...')).toHaveFocus();
    });

    it('closes on backdrop click', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);
        fireEvent.click(screen.getByLabelText('Close command palette'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes on escape key', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('filters commands', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);

        const input = screen.getByPlaceholderText('Type a command or search...');
        fireEvent.change(input, { target: { value: 'Dashboard' } });

        expect(screen.getByText('Go to admin dashboard')).toBeInTheDocument();
        expect(screen.queryByText('Component playground')).not.toBeInTheDocument();
    });

    it('navigates to dashboard command', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Dashboard'));

        expect(mockPush).toHaveBeenCalledWith('/admin');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('opens external link for storybook', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Storybook'));

        expect(globalThis.open).toHaveBeenCalledWith('http://localhost:6006', '_blank');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('searches by keywords', () => {
        render(<CommandPalette isOpen={true} onClose={mockOnClose} />);

        const input = screen.getByPlaceholderText('Type a command or search...');
        // 'vitals' is a keyword for Performance Dashboard
        fireEvent.change(input, { target: { value: 'vitals' } });

        expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
    });
});

describe('useCommandPalette', () => {
    // Testing the hook behavior requires a test component or renderHook from @testing-library/react-hooks (or newer react lib)
    // Since we are creating a .tsx file directly, let's just make a small component to test the hook

    function TestComponent() {
        const { isOpen, open, close, toggle } = useCommandPalette();
        return (
            <div>
                <span data-testid="status">{isOpen ? 'Open' : 'Closed'}</span>
                <button onClick={open}>Open</button>
                <button onClick={close}>Close</button>
                <button onClick={toggle}>Toggle</button>
            </div>
        );
    }

    it('handles state changes', () => {
        render(<TestComponent />);
        const status = screen.getByTestId('status');

        expect(status).toHaveTextContent('Closed');

        fireEvent.click(screen.getByText('Open'));
        expect(status).toHaveTextContent('Open');

        fireEvent.click(screen.getByText('Close'));
        expect(status).toHaveTextContent('Closed');

        fireEvent.click(screen.getByText('Toggle'));
        expect(status).toHaveTextContent('Open');

        fireEvent.click(screen.getByText('Toggle'));
        expect(status).toHaveTextContent('Closed');
    });

    it('opens on Cmd+K', () => {
        render(<TestComponent />);
        const status = screen.getByTestId('status');

        fireEvent.keyDown(document, { key: 'k', metaKey: true });
        expect(status).toHaveTextContent('Open');

        fireEvent.keyDown(document, { key: 'k', metaKey: true });
        expect(status).toHaveTextContent('Closed');
    });
    it('opens on Ctrl+K', () => {
        render(<TestComponent />);
        const status = screen.getByTestId('status');

        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
        expect(status).toHaveTextContent('Open');
    });
});
