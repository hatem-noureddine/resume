import { render, screen } from '@testing-library/react';
import { ScrollReveal } from './ScrollReveal';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
    useInView: () => true,
    useAnimation: () => ({
        start: jest.fn(),
    }),
}));

describe('ScrollReveal', () => {
    it('renders children', () => {
        render(
            <ScrollReveal>
                <div data-testid="child">Child Content</div>
            </ScrollReveal>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ScrollReveal className="custom-class">
                <div>Content</div>
            </ScrollReveal>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with different animation directions', () => {
        const { rerender } = render(
            <ScrollReveal direction="up">
                <div>Up</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Up')).toBeInTheDocument();

        rerender(
            <ScrollReveal direction="down">
                <div>Down</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Down')).toBeInTheDocument();

        rerender(
            <ScrollReveal direction="left">
                <div>Left</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Left')).toBeInTheDocument();

        rerender(
            <ScrollReveal direction="right">
                <div>Right</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('accepts delay prop', () => {
        render(
            <ScrollReveal delay={0.5}>
                <div>Delayed</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Delayed')).toBeInTheDocument();
    });

    it('accepts duration prop', () => {
        render(
            <ScrollReveal duration={1}>
                <div>With Duration</div>
            </ScrollReveal>
        );
        expect(screen.getByText('With Duration')).toBeInTheDocument();
    });

    it('accepts threshold prop', () => {
        render(
            <ScrollReveal threshold={0.5}>
                <div>Threshold</div>
            </ScrollReveal>
        );
        expect(screen.getByText('Threshold')).toBeInTheDocument();
    });
});
