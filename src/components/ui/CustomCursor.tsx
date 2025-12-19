"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Position {
    x: number;
    y: number;
}

/**
 * Custom cursor component with smooth trailing effect.
 * Automatically hides on touch devices and respects reduced motion preferences.
 * 
 * Usage: Add to layout.tsx to enable site-wide custom cursor:
 * ```tsx
 * <CustomCursor />
 * ```
 */
export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Smooth spring animation for cursor follow
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Outer ring with slower follow
    const ringConfig = { damping: 20, stiffness: 200 };
    const ringXSpring = useSpring(cursorX, ringConfig);
    const ringYSpring = useSpring(cursorY, ringConfig);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        setIsVisible(true);
    }, [cursorX, cursorY]);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    // Check for hover states on interactive elements
    const handleElementHover = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
        setIsHovering(!!isInteractive);
    }, []);

    useEffect(() => {
        // Detect touch devices
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in globalThis || globalThis.navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();

        if (isTouchDevice || prefersReducedMotion) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleElementHover);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleElementHover);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isTouchDevice, prefersReducedMotion, handleMouseMove, handleElementHover, handleMouseEnter, handleMouseLeave]);

    // Don't render on touch devices or if reduced motion is preferred
    if (isTouchDevice || prefersReducedMotion) {
        return null;
    }

    return (
        <>
            {/* Hide default cursor */}
            <style dangerouslySetInnerHTML={{
                __html: `
                * {
                    cursor: none !important;
                }
                a, button, [role="button"], input, textarea, select {
                    cursor: none !important;
                }
            `}} />

            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -ml-1 -mt-1 bg-white rounded-full"
                    animate={{
                        width: isHovering ? 12 : 8,
                        height: isHovering ? 12 : 8,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9998"
                style={{
                    x: ringXSpring,
                    y: ringYSpring,
                }}
            >
                <motion.div
                    className="relative rounded-full border-2 border-primary/50"
                    animate={{
                        width: isHovering ? 48 : 32,
                        height: isHovering ? 48 : 32,
                        marginLeft: isHovering ? -24 : -16,
                        marginTop: isHovering ? -24 : -16,
                        opacity: isVisible ? 0.6 : 0,
                        scale: isHovering ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </>
    );
}
