import { render } from '@testing-library/react';
import { AnimatedBackground } from './AnimatedBackground';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }: any) => (
            <div className={className} style={style} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

describe('AnimatedBackground', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders without crashing', () => {
        const { container } = render(<AnimatedBackground />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders static version when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        const { container } = render(<AnimatedBackground />);
        // Should still render but without motion
        expect(container.firstChild).toBeInTheDocument();
    });

    it('has absolute positioning', () => {
        const { container } = render(<AnimatedBackground />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('absolute');
    });

    it('covers the full container', () => {
        const { container } = render(<AnimatedBackground />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('inset-0');
    });

    it('has pointer-events-none', () => {
        const { container } = render(<AnimatedBackground />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('pointer-events-none');
    });

    it('has overflow hidden', () => {
        const { container } = render(<AnimatedBackground />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('overflow-hidden');
    });
});
