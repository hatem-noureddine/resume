"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function AnimatedBackground() {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-30" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Static Gradient Overlay - cheaper than animating the gradient property */}
            <div className="absolute inset-0 opacity-40 bg-radial-[circle_at_20%_30%] from-primary/10 to-transparent" />
            <div className="absolute inset-0 opacity-40 bg-radial-[circle_at_80%_70%] from-purple-500/10 to-transparent" />

            {/* Primary Blob - Top Right with color animation */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                    background: [
                        "rgba(99, 102, 241, 0.2)",
                        "rgba(168, 85, 247, 0.2)",
                        "rgba(59, 130, 246, 0.2)",
                        "rgba(99, 102, 241, 0.2)"
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-40"
            />

            {/* Secondary Blob - Bottom Left with color animation */}
            <motion.div
                animate={{
                    x: [0, -50, 100, 0],
                    y: [0, 50, -50, 0],
                    scale: [1, 1.3, 0.8, 1],
                    background: [
                        "rgba(168, 85, 247, 0.2)",
                        "rgba(236, 72, 153, 0.2)",
                        "rgba(168, 85, 247, 0.2)",
                        "rgba(99, 102, 241, 0.2)"
                    ],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-40"
            />

            {/* Moving gradient band */}
            <motion.div
                animate={{
                    x: ["-100%", "100%"],
                    opacity: [0, 0.2, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/3 w-full h-[150px] bg-linear-to-r from-transparent via-primary/5 to-transparent blur-3xl"
            />
        </div>
    );
}
