import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo Component', () => {
    it('renders an SVG element', () => {
        render(<Logo />);
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('applies additional className when provided', () => {
        render(<Logo className="custom-class" />);
        const svg = document.querySelector('svg');
        expect(svg).toHaveClass('custom-class');
    });

    it('has default width and height classes', () => {
        render(<Logo />);
        const svg = document.querySelector('svg');
        expect(svg).toHaveClass('w-full');
        expect(svg).toHaveClass('h-full');
    });

    it('renders path elements with fill-primary class', () => {
        render(<Logo />);
        const paths = document.querySelectorAll('path.fill-primary');
        expect(paths.length).toBeGreaterThan(0);
    });
});
