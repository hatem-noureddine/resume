import { render, screen, fireEvent, act } from '@testing-library/react';
import { CopyToClipboard } from './CopyToClipboard';

// Mock AnnouncerContext
const mockAnnounce = jest.fn();
jest.mock('@/context/AnnouncerContext', () => ({
    useAnnouncer: () => ({
        announce: mockAnnounce,
    }),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Check: () => <div data-testid="check-icon" />,
    Copy: () => <div data-testid="copy-icon" />,
}));

describe('CopyToClipboard', () => {
    const originalClipboard = navigator.clipboard;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock clipboard API
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true,
        });
    });

    it('renders without crashing', () => {
        render(<CopyToClipboard text="test" />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows copy icon initially', () => {
        render(<CopyToClipboard text="hello" />);
        expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    });

    it('copies text when clicked', async () => {
        render(<CopyToClipboard text="test text" />);

        const button = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(button);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('shows check icon after successful copy', async () => {
        render(<CopyToClipboard text="test" />);

        const button = screen.getByRole('button');
        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('announces success message', async () => {
        render(<CopyToClipboard text="test" />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });

        expect(mockAnnounce).toHaveBeenCalledWith('Copied to clipboard!');
    });

    it('reverts to copy icon after timeout', async () => {
        render(<CopyToClipboard text="test" />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });

        expect(screen.getByTestId('check-icon')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    });

    it('handles clipboard error gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Clipboard error'));

        render(<CopyToClipboard text="test" />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });

        expect(mockAnnounce).toHaveBeenCalledWith('Failed to copy to clipboard', 'assertive');
        consoleErrorSpy.mockRestore();
    });

    it('applies custom className', () => {
        render(<CopyToClipboard text="test" className="custom-class" />);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('has accessible labels', () => {
        render(<CopyToClipboard text="hello@example.com" />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy hello@example.com to clipboard');
    });

    it('changes aria-label after copying', async () => {
        render(<CopyToClipboard text="test" />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });

        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied to clipboard');
    });
});
