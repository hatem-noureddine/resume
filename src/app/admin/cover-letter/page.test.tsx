import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoverLetterPage from './page';

// Mock dependencies
jest.mock('@/components/admin/AdminLayout', () => ({
    AdminLayout: ({ children }: any) => <div data-testid="admin-layout">{children}</div>,
}));

jest.mock('@/components/ui', () => ({
    Button: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled} data-testid="btn">
            {children}
        </button>
    ),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/lib/haptic', () => ({
    hapticFeedback: {
        medium: jest.fn(),
        subtle: jest.fn(),
        heavy: jest.fn(),
        error: jest.fn(),
    },
    haptic: {
        medium: jest.fn(),
        subtle: jest.fn(),
        heavy: jest.fn(),
        error: jest.fn(),
    }
}));

// Mock fetch
global.fetch = jest.fn();

describe('Cover Letter Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input area and generate button', () => {
        render(<CoverLetterPage />);
        expect(screen.getByPlaceholderText(/# Software Engineer at Google/i)).toBeInTheDocument();
        expect(screen.getByText('Generate Cover Letter')).toBeInTheDocument();
    });

    it('disables generate button when input is empty', () => {
        render(<CoverLetterPage />);
        const button = screen.getByText('Generate Cover Letter');
        expect(button).toBeDisabled();
    });

    it('handles successful generation', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ coverLetter: 'Dear Hiring Manager...' }),
        });

        render(<CoverLetterPage />);

        // Input text
        const textarea = screen.getByPlaceholderText(/# Software Engineer at Google/i);
        fireEvent.change(textarea, { target: { value: 'Software Engineer Job...' } });

        // Click generate
        fireEvent.click(screen.getByText('Generate Cover Letter'));

        // Should show loading state
        expect(screen.getByText('Writing...')).toBeInTheDocument();

        // Wait for result
        await waitFor(() => {
            expect(screen.getByText('Dear Hiring Manager...')).toBeInTheDocument();
        });
    });
});
