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

    // Determine appropriate role and element for accessibility
    const isClickable = trigger === "click";

    // Focus ring class for keyboard navigation
    const focusClasses = isClickable ? "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" : "";
    const containerClasses = `inline-flex items-center justify-center ${focusClasses} ${className}`;
    const containerStyle = { width, height };

    if (isClickable) {
        return (
            <button
                type="button"
                className={containerClasses}
                style={containerStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={ariaLabel}
            >
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={shouldLoop}
                    autoplay={shouldAutoplay}
                    onComplete={handleComplete}
                    style={{ width: "100%", height: "100%" }}
                />
            </button>
        );
    }

    return (
        <span
            className={containerClasses}
            style={containerStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role={ariaLabel ? "img" : "presentation"}
            aria-label={ariaLabel}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={shouldLoop}
                autoplay={shouldAutoplay}
                onComplete={handleComplete}
                style={{ width: "100%", height: "100%" }}
            />
        </span>
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
