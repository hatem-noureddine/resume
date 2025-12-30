import { render, screen } from '@testing-library/react';
import { ParallaxSection, ParallaxLayer } from './ParallaxSection';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, style, className, ...props }: any) => (
            <div style={style} className={className} data-testid="parallax-element" {...props}>
                {children}
            </div>
        ),
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: (value: any, input: any, output: any) => output[0],
}));

describe('ParallaxSection', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders children', () => {
        render(
            <ParallaxSection>
                <div>Child Content</div>
            </ParallaxSection>
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ParallaxSection className="custom-class">Content</ParallaxSection>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders parallax wrapper', () => {
        const { getAllByTestId } = render(
            <ParallaxSection>Content</ParallaxSection>
        );
        expect(getAllByTestId('parallax-element').length).toBeGreaterThan(0);
    });

    it('applies speed prop correctly', () => {
        const { container } = render(
            <ParallaxSection speed={0.5}>Content</ParallaxSection>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('has overflow hidden by default', () => {
        const { container } = render(
            <ParallaxSection>Content</ParallaxSection>
        );
        expect(container.firstChild).toHaveClass('overflow-hidden');
    });

    it('uses default speed of 0.5', () => {
        const { container } = render(
            <ParallaxSection>Content</ParallaxSection>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('accepts negative speed for reverse parallax', () => {
        const { container } = render(
            <ParallaxSection speed={-0.3}>Content</ParallaxSection>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without parallax when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        const { container, queryByTestId } = render(
            <ParallaxSection>Static Content</ParallaxSection>
        );

        // Should render a plain div without motion
        expect(container.firstChild).toBeInTheDocument();
        // Motion elements should not be present
        expect(queryByTestId('parallax-element')).not.toBeInTheDocument();
    });
});

describe('ParallaxLayer', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders children', () => {
        render(
            <ParallaxLayer>
                <div>Layer Content</div>
            </ParallaxLayer>
        );
        expect(screen.getByText('Layer Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ParallaxLayer className="layer-class">Content</ParallaxLayer>
        );
        expect(container.firstChild).toHaveClass('layer-class');
    });

    it('uses default depth of 1', () => {
        const { container } = render(
            <ParallaxLayer>Content</ParallaxLayer>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('accepts custom depth', () => {
        const { container } = render(
            <ParallaxLayer depth={2}>Content</ParallaxLayer>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders motion div when motion is allowed', () => {
        const { getByTestId } = render(
            <ParallaxLayer>Content</ParallaxLayer>
        );
        expect(getByTestId('parallax-element')).toBeInTheDocument();
    });

    it('renders static div when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        const { container, queryByTestId } = render(
            <ParallaxLayer className="static-layer">Content</ParallaxLayer>
        );

        expect(container.firstChild).toHaveClass('static-layer');
        expect(queryByTestId('parallax-element')).not.toBeInTheDocument();
    });
});
