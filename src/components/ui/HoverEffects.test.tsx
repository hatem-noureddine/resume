import { render, screen, fireEvent } from '@testing-library/react';
import { HoverCard, HoverButton, HoverLink, HoverIcon } from './HoverEffects';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <div {...props}>{children}</div>
        ),
        button: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <button {...props}>{children}</button>
        ),
        span: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <span {...props}>{children}</span>
        ),
    },
}));

describe('HoverEffects', () => {
    describe('HoverCard', () => {
        it('renders children', () => {
            render(
                <HoverCard>
                    <div>Card Content</div>
                </HoverCard>
            );
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <HoverCard className="custom-class">
                    <div>Content</div>
                </HoverCard>
            );
            expect(container.firstChild).toHaveClass('custom-class');
        });

        it('renders glow effect when glow is true', () => {
            const { container } = render(
                <HoverCard glow>
                    <div>Content</div>
                </HoverCard>
            );
            // Check for the glow div
            const glowDiv = container.querySelector('.blur-xl');
            expect(glowDiv).toBeInTheDocument();
        });

        it('does not render glow effect by default', () => {
            const { container } = render(
                <HoverCard>
                    <div>Content</div>
                </HoverCard>
            );
            const glowDiv = container.querySelector('.blur-xl');
            expect(glowDiv).not.toBeInTheDocument();
        });
    });

    describe('HoverButton', () => {
        it('renders children', () => {
            render(<HoverButton>Click Me</HoverButton>);
            expect(screen.getByText('Click Me')).toBeInTheDocument();
        });

        it('renders primary variant by default', () => {
            render(<HoverButton>Primary</HoverButton>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-primary');
        });

        it('renders secondary variant', () => {
            render(<HoverButton variant="secondary">Secondary</HoverButton>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-secondary');
        });

        it('renders ghost variant', () => {
            render(<HoverButton variant="ghost">Ghost</HoverButton>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-transparent');
        });

        it('handles click events', () => {
            const handleClick = jest.fn();
            render(<HoverButton onClick={handleClick}>Click</HoverButton>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalled();
        });

        it('applies custom className', () => {
            render(<HoverButton className="custom-btn">Btn</HoverButton>);
            expect(screen.getByRole('button')).toHaveClass('custom-btn');
        });
    });

    describe('HoverLink', () => {
        it('renders children', () => {
            render(<HoverLink>Link Text</HoverLink>);
            expect(screen.getByText('Link Text')).toBeInTheDocument();
        });

        it('renders as anchor when href is provided', () => {
            render(<HoverLink href="/about">About</HoverLink>);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/about');
        });

        it('renders as span when no href', () => {
            render(<HoverLink>No Href</HoverLink>);
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('handles click events', () => {
            const handleClick = jest.fn();
            render(<HoverLink onClick={handleClick}>Clickable</HoverLink>);
            fireEvent.click(screen.getByText('Clickable'));
            expect(handleClick).toHaveBeenCalled();
        });

        it('applies custom className', () => {
            const { container } = render(
                <HoverLink className="custom-link">Link</HoverLink>
            );
            expect(container.firstChild).toHaveClass('custom-link');
        });
    });

    describe('HoverIcon', () => {
        it('renders children', () => {
            render(
                <HoverIcon>
                    <span data-testid="icon">Icon</span>
                </HoverIcon>
            );
            expect(screen.getByTestId('icon')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <HoverIcon className="custom-icon">
                    <span>Icon</span>
                </HoverIcon>
            );
            expect(container.firstChild).toHaveClass('custom-icon');
        });
    });
});
