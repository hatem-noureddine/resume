import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterForm } from './NewsletterForm';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe('NewsletterForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form with default title and description', () => {
        render(<NewsletterForm />);
        expect(screen.getByText('Subscribe to my newsletter')).toBeInTheDocument();
        expect(screen.getByText('Get notified about new posts and updates.')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
        render(
            <NewsletterForm
                title="Custom Title"
                description="Custom description"
            />
        );
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('has accessible email input', () => {
        render(<NewsletterForm />);
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    it('shows error for invalid email', async () => {
        render(<NewsletterForm />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'invalid' } });

        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
    });

    it('calls custom onSubmit handler', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(<NewsletterForm onSubmit={mockSubmit} />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith('test@example.com');
        });
    });

    it('shows success message after submission', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(<NewsletterForm onSubmit={mockSubmit} />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
        });
    });

    it('shows custom success message', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(
            <NewsletterForm
                onSubmit={mockSubmit}
                successMessage="You're in!"
            />
        );

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText("You're in!")).toBeInTheDocument();
        });
    });

    it('shows error when submission fails', async () => {
        const mockSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
        render(<NewsletterForm onSubmit={mockSubmit} />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    it('shows error when no service is configured', async () => {
        render(<NewsletterForm />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('No subscription service configured')).toBeInTheDocument();
        });
    });

    it('disables button while submitting', async () => {
        const mockSubmit = jest.fn().mockImplementation(() => new Promise(() => { }));
        render(<NewsletterForm onSubmit={mockSubmit} />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeDisabled();
            expect(screen.getByText('Subscribing...')).toBeInTheDocument();
        });
    });

    it('applies custom className', () => {
        const { container } = render(<NewsletterForm className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
