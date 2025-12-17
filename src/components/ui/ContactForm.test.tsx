import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from './ContactForm';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
        form: ({ children, onSubmit, ...props }: React.PropsWithChildren<{ onSubmit?: React.FormEventHandler }>) => (
            <form onSubmit={onSubmit} {...props}>{children}</form>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('ContactForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form fields', () => {
        render(<ContactForm />);

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toBeInTheDocument();
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('renders submit button', () => {
        render(<ContactForm />);
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('updates form data on input change', () => {
        render(<ContactForm />);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'John Doe', name: 'name' } });

        expect(nameInput).toHaveValue('John Doe');
    });

    it('calls custom onSubmit handler', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(<ContactForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith({
                name: 'John',
                email: 'john@example.com',
                subject: 'Test',
                message: 'Hello!',
            });
        });
    });

    it('shows success message after successful submission', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(<ContactForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText('Message Sent!')).toBeInTheDocument();
        });
    });

    it('shows error message on submission failure', async () => {
        const mockSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
        render(<ContactForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    it('shows error when no submission handler is configured', async () => {
        render(<ContactForm />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText('No submission handler configured')).toBeInTheDocument();
        });
    });

    it('allows sending another message after success', async () => {
        const mockSubmit = jest.fn().mockResolvedValue(undefined);
        render(<ContactForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText('Message Sent!')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /send another message/i }));

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('submits to Formspree when formspreeId is provided', async () => {
        globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });

        render(<ContactForm formspreeId="test123" />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John', name: 'name' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test', name: 'subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello!', name: 'message' } });

        fireEvent.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://formspree.io/f/test123',
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });
});
