import { render } from '@testing-library/react';
import { TypingIndicator } from './TypingIndicator';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
}));

describe('TypingIndicator', () => {
    it('renders three dots', () => {
        const { container } = render(<TypingIndicator />);
        // The component renders 3 motion.div elements with w-1.5 class (the dots)
        const dots = container.querySelectorAll('.w-1\\.5');
        expect(dots.length).toBe(3);
    });

    it('has correct styling classes', () => {
        const { container } = render(<TypingIndicator />);
        expect(container.firstChild).toHaveClass('flex', 'items-center', 'gap-1');
    });
});

