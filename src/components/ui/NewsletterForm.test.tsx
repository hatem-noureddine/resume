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

    it('supports Buttondown subscription', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
        } as any);

        render(<NewsletterForm buttondownId="test-token" />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                'https://api.buttondown.email/v1/subscribers',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Token test-token'
                    })
                })
            );
            expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
        });

        fetchSpy.mockRestore();
    });

    it('supports Formspree subscription', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
        } as any);

        render(<NewsletterForm formspreeId="test-form" />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                'https://formspree.io/f/test-form',
                expect.objectContaining({ method: 'POST' })
            );
            expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
        });

        fetchSpy.mockRestore();
    });

    it('handles Buttondown failure', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
        } as any);

        render(<NewsletterForm buttondownId="test-token" />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Subscription failed')).toBeInTheDocument();
        });

        fetchSpy.mockRestore();
    });

    it('handles Formspree failure', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
        } as any);

        render(<NewsletterForm formspreeId="test-form" />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Subscription failed')).toBeInTheDocument();
        });

        fetchSpy.mockRestore();
    });

    it('handles generic error in catch block', async () => {
        // Mock fetch to throw a non-Error object
        jest.spyOn(globalThis, 'fetch').mockRejectedValue('Something went wrong');

        render(<NewsletterForm />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Subscription failed')).toBeInTheDocument();
        });

        jest.restoreAllMocks();
    });

    it('handles empty JSON error response', async () => {
        jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            json: () => Promise.reject(new Error('Invalid JSON')),
        } as any);

        render(<NewsletterForm />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Subscription failed')).toBeInTheDocument();
        });

        jest.restoreAllMocks();
    });

    it('submits to default API endpoint when no props provided', async () => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
        } as any);

        render(<NewsletterForm />);

        const input = screen.getByLabelText('Email address');
        fireEvent.change(input, { target: { value: 'test@api.com' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                '/api/newsletter',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ email: 'test@api.com' }),
                })
            );
            expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
        });

        fetchSpy.mockRestore();
    });

    it('applies custom className', () => {
        const { container } = render(<NewsletterForm className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
