"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/lottie/empty-state.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Search } from "lucide-react";

interface EmptyStateProps {
    /** Main message */
    title: string;
    /** Optional description */
    description?: string;
    /** Optional action button */
    action?: React.ReactNode;
    /** Custom Lottie animation data (defaults to search/empty animation) */
    animationData?: object;
    /** Size of the animation */
    size?: number;
}

export function EmptyState({
    title,
    description,
    action,
    animationData = emptyAnimation,
    size = 150,
}: EmptyStateProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            {/* Animation or static icon */}
            <div className="mb-6" style={{ width: size, height: size }}>
                {prefersReducedMotion ? (
                    <div className="w-full h-full flex items-center justify-center text-secondary-foreground/50">
                        <Search size={size * 0.5} />
                    </div>
                ) : (
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-secondary-foreground max-w-md mb-6">
                    {description}
                </p>
            )}

            {/* Action */}
            {action && <div className="mt-2">{action}</div>}
        </motion.div>
    );
}
