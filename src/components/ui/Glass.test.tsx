import { render, screen, fireEvent } from '@testing-library/react';
import { GlassCard, GlassPanel, GlassButton, GlassInput } from './Glass';

describe('Glass Components', () => {
    describe('GlassCard', () => {
        it('renders children', () => {
            render(<GlassCard>Card Content</GlassCard>);
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('applies blur classes', () => {
            const { container } = render(<GlassCard blur="lg">Content</GlassCard>);
            expect(container.firstChild).toHaveClass('backdrop-blur-lg');
        });

        it('applies border by default', () => {
            const { container } = render(<GlassCard>Content</GlassCard>);
            expect(container.firstChild).toHaveClass('border');
        });

        it('removes border when border is false', () => {
            const { container } = render(<GlassCard border={false}>Content</GlassCard>);
            expect(container.firstChild).not.toHaveClass('border');
        });

        it('applies hover effects when hover is true', () => {
            const { container } = render(<GlassCard hover>Content</GlassCard>);
            expect(container.firstChild).toHaveClass('hover:bg-background/80');
        });

        it('applies custom className', () => {
            const { container } = render(<GlassCard className="custom">Content</GlassCard>);
            expect(container.firstChild).toHaveClass('custom');
        });
    });

    describe('GlassPanel', () => {
        it('renders children', () => {
            render(<GlassPanel>Panel Content</GlassPanel>);
            expect(screen.getByText('Panel Content')).toBeInTheDocument();
        });

        it('applies default variant', () => {
            const { container } = render(<GlassPanel>Content</GlassPanel>);
            expect(container.firstChild).toHaveClass('bg-background/50');
        });

        it('applies primary variant', () => {
            const { container } = render(<GlassPanel variant="primary">Content</GlassPanel>);
            expect(container.firstChild).toHaveClass('bg-primary/10');
        });

        it('applies dark variant', () => {
            const { container } = render(<GlassPanel variant="dark">Content</GlassPanel>);
            expect(container.firstChild).toHaveClass('bg-black/30');
        });

        it('applies light variant', () => {
            const { container } = render(<GlassPanel variant="light">Content</GlassPanel>);
            expect(container.firstChild).toHaveClass('bg-white/30');
        });
    });

    describe('GlassButton', () => {
        it('renders children', () => {
            render(<GlassButton>Click Me</GlassButton>);
            expect(screen.getByRole('button')).toHaveTextContent('Click Me');
        });

        it('handles click events', () => {
            const handleClick = jest.fn();
            render(<GlassButton onClick={handleClick}>Click</GlassButton>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalled();
        });

        it('is disabled when disabled prop is true', () => {
            render(<GlassButton disabled>Disabled</GlassButton>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('has type button by default', () => {
            render(<GlassButton>Button</GlassButton>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });

        it('accepts type submit', () => {
            render(<GlassButton type="submit">Submit</GlassButton>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });
    });

    describe('GlassInput', () => {
        it('renders input', () => {
            render(<GlassInput placeholder="Enter text" />);
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
        });

        it('handles onChange', () => {
            const handleChange = jest.fn();
            render(<GlassInput onChange={handleChange} />);
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
            expect(handleChange).toHaveBeenCalledWith('test');
        });

        it('renders with value', () => {
            render(<GlassInput value="initial" onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue('initial');
        });

        it('accepts custom type', () => {
            render(<GlassInput type="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });
    });
});
