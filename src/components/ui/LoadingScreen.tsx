"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LottieLoader } from "@/components/ui/LottieIcon";
import loadingAnimation from "@/assets/lottie/loading-spinner.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LoadingScreenProps {
    minDuration?: number;
}

export function LoadingScreen({ minDuration = 1500 }: LoadingScreenProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 100);

        // Hide loading screen after minimum duration
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, minDuration);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [minDuration]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-9999 bg-background flex flex-col items-center justify-center"
                    data-testid="loading-screen"
                >
                    {/* Lottie animation or fallback logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {prefersReducedMotion ? (
                            <Logo className="w-20 h-20" />
                        ) : (
                            <LottieLoader
                                animationData={loadingAnimation}
                                size={80}
                            />
                        )}
                    </motion.div>

                    {/* Loading text */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-sm text-secondary-foreground tracking-widest uppercase"
                    >
                        Loading
                        {!prefersReducedMotion && (
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                ...
                            </motion.span>
                        )}
                        {prefersReducedMotion && "..."}
                    </motion.p>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 200 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 h-1 bg-secondary rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-linear-to-r from-primary to-purple-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ ease: "easeOut" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

