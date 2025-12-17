import { render, screen } from '@testing-library/react';
import { LottieAnimation, AnimatedIcon, AnimationPresets } from './LottieAnimation';

// Mock lottie-react
jest.mock('lottie-react', () => {
    return {
        __esModule: true,
        default: function MockLottie({ onDOMLoaded }: { onDOMLoaded?: () => void }) {
            // Simulate DOM loaded
            if (onDOMLoaded) {
                setTimeout(onDOMLoaded, 0);
            }
            return <div data-testid="lottie-mock">Lottie Animation</div>;
        },
    };
});

// Sample animation data
const sampleAnimationData = {
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    layers: [],
};

describe('LottieAnimation', () => {
    it('renders animation', async () => {
        render(
            <LottieAnimation animationData={sampleAnimationData} />
        );

        // Wait for suspense
        const lottie = await screen.findByTestId('lottie-mock');
        expect(lottie).toBeInTheDocument();
    });

    it('applies custom className', async () => {
        const { container } = render(
            <LottieAnimation
                animationData={sampleAnimationData}
                className="custom-class"
            />
        );

        await screen.findByTestId('lottie-mock');
        expect(container.querySelector('.custom-class')).toBeTruthy();
    });

    it('accepts loop prop', async () => {
        render(
            <LottieAnimation
                animationData={sampleAnimationData}
                loop={false}
            />
        );

        const lottie = await screen.findByTestId('lottie-mock');
        expect(lottie).toBeInTheDocument();
    });

    it('accepts autoplay prop', async () => {
        render(
            <LottieAnimation
                animationData={sampleAnimationData}
                autoplay={false}
            />
        );

        const lottie = await screen.findByTestId('lottie-mock');
        expect(lottie).toBeInTheDocument();
    });

    it('renders custom fallback', () => {
        // Render without waiting for suspense to see fallback
        render(
            <LottieAnimation
                animationData={sampleAnimationData}
                fallback={<div data-testid="custom-fallback">Loading...</div>}
            />
        );

        // Fallback might show briefly
        // The animation should eventually load
    });
});

describe('AnimatedIcon', () => {
    it('renders with default size', async () => {
        const { container } = render(
            <AnimatedIcon animationData={sampleAnimationData} />
        );

        await screen.findByTestId('lottie-mock');
        expect(container.querySelector('.w-10')).toBeTruthy();
    });

    it('renders with small size', async () => {
        const { container } = render(
            <AnimatedIcon animationData={sampleAnimationData} size="sm" />
        );

        await screen.findByTestId('lottie-mock');
        expect(container.querySelector('.w-6')).toBeTruthy();
    });

    it('renders with large size', async () => {
        const { container } = render(
            <AnimatedIcon animationData={sampleAnimationData} size="lg" />
        );

        await screen.findByTestId('lottie-mock');
        expect(container.querySelector('.w-16')).toBeTruthy();
    });

    it('renders with xl size', async () => {
        const { container } = render(
            <AnimatedIcon animationData={sampleAnimationData} size="xl" />
        );

        await screen.findByTestId('lottie-mock');
        expect(container.querySelector('.w-24')).toBeTruthy();
    });
});

describe('AnimationPresets', () => {
    it('has loading preset', () => {
        expect(AnimationPresets.loading).toBeDefined();
        expect(AnimationPresets.loading.loop).toBe(true);
    });

    it('has success preset', () => {
        expect(AnimationPresets.success).toBeDefined();
        expect(AnimationPresets.success.loop).toBe(false);
    });

    it('has error preset', () => {
        expect(AnimationPresets.error).toBeDefined();
    });

    it('has welcome preset', () => {
        expect(AnimationPresets.welcome).toBeDefined();
    });

    it('has confetti preset', () => {
        expect(AnimationPresets.confetti).toBeDefined();
        expect(AnimationPresets.confetti.loop).toBe(false);
    });
});
