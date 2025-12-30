"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AnimatedCounterProps {
    value: number | string;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function AnimatedCounter({
    value,
    duration = 2000,
    className,
    prefix = "",
    suffix = ""
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const numericValue = typeof value === "string" ? parseInt(value, 10) : value;
    const prefersReducedMotion = usePrefersReducedMotion();

    const animateValue = (start: number, end: number, duration: number) => {
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(start + (end - start) * easeOut);

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    useEffect(() => {
        if (prefersReducedMotion) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        animateValue(0, numericValue, duration);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [numericValue, duration, hasAnimated, prefersReducedMotion]);

    const valueToDisplay = prefersReducedMotion ? numericValue : displayValue;

    return (
        <span ref={ref} className={cn("tabular-nums", className)}>
            {prefix}{valueToDisplay}{suffix}
        </span>
    );
}
