"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRating } from "@/hooks/useRating";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface StarRatingProps {
    postSlug: string;
    maxStars?: number;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
    showAverage?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

const gapClasses = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
};

/**
 * Star Rating component for blog posts.
 * Displays interactive 5-star rating with localStorage persistence.
 */
export function StarRating({
    postSlug,
    maxStars = 5,
    size = "md",
    showCount = true,
    showAverage = true,
    className,
}: StarRatingProps) {
    const { rating, setRating, hasRated, averageRating, totalRatings } = useRating(postSlug);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleStarClick = useCallback((starIndex: number) => {
        setRating(starIndex);
    }, [setRating]);

    const handleMouseEnter = useCallback((starIndex: number) => {
        setIsHovering(true);
        setHoverRating(starIndex);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        setHoverRating(0);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, starIndex: number) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setRating(starIndex);
        }
    }, [setRating]);

    // Determine which stars to fill
    const displayRating = isHovering ? hoverRating : rating;

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div
                className={cn("flex items-center", gapClasses[size])}
                onMouseLeave={handleMouseLeave}
                role="group"
                aria-label="Rate this article"
            >
                {Array.from({ length: maxStars }, (_, index) => {
                    const starIndex = index + 1;
                    const isFilled = starIndex <= displayRating;
                    const isPartiallyFilled = !isFilled && starIndex <= Math.ceil(averageRating) && !hasRated && !isHovering;

                    return (
                        <motion.button
                            key={starIndex}
                            type="button"
                            onClick={() => handleStarClick(starIndex)}
                            onMouseEnter={() => handleMouseEnter(starIndex)}
                            onKeyDown={(e) => handleKeyDown(e, starIndex)}
                            className={cn(
                                "relative focus:outline-none focus:ring-2 focus:ring-primary/50 rounded transition-transform",
                                isHovering && "cursor-pointer",
                                !prefersReducedMotion && "hover:scale-110"
                            )}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.2 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                            aria-label={`Rate ${starIndex} out of ${maxStars} stars`}
                            aria-pressed={rating === starIndex}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    "transition-colors duration-200",
                                    isFilled
                                        ? "fill-amber-400 text-amber-400"
                                        : isPartiallyFilled
                                            ? "fill-amber-400/30 text-amber-400/50"
                                            : "fill-transparent text-muted-foreground/50 hover:text-amber-400/70"
                                )}
                            />
                        </motion.button>
                    );
                })}
            </div>

            {/* Rating info */}
            <AnimatePresence mode="wait">
                {(showAverage || showCount) && totalRatings > 0 && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, y: -5 }}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                        {showAverage && (
                            <span className="font-medium">
                                {averageRating.toFixed(1)}
                            </span>
                        )}
                        {showCount && (
                            <span>
                                ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Thank you message */}
            <AnimatePresence>
                {hasRated && (
                    <motion.p
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
                        className="text-xs text-primary font-medium"
                    >
                        Thanks for rating!
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
