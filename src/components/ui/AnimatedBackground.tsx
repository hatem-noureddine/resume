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
            {/* Primary Blob - Top Right */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-40"
            />

            {/* Secondary Blob - Bottom Left */}
            <motion.div
                animate={{
                    x: [0, -50, 100, 0],
                    y: [0, 50, -50, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-500/20 rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-40"
            />

            {/* Floating particles - subtle dust effect */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, (i % 2 === 0 ? 50 : -50), 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 10 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                    }}
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${40 + i * 20}%`
                    }}
                    className="absolute w-2 h-2 md:w-4 md:h-4 bg-primary rounded-full blur-xs opacity-30"
                />
            ))}
        </div>
    );
}
