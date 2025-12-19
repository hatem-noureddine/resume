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
            {/* Animated Gradient Overlay */}
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 opacity-60"
            />

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
                    opacity: [0, 0.3, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/3 w-full h-[200px] bg-linear-to-r from-transparent via-primary/10 to-transparent blur-3xl"
            />

            {/* Floating particles - subtle dust effect */}
            {['p1', 'p2', 'p3', 'p4', 'p5'].map((id, i) => (
                <motion.div
                    key={id}
                    animate={{
                        y: [0, -150, 0],
                        x: [0, (i % 2 === 0 ? 80 : -80), 0],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 12 + i * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 1.5
                    }}
                    style={{
                        left: `${10 + i * 20}%`,
                        top: `${30 + i * 12}%`
                    }}
                    className="absolute w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full blur-sm opacity-20"
                />
            ))}
        </div>
    );
}
