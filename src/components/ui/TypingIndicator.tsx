"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import typingAnimation from "@/../public/lottie/typing-indicator.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function TypingIndicator() {
    const prefersReducedMotion = usePrefersReducedMotion();

    // Use Lottie animation when motion is allowed
    if (!prefersReducedMotion) {
        return (
            <div className="flex items-center h-5 px-1">
                <Lottie
                    animationData={typingAnimation}
                    loop
                    autoplay
                    style={{ width: 40, height: 20 }}
                />
            </div>
        );
    }

    // Fallback for reduced motion: simple animated dots with CSS
    return (
        <div className="flex items-center gap-1 h-5 px-1">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut"
                    }}
                    className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                />
            ))}
        </div>
    );
}

