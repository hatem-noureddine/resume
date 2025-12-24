import { render } from '@testing-library/react';
import { NoiseOverlay } from './NoiseOverlay';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

describe('NoiseOverlay', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders the noise overlay when motion is allowed', () => {
        const { container } = render(<NoiseOverlay />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('returns null when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        const { container } = render(<NoiseOverlay />);
        expect(container.firstChild).toBeNull();
    });

    it('has pointer-events-none class', () => {
        const { container } = render(<NoiseOverlay />);
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveClass('pointer-events-none');
    });

    it('has fixed positioning', () => {
        const { container } = render(<NoiseOverlay />);
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveClass('fixed');
    });

    it('has inset-0 class for full coverage', () => {
        const { container } = render(<NoiseOverlay />);
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveClass('inset-0');
    });
});
