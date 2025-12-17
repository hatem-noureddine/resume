"use client";

import { useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Import all social Lottie animations
import githubAnimation from "@/../public/lottie/github-icon.json";
import linkedinAnimation from "@/../public/lottie/linkedin-icon.json";
import mailAnimation from "@/../public/lottie/mail-icon.json";
import downloadAnimation from "@/../public/lottie/download-arrow.json";

// Map of icon names to their Lottie data
const animations: Record<string, object> = {
    github: githubAnimation,
    linkedin: linkedinAnimation,
    mail: mailAnimation,
    download: downloadAnimation,
};

interface SocialLottieIconProps {
    /** Icon name */
    icon: "github" | "linkedin" | "mail" | "download";
    /** Size in pixels */
    size?: number;
    /** CSS class */
    className?: string;
}

/**
 * Interactive Lottie icons that play on hover
 * Falls back to static first frame when reduced motion is preferred
 */
export function SocialLottieIcon({
    icon,
    size = 24,
    className = "",
}: SocialLottieIconProps) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const animationData = animations[icon];

    if (!animationData) {
        return null;
    }

    const handleMouseEnter = () => {
        if (!prefersReducedMotion && lottieRef.current) {
            lottieRef.current.goToAndPlay(0);
        }
    };

    const handleMouseLeave = () => {
        if (!prefersReducedMotion && lottieRef.current) {
            lottieRef.current.stop();
        }
    };

    return (
        <div
            className={`inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={false}
                autoplay={false}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
