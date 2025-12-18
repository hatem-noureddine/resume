"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LottieIconProps {
    /** Lottie animation data (JSON object) */
    animationData: object;
    /** Trigger type for animation */
    trigger?: "autoplay" | "hover" | "click" | "view";
    /** Whether to loop the animation */
    loop?: boolean;
    /** Animation speed (1 = normal) */
    speed?: number;
    /** CSS class name */
    className?: string;
    /** Width in pixels or CSS value */
    width?: number | string;
    /** Height in pixels or CSS value */
    height?: number | string;
    /** Accessible label */
    ariaLabel?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export function LottieIcon({
    animationData,
    trigger = "autoplay",
    loop = false,
    speed = 1,
    className = "",
    width = 24,
    height = 24,
    ariaLabel,
    onComplete,
}: Readonly<LottieIconProps>) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Set animation speed
    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(speed);
        }
    }, [speed]);

    // Handle reduced motion preference
    const shouldAutoplay = trigger === "autoplay" && !prefersReducedMotion;
    const shouldLoop = loop && !prefersReducedMotion;

    // Handle hover trigger
    const handleMouseEnter = () => {
        if (trigger === "hover" && lottieRef.current && !prefersReducedMotion) {
            lottieRef.current.goToAndPlay(0);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === "hover" && lottieRef.current) {
            lottieRef.current.stop();
        }
    };

    // Handle click trigger
    const handleClick = () => {
        if (trigger === "click" && lottieRef.current && !prefersReducedMotion) {
            lottieRef.current.goToAndPlay(0);
        }
    };

    // Handle keyboard support for click trigger
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (trigger === "click" && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            handleClick();
        }
    };

    // Handle animation complete
    const handleComplete = () => {
        onComplete?.();
    };

    // For reduced motion, show first frame only
    useEffect(() => {
        if (prefersReducedMotion && lottieRef.current) {
            lottieRef.current.goToAndStop(0, true);
        }
    }, [prefersReducedMotion]);

    // Determine appropriate role and tabIndex for accessibility
    const isClickable = trigger === "click";
    const getRole = (): string | undefined => {
        if (isClickable) return "button";
        if (ariaLabel) return "img";
        return undefined;
    };
    const role = getRole();
    const tabIndex = isClickable ? 0 : undefined;

    // Focus ring class for keyboard navigation
    const focusClasses = isClickable ? "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" : "";

    return (
        <div
            className={`inline-flex items-center justify-center ${focusClasses} ${className}`}
            style={{ width, height }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={role}
            aria-label={ariaLabel}
            tabIndex={tabIndex}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={shouldLoop}
                autoplay={shouldAutoplay}
                onComplete={handleComplete}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}

/**
 * Simple wrapper for autoplay looping animations (like loading spinners)
 */
interface LottieLoaderProps {
    animationData: object;
    className?: string;
    size?: number;
}

export function LottieLoader({
    animationData,
    className = "",
    size = 48,
}: Readonly<LottieLoaderProps>) {
    return (
        <LottieIcon
            animationData={animationData}
            trigger="autoplay"
            loop
            width={size}
            height={size}
            className={className}
            ariaLabel="Loading"
        />
    );
}
