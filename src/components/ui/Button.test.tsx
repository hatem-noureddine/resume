import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    it('renders button with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies default variant classes', () => {
        render(<Button>Default</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('applies outline variant classes', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border');
    });

    it('applies ghost variant classes', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('hover:bg-accent');
    });

    it('applies size classes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-9');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-11');
    });

    it('renders as child component when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        expect(screen.getByRole('link', { name: /link button/i })).toBeInTheDocument();
    });

    it('accepts additional className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards onClick handler', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);
        screen.getByRole('button').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
