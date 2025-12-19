"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

type AnnouncementPoliteness = "polite" | "assertive";

interface AnnouncerContextType {
    announce: (message: string, politeness?: AnnouncementPoliteness) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

interface AnnouncerProviderProps {
    readonly children: ReactNode;
}

/**
 * Provider component that manages screen reader announcements using ARIA live regions.
 * Wrap your app with this provider to enable announcements throughout.
 * 
 * Usage:
 * ```tsx
 * <AnnouncerProvider>
 *   <App />
 * </AnnouncerProvider>
 * ```
 */
export function AnnouncerProvider({ children }: AnnouncerProviderProps) {
    const [politeMessage, setPoliteMessage] = useState("");
    const [assertiveMessage, setAssertiveMessage] = useState("");

    const announce = useCallback((message: string, politeness: AnnouncementPoliteness = "polite") => {
        // Clear the message first to ensure screen readers announce repeated messages
        if (politeness === "assertive") {
            setAssertiveMessage("");
            // Use setTimeout to ensure the clear happens before the new message
            setTimeout(() => setAssertiveMessage(message), 50);
        } else {
            setPoliteMessage("");
            setTimeout(() => setPoliteMessage(message), 50);
        }
    }, []);

    const value = useMemo(() => ({ announce }), [announce]);

    return (
        <AnnouncerContext.Provider value={value}>
            {children}
            {/* Live regions for screen readers - visually hidden */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {politeMessage}
            </div>
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            >
                {assertiveMessage}
            </div>
        </AnnouncerContext.Provider>
    );
}

/**
 * Hook to access the announcer for making screen reader announcements.
 * 
 * Usage:
 * ```tsx
 * const { announce } = useAnnouncer();
 * 
 * const handleCopy = () => {
 *   navigator.clipboard.writeText(text);
 *   announce("Copied to clipboard!");
 * };
 * ```
 */
export function useAnnouncer() {
    const context = useContext(AnnouncerContext);

    if (!context) {
        throw new Error("useAnnouncer must be used within an AnnouncerProvider");
    }

    return context;
}
