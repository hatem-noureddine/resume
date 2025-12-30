import { render, screen } from '@testing-library/react';
import { Input, Textarea } from './FormField';

describe('FormField Components', () => {
    describe('Input', () => {
        it('renders input with label', () => {
            render(<Input label="Email" name="email" />);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('renders input without label', () => {
            render(<Input name="email" placeholder="Enter email" />);
            expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
        });

        it('shows required indicator when required', () => {
            render(<Input label="Email" name="email" required />);
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('shows error message', () => {
            render(<Input label="Email" name="email" error="Invalid email" />);
            expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
        });

        it('shows helper text when no error', () => {
            render(<Input label="Email" name="email" helperText="We'll never share your email" />);
            expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
        });

        it('hides helper text when error is present', () => {
            render(
                <Input
                    label="Email"
                    name="email"
                    helperText="Helper"
                    error="Error"
                />
            );
            expect(screen.queryByText('Helper')).not.toBeInTheDocument();
            expect(screen.getByText('Error')).toBeInTheDocument();
        });

        it('has aria-invalid when error is present', () => {
            render(<Input label="Email" name="email" error="Invalid" />);
            expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-invalid', 'true');
        });

        it('uses custom id when provided', () => {
            render(<Input label="Email" id="custom-id" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
        });

        it('applies custom className', () => {
            render(<Input name="email" className="custom-class" />);
            expect(screen.getByRole('textbox')).toHaveClass('custom-class');
        });
    });

    describe('Textarea', () => {
        it('renders textarea with label', () => {
            render(<Textarea label="Message" name="message" />);
            expect(screen.getByLabelText('Message')).toBeInTheDocument();
        });

        it('renders textarea without label', () => {
            render(<Textarea name="message" placeholder="Enter message" />);
            expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
        });

        it('shows required indicator when required', () => {
            render(<Textarea label="Message" name="message" required />);
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('shows error message', () => {
            render(<Textarea label="Message" name="message" error="Required" />);
            expect(screen.getByRole('alert')).toHaveTextContent('Required');
        });

        it('shows helper text when no error', () => {
            render(<Textarea label="Message" name="message" helperText="Max 500 chars" />);
            expect(screen.getByText('Max 500 chars')).toBeInTheDocument();
        });

        it('has aria-invalid when error is present', () => {
            render(<Textarea label="Message" name="message" error="Required" />);
            expect(screen.getByLabelText(/Message/)).toHaveAttribute('aria-invalid', 'true');
        });

        it('applies custom className', () => {
            render(<Textarea name="message" className="custom-class" />);
            expect(screen.getByRole('textbox')).toHaveClass('custom-class');
        });

        it('accepts rows prop', () => {
            render(<Textarea name="message" rows={10} />);
            expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
        });
    });
});
