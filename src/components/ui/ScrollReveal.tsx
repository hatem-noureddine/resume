"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    threshold?: number;
}

export function ScrollReveal({
    children,
    className = "",
    direction = "up",
    delay = 0,
    duration = 0.5,
    threshold = 0.2
}: ScrollRevealProps) {
    const getInitialVariants = () => {
        switch (direction) {
            case "up":
                return { opacity: 0, y: 50 };
            case "down":
                return { opacity: 0, y: -50 };
            case "left":
                return { opacity: 0, x: 50 };
            case "right":
                return { opacity: 0, x: -50 };
            default:
                return { opacity: 0, y: 50 };
        }
    };

    const initialVariants = getInitialVariants();

    return (
        <motion.div
            className={className}
            initial={initialVariants}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            viewport={{ once: true, amount: threshold }}
            transition={{
                duration,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}
