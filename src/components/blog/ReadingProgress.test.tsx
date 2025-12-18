
import { render, screen } from '@testing-library/react';
import { ReadingProgress } from './ReadingProgress';

// Mock framer-motion useScroll to return a mock object
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,
        useScroll: () => ({
            scrollYProgress: { get: () => 0.5, onChange: jest.fn(), on: jest.fn(), off: jest.fn() }
        }),
        useSpring: (value: any) => value,
        motion: {
            div: ({ style, className, children, ...props }: any) => (
                <div
                    data-testid="progress-bar"
                    className={className}
                    style={style}
                    {...props}
                >
                    {children}
                </div>
            )
        }
    };
});

// Mock hooks
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn()
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

describe('ReadingProgress', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders progress bar by default', () => {
        render(<ReadingProgress />);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
        expect(progressBar).toHaveClass('fixed top-0 left-0 right-0');
    });

    it('returns null when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        const { container } = render(<ReadingProgress />);
        expect(container).toBeEmptyDOMElement();
    });
});
