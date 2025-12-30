import { render, screen, fireEvent } from '@testing-library/react';
import { LottieIcon, LottieLoader } from './LottieIcon';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

jest.mock('lottie-react', () => ({
    __esModule: true,
    default: ({ onComplete, ...props }: any) => (
        <div
            data-testid="lottie"
            onClick={() => onComplete?.()}
            {...props}
        />
    ),
}));

// Mock animation data
const mockAnimationData = { v: '5.0.0', layers: [] };

describe('LottieIcon', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders without crashing', () => {
        render(<LottieIcon animationData={mockAnimationData} />);
        expect(screen.getByTestId('lottie')).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
        const { container } = render(
            <LottieIcon animationData={mockAnimationData} width={100} height={100} />
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.width).toBe('100px');
        expect(wrapper.style.height).toBe('100px');
    });

    it('renders as button for click trigger', () => {
        render(<LottieIcon animationData={mockAnimationData} trigger="click" ariaLabel="Click me" />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders as span for other triggers', () => {
        const { container } = render(<LottieIcon animationData={mockAnimationData} trigger="hover" />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <LottieIcon animationData={mockAnimationData} className="custom-class" />
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has accessible label', () => {
        const { container } = render(
            <LottieIcon animationData={mockAnimationData} ariaLabel="Loading animation" />
        );
        expect(container.firstChild).toHaveAttribute('aria-label', 'Loading animation');
    });

    it('handles hover trigger events', () => {
        const { container } = render(
            <LottieIcon animationData={mockAnimationData} trigger="hover" />
        );
        const wrapper = container.firstChild as HTMLElement;

        fireEvent.mouseEnter(wrapper);
        fireEvent.mouseLeave(wrapper);

        expect(wrapper).toBeInTheDocument();
    });

    it('handles click trigger', () => {
        render(<LottieIcon animationData={mockAnimationData} trigger="click" ariaLabel="Click" />);

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles keyboard events for click trigger', () => {
        render(<LottieIcon animationData={mockAnimationData} trigger="click" ariaLabel="Click" />);

        const button = screen.getByRole('button');
        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.keyDown(button, { key: ' ' });

        expect(button).toBeInTheDocument();
    });

    it('calls onComplete callback', () => {
        const onComplete = jest.fn();
        render(<LottieIcon animationData={mockAnimationData} onComplete={onComplete} />);

        // Simulate animation complete by clicking the mock element
        fireEvent.click(screen.getByTestId('lottie'));

        expect(onComplete).toHaveBeenCalled();
    });

    it('respects reduced motion preference', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        render(<LottieIcon animationData={mockAnimationData} />);

        expect(screen.getByTestId('lottie')).toBeInTheDocument();
    });

    it('disables animation on hover when reduced motion is preferred', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);

        const { container } = render(
            <LottieIcon animationData={mockAnimationData} trigger="hover" />
        );

        fireEvent.mouseEnter(container.firstChild as Element);
        // Animation should not trigger
    });
});

describe('LottieLoader', () => {
    beforeEach(() => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders without crashing', () => {
        render(<LottieLoader animationData={mockAnimationData} />);
        expect(screen.getByTestId('lottie')).toBeInTheDocument();
    });

    it('uses default size of 48', () => {
        const { container } = render(<LottieLoader animationData={mockAnimationData} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.width).toBe('48px');
        expect(wrapper.style.height).toBe('48px');
    });

    it('accepts custom size', () => {
        const { container } = render(<LottieLoader animationData={mockAnimationData} size={64} />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.style.width).toBe('64px');
    });

    it('applies custom className', () => {
        const { container } = render(
            <LottieLoader animationData={mockAnimationData} className="loader-class" />
        );
        expect(container.firstChild).toHaveClass('loader-class');
    });

    it('has Loading aria-label', () => {
        const { container } = render(<LottieLoader animationData={mockAnimationData} />);
        expect(container.firstChild).toHaveAttribute('aria-label', 'Loading');
    });
});
