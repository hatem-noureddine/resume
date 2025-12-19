"use client";

import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';

interface SectionTrackerProps {
    sectionId: string;
    children: React.ReactNode;
    threshold?: number;
}

/**
 * A wrapper component that tracks how long a section is visible.
 * Logs a 'section_view' event to Vercel Analytics if visible for more than 2 seconds.
 */
export function SectionTracker({ sectionId, children, threshold = 0.5 }: Readonly<SectionTrackerProps>) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasTracked = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !timerRef.current && !hasTracked.current) {
                    timerRef.current = setTimeout(() => {
                        track('section_view', {
                            section_id: sectionId,
                            timestamp: new Date().toISOString()
                        });
                        hasTracked.current = true;
                    }, 2000); // 2 seconds visibility threshold
                } else if (!entry.isIntersecting && timerRef.current) {
                    // Clear timer if section leaves viewport before 2 seconds
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            },
            { threshold }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [sectionId, threshold]);

    return (
        <div ref={sectionRef} id={`${sectionId}-tracker`}>
            {children}
        </div>
    );
}
