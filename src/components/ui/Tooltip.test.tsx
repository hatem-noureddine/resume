import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<{ role?: string }>) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('Tooltip', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders children', () => {
        render(
            <Tooltip content="Tooltip text">
                <button>Hover me</button>
            </Tooltip>
        );
        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('shows tooltip on mouse enter after delay', async () => {
        render(
            <Tooltip content="Tooltip text" delay={200}>
                <button>Hover me</button>
            </Tooltip>
        );

        const trigger = screen.getByText('Hover me').parentElement;
        fireEvent.mouseEnter(trigger!);

        // Tooltip should not be visible immediately
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        // Advance timers
        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', async () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Hover me</button>
            </Tooltip>
        );

        const trigger = screen.getByText('Hover me').parentElement;

        fireEvent.mouseEnter(trigger!);
        act(() => {
            jest.advanceTimersByTime(0);
        });

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        fireEvent.mouseLeave(trigger!);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    it('shows tooltip on focus', () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Focus me</button>
            </Tooltip>
        );

        const trigger = screen.getByText('Focus me').parentElement;
        fireEvent.focus(trigger!);

        act(() => {
            jest.advanceTimersByTime(0);
        });

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on blur', async () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Focus me</button>
            </Tooltip>
        );

        const trigger = screen.getByText('Focus me').parentElement;

        fireEvent.focus(trigger!);
        act(() => {
            jest.advanceTimersByTime(0);
        });

        fireEvent.blur(trigger!);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    it('applies custom className', () => {
        render(
            <Tooltip content="Text" className="custom-class">
                <span>Test</span>
            </Tooltip>
        );

        const wrapper = screen.getByText('Test').parentElement;
        expect(wrapper).toHaveClass('custom-class');
    });

    it('renders with different positions', () => {
        const positions = ['top', 'bottom', 'left', 'right'] as const;

        positions.forEach(position => {
            const { unmount } = render(
                <Tooltip content="Text" position={position} delay={0}>
                    <span>Test</span>
                </Tooltip>
            );

            const trigger = screen.getByText('Test').parentElement;
            fireEvent.mouseEnter(trigger!);

            act(() => {
                jest.advanceTimersByTime(0);
            });

            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            unmount();
        });
    });

    it('renders ReactNode content', () => {
        render(
            <Tooltip content={<strong>Bold tooltip</strong>} delay={0}>
                <button>Hover</button>
            </Tooltip>
        );

        const trigger = screen.getByText('Hover').parentElement;
        fireEvent.mouseEnter(trigger!);

        act(() => {
            jest.advanceTimersByTime(0);
        });

        expect(screen.getByText('Bold tooltip')).toBeInTheDocument();
    });
});
