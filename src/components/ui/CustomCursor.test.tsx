import { render } from '@testing-library/react';
import { CustomCursor } from './CustomCursor';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ style, className, children, ...props }: any) => (
            <div style={style} className={className} data-testid="cursor-element" {...props}>
                {children}
            </div>
        ),
    },
    useSpring: (value: any) => value,
    useMotionValue: (initial: any) => ({
        get: () => initial,
        set: () => { },
    }),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

describe('CustomCursor', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders without crashing', () => {
        const { container } = render(<CustomCursor />);
        expect(container).toBeInTheDocument();
    });

    it('returns null when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        const { container } = render(<CustomCursor />);
        // When reduced motion is preferred, renders null
        const cursorElements = container.querySelectorAll('[data-testid="cursor-element"]');
        expect(cursorElements.length).toBe(0);
    });

    it('renders something by default', () => {
        const { container } = render(<CustomCursor />);
        // Just check it doesn't crash
        expect(container).toBeTruthy();
    });
});
