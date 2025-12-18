"use client";

import { useState, useEffect, useCallback } from "react";

interface UseRatingOptions {
    storageKey?: string;
    maxRating?: number;
    initialRating?: number; // Admin override for testing
}

interface RatingData {
    rating: number;
    timestamp: string;
    guestId: string;
}

interface UseRatingReturn {
    rating: number;
    setRating: (value: number) => void;
    hasRated: boolean;
    averageRating: number;
    totalRatings: number;
    resetRating: () => void;
    guestId: string | null;
}

// Simple UUID generator (client-side only)
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback: use timestamp and performance.now() for uniqueness (non-cryptographic use case)
    return `user_${Date.now().toString(36)}_${Math.floor(performance.now()).toString(36)}`;
}

/**
 * Custom hook for managing blog post ratings with localStorage persistence.
 * Uses persistent Guest ID for identity management.
 */
export function useRating(postSlug: string, options: UseRatingOptions = {}): UseRatingReturn {
    const {
        storageKey = "blog-ratings",
        maxRating = 5,
        initialRating = 0
    } = options;

    const [rating, setRatingState] = useState<number>(initialRating);
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number>(initialRating || 0);
    const [totalRatings, setTotalRatings] = useState<number>(initialRating ? 1 : 0);
    const [guestId, setGuestId] = useState<string | null>(null);

    // Get storage keys
    const guestIdKey = `${storageKey}-guest-id`;
    const userRatingKey = `${storageKey}-user-${postSlug}`;
    const aggregateKey = `${storageKey}-aggregate-${postSlug}`;

    // Initialize Guest ID and load ratings
    useEffect(() => {
        if (globalThis.window === undefined) return;

        try {
            // 1. Manage Guest Identity
            let currentGuestId = localStorage.getItem(guestIdKey);
            if (!currentGuestId) {
                currentGuestId = generateUUID();
                localStorage.setItem(guestIdKey, currentGuestId);
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading persisted identity on mount
            setGuestId(currentGuestId);

            // 2. Load User Rating
            const savedRating = localStorage.getItem(userRatingKey);
            if (savedRating) {
                const data: RatingData = JSON.parse(savedRating);
                // Verify ownership with guestId (basic check)
                if (data.guestId === currentGuestId) {
                    setRatingState(data.rating);
                    setHasRated(true);
                }
            }

            // 3. Load Aggregate Ratings
            const aggregateData = localStorage.getItem(aggregateKey);
            if (aggregateData) {
                const { sum, count } = JSON.parse(aggregateData);
                setAverageRating(count > 0 ? sum / count : 0);
                setTotalRatings(count);
            } else if (initialRating > 0) {
                // Admin Override: If no real data, use initialRating prop
                setAverageRating(initialRating);
                setTotalRatings(1);
            }

        } catch (error) {
            console.error("Error initializing rating:", error);
        }
    }, [userRatingKey, aggregateKey, guestIdKey, initialRating]);

    // Set rating
    const setRating = useCallback((value: number) => {
        if (globalThis.window === undefined || !guestId) return;

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
            } else if (initialRating > 0) {
                // Include admin "seed" value if it was the only data
                sum = initialRating;
                count = 1;
            }

            // Check if upgrading existing rating
            const existingRating = localStorage.getItem(userRatingKey);
            if (existingRating) {
                const oldData: RatingData = JSON.parse(existingRating);
                sum -= oldData.rating; // Remove old score
            } else {
                count += 1; // New voter
            }

            sum += clampedValue;

            // Save individual rating
            const ratingData: RatingData = {
                rating: clampedValue,
                timestamp: new Date().toISOString(),
                guestId: guestId
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
            console.error("Error saving rating:", error);
        }
    }, [userRatingKey, aggregateKey, maxRating, guestId, initialRating]);

    // Reset rating (Admin/Debug utility)
    const resetRating = useCallback(() => {
        if (globalThis.window === undefined) return;

        try {
            const existingRating = localStorage.getItem(userRatingKey);
            if (existingRating) {
                const oldData: RatingData = JSON.parse(existingRating);

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
                        setAverageRating(initialRating || 0);
                        setTotalRatings(initialRating ? 1 : 0);
                    }
                }
                localStorage.removeItem(userRatingKey);
            }
            setRatingState(0);
            setHasRated(false);
        } catch (error) {
            console.error("Error resetting rating:", error);
        }
    }, [userRatingKey, aggregateKey, initialRating]);

    return {
        rating,
        setRating,
        hasRated,
        averageRating,
        totalRatings,
        resetRating,
        guestId
    };
}
