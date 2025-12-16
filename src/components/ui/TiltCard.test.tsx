import { render, screen, fireEvent } from '@testing-library/react';
import { TiltCard } from './TiltCard';

// Mock usePrefersReducedMotion
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

describe('TiltCard', () => {
    it('renders children', () => {
        render(
            <TiltCard>
                <div data-testid="child">Card Content</div>
            </TiltCard>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <TiltCard className="custom-class">
                <div>Content</div>
            </TiltCard>
        );
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('handles mouse move for tilt effect', () => {
        const { container } = render(
            <TiltCard>
                <div>Tilt Me</div>
            </TiltCard>
        );

        const card = container.firstChild as HTMLElement;

        // Simulate mouse move
        fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });

        // Component should still render
        expect(screen.getByText('Tilt Me')).toBeInTheDocument();
    });

    it('handles mouse leave', () => {
        const { container } = render(
            <TiltCard>
                <div>Tilt Me</div>
            </TiltCard>
        );

        const card = container.firstChild as HTMLElement;

        // Simulate mouse leave
        fireEvent.mouseLeave(card);

        // Component should still render
        expect(screen.getByText('Tilt Me')).toBeInTheDocument();
    });

    it('handles mouse enter', () => {
        const { container } = render(
            <TiltCard>
                <div>Tilt Me</div>
            </TiltCard>
        );

        const card = container.firstChild as HTMLElement;

        // Simulate mouse enter
        fireEvent.mouseEnter(card);

        // Component should still render
        expect(screen.getByText('Tilt Me')).toBeInTheDocument();
    });

    it('applies default styles', () => {
        const { container } = render(
            <TiltCard>
                <div>Content</div>
            </TiltCard>
        );

        expect(container.firstChild).toBeInTheDocument();
    });
});

