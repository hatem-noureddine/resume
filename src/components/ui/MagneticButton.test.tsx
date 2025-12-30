import { render, fireEvent } from '@testing-library/react';
import { MagneticButton } from './MagneticButton';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, style, onMouseMove, onMouseLeave, className, ...props }: any) => (
            <div
                style={style}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                className={className}
                data-testid="magnetic-wrapper"
                {...props}
            >
                {children}
            </div>
        ),
    },
    useSpring: (value: any) => ({ get: () => (typeof value === 'number' ? value : 0), set: () => { } }),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

describe('MagneticButton', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders children', () => {
        const { getByText } = render(
            <MagneticButton>Click Me</MagneticButton>
        );
        expect(getByText('Click Me')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { getByTestId } = render(
            <MagneticButton className="custom-class">Button</MagneticButton>
        );
        expect(getByTestId('magnetic-wrapper')).toHaveClass('custom-class');
    });

    it('renders motion div when motion is allowed', () => {
        const { getByTestId } = render(
            <MagneticButton>Button</MagneticButton>
        );
        expect(getByTestId('magnetic-wrapper')).toBeInTheDocument();
    });

    it('renders plain div when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        const { container, queryByTestId } = render(
            <MagneticButton className="test-class">Button</MagneticButton>
        );
        // When reduced motion, it renders a plain div without the testid
        expect(queryByTestId('magnetic-wrapper')).not.toBeInTheDocument();
        expect(container.firstChild).toHaveClass('test-class');
    });

    it('handles mouse move events', () => {
        const { getByTestId } = render(
            <MagneticButton>Button</MagneticButton>
        );
        const wrapper = getByTestId('magnetic-wrapper');

        fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 100 });
        expect(wrapper).toBeInTheDocument();
    });

    it('handles mouse leave events', () => {
        const { getByTestId } = render(
            <MagneticButton>Button</MagneticButton>
        );
        const wrapper = getByTestId('magnetic-wrapper');

        fireEvent.mouseLeave(wrapper);
        expect(wrapper).toBeInTheDocument();
    });
});
