"use client";

import { useState, useEffect, useCallback } from "react";

interface UseRatingOptions {
    storageKey?: string;
    maxRating?: number;
}

interface RatingData {
    rating: number;
    timestamp: string;
}

interface UseRatingReturn {
    rating: number;
    setRating: (value: number) => void;
    hasRated: boolean;
    averageRating: number;
    totalRatings: number;
    resetRating: () => void;
}

/**
 * Custom hook for managing blog post ratings with localStorage persistence.
 * Stores individual user rating and aggregates all ratings for a post.
 */
export function useRating(postSlug: string, options: UseRatingOptions = {}): UseRatingReturn {
    const { storageKey = "blog-ratings", maxRating = 5 } = options;

    const [rating, setRatingState] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [totalRatings, setTotalRatings] = useState<number>(0);

    // Get the user's rating key
    const userRatingKey = `${storageKey}-user-${postSlug}`;
    const aggregateKey = `${storageKey}-aggregate-${postSlug}`;

    // Load rating from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            // Load user's rating
            const savedRating = localStorage.getItem(userRatingKey);
            if (savedRating) {
                const data: RatingData = JSON.parse(savedRating);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRatingState(data.rating); // Suppress warning: necessary for hydration
                setHasRated(true);
            }

            // Load aggregate ratings
            const aggregateData = localStorage.getItem(aggregateKey);
            if (aggregateData) {
                const { sum, count } = JSON.parse(aggregateData);
                setAverageRating(count > 0 ? sum / count : 0);
                setTotalRatings(count);
            }
        } catch (error) {
            console.error("Error loading rating from localStorage:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRatingKey, aggregateKey]);

    // Set rating and persist to localStorage
    const setRating = useCallback((value: number) => {
        if (typeof window === "undefined") return;

        // Clamp value between 1 and maxRating
        const clampedValue = Math.max(1, Math.min(value, maxRating));

        try {
            // Get current aggregate
            const aggregateData = localStorage.getItem(aggregateKey);
            let sum = 0;
            let count = 0;

            if (aggregateData) {
                const parsed = JSON.parse(aggregateData);
                sum = parsed.sum;
                count = parsed.count;
            }

            // If user already rated, subtract old rating
            const existingRating = localStorage.getItem(userRatingKey);
            if (existingRating) {
                const oldData: RatingData = JSON.parse(existingRating);
                sum -= oldData.rating;
            } else {
                // New rating, increment count
                count += 1;
            }

            // Add new rating
            sum += clampedValue;

            // Save user rating
            const ratingData: RatingData = {
                rating: clampedValue,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(userRatingKey, JSON.stringify(ratingData));

            // Save aggregate
            localStorage.setItem(aggregateKey, JSON.stringify({ sum, count }));

            // Update state
            setRatingState(clampedValue);
            setHasRated(true);
            setAverageRating(count > 0 ? sum / count : 0);
            setTotalRatings(count);
        } catch (error) {
            console.error("Error saving rating to localStorage:", error);
        }
    }, [userRatingKey, aggregateKey, maxRating]);

    // Reset user's rating
    const resetRating = useCallback(() => {
        if (typeof window === "undefined") return;

        try {
            // Get current rating to subtract from aggregate
            const existingRating = localStorage.getItem(userRatingKey);
            if (existingRating) {
                const oldData: RatingData = JSON.parse(existingRating);

                // Update aggregate
                const aggregateData = localStorage.getItem(aggregateKey);
                if (aggregateData) {
                    const { sum, count } = JSON.parse(aggregateData);
                    const newSum = sum - oldData.rating;
                    const newCount = count - 1;

                    if (newCount > 0) {
                        localStorage.setItem(aggregateKey, JSON.stringify({
                            sum: newSum,
                            count: newCount
                        }));
                        setAverageRating(newSum / newCount);
                        setTotalRatings(newCount);
                    } else {
                        localStorage.removeItem(aggregateKey);
                        setAverageRating(0);
                        setTotalRatings(0);
                    }
                }

                localStorage.removeItem(userRatingKey);
            }

            setRatingState(0);
            setHasRated(false);
        } catch (error) {
            console.error("Error resetting rating:", error);
        }
    }, [userRatingKey, aggregateKey]);

    return {
        rating,
        setRating,
        hasRated,
        averageRating,
        totalRatings,
        resetRating,
    };
}
