'use client';

import { ComponentProps, Suspense, lazy, useState } from 'react';
import { cn } from '@/lib/utils';

// Lazy load lottie-react for code splitting
const Lottie = lazy(() => import('lottie-react'));

type LottieProps = ComponentProps<typeof Lottie>;

interface LottieAnimationProps {
    animationData: LottieProps['animationData'];
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    fallback?: React.ReactNode;
    onComplete?: () => void;
}

/**
 * Lottie animation component with lazy loading and fallback.
 * 
 * Usage:
 * ```tsx
 * import animationData from './animation.json';
 * 
 * <LottieAnimation
 *   animationData={animationData}
 *   loop={true}
 *   className="w-64 h-64"
 * />
 * ```
 */
export function LottieAnimation({
    animationData,
    loop = true,
    autoplay = true,
    className = '',
    fallback,
    onComplete,
}: Readonly<LottieAnimationProps>) {
    const [isLoaded, setIsLoaded] = useState(false);

    const defaultFallback = (
        <div
            className={cn(
                'flex items-center justify-center bg-secondary/50 rounded-lg animate-pulse',
                className
            )}
            aria-label="Loading animation..."
        >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <Suspense fallback={fallback || defaultFallback}>
            <div className={cn('relative', !isLoaded && 'opacity-0', className)}>
                <Lottie
                    animationData={animationData}
                    loop={loop}
                    autoplay={autoplay}
                    onDOMLoaded={() => setIsLoaded(true)}
                    onComplete={onComplete}
                    aria-hidden="true"
                />
            </div>
        </Suspense>
    );
}

/**
 * Preset animations for common use cases.
 * Use with LottieAnimation component.
 */
export const AnimationPresets = {
    /**
     * Usage: Import your JSON animation data and use with LottieAnimation
     * 
     * Example:
     * ```tsx
     * import loadingAnimation from '@/animations/loading.json';
     * <LottieAnimation animationData={loadingAnimation} />
     * ```
     */
    loading: {
        name: 'Loading',
        loop: true,
        autoplay: true,
    },
    success: {
        name: 'Success',
        loop: false,
        autoplay: true,
    },
    error: {
        name: 'Error',
        loop: false,
        autoplay: true,
    },
    welcome: {
        name: 'Welcome',
        loop: true,
        autoplay: true,
    },
    confetti: {
        name: 'Confetti',
        loop: false,
        autoplay: true,
    },
} as const;

interface AnimatedIconProps {
    animationData: LottieProps['animationData'];
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
};

/**
 * Animated icon using Lottie.
 * 
 * Usage:
 * ```tsx
 * <AnimatedIcon animationData={iconAnimation} size="md" />
 * ```
 */
export function AnimatedIcon({
    animationData,
    size = 'md',
    className = '',
}: Readonly<AnimatedIconProps>) {
    return (
        <LottieAnimation
            animationData={animationData}
            className={cn(sizeClasses[size], className)}
            loop={true}
            autoplay={true}
        />
    );
}
