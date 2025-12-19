"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ParallaxSectionProps {
    readonly children: ReactNode;
    readonly className?: string;
    /** Speed multiplier: positive values move up on scroll, negative move down. Default: 0.5 */
    readonly speed?: number;
}

/**
 * A section that creates a parallax scrolling effect.
 * Children will move at a different speed than the scroll.
 * 
 * Usage:
 * ```tsx
 * <ParallaxSection speed={0.3}>
 *   <img src="..." alt="Background" />
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({
    children,
    className = "",
    speed = 0.5
}: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to Y position
    const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y, opacity }}>
                {children}
            </motion.div>
        </div>
    );
}

interface ParallaxLayerProps {
    readonly children: ReactNode;
    readonly className?: string;
    /** Depth of the layer: 0 is at scroll speed, higher is slower (further back) */
    readonly depth?: number;
}

/**
 * A layer within a parallax context that moves at a different speed.
 * Use inside a container with relative positioning.
 * 
 * Usage:
 * ```tsx
 * <div className="relative h-screen">
 *   <ParallaxLayer depth={2}>
 *     <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
 *   </ParallaxLayer>
 *   <ParallaxLayer depth={0.5}>
 *     <h1>Foreground content</h1>
 *   </ParallaxLayer>
 * </div>
 * ```
 */
export function ParallaxLayer({
    children,
    className = "",
    depth = 1
}: ParallaxLayerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const { scrollYProgress } = useScroll({
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100 * depth]);

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}
