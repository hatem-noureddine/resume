
"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function ReadingProgress() {
    const prefersReducedMotion = usePrefersReducedMotion();
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    if (prefersReducedMotion) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-50 pointer-events-none"
            style={{ scaleX }}
            role="progressbar"
            aria-label="Reading progress"
        />
    );
}
