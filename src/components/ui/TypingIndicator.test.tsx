import { render, screen } from '@testing-library/react';
import { TypingIndicator } from './TypingIndicator';

// Mock usePrefersReducedMotion hook (default: reduced motion OFF = use Lottie)
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => false,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
}));

describe('TypingIndicator', () => {
    it('renders Lottie animation when reduced motion is off', () => {
        render(<TypingIndicator />);
        // The Lottie mock in jest.setup.js renders a div with data-testid="lottie-animation"
        expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('has correct container styling', () => {
        const { container } = render(<TypingIndicator />);
        expect(container.firstChild).toHaveClass('flex', 'items-center', 'gap-1');
    });
});
