import { render } from '@testing-library/react';
import { AnimatedCounter } from './AnimatedCounter';

// Mock usePrefersReducedMotion
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

describe('AnimatedCounter', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Mock IntersectionObserver
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => null,
            unobserve: () => null,
            disconnect: () => null,
        });
        globalThis.IntersectionObserver = mockIntersectionObserver;
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders with default value', () => {
        const { container } = render(<AnimatedCounter value={100} />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('renders with prefix', () => {
        const { container } = render(<AnimatedCounter value={50} prefix="$" />);
        expect(container.textContent).toContain('$');
    });

    it('renders with suffix', () => {
        const { container } = render(<AnimatedCounter value={75} suffix="%" />);
        expect(container.textContent).toContain('%');
    });

    it('applies custom className', () => {
        const { container } = render(<AnimatedCounter value={100} className="custom-class" />);
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('handles zero value', () => {
        const { container } = render(<AnimatedCounter value={0} />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('handles large values', () => {
        const { container } = render(<AnimatedCounter value={1000000} />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('handles string value', () => {
        const { container } = render(<AnimatedCounter value="50" />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('applies tabular-nums class by default', () => {
        const { container } = render(<AnimatedCounter value={100} />);
        expect(container.querySelector('.tabular-nums')).toBeInTheDocument();
    });
});

