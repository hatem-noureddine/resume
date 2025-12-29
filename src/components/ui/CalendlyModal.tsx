"use client";

import { Modal } from "./Modal";
import { InlineWidget } from "react-calendly";
import { SITE_CONFIG } from "@/config/site";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface CalendlyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CalendlyModal({ isOpen, onClose }: Readonly<CalendlyModalProps>) {
    // We need to mount the widget only when open to avoid pre-loading scripts unnecessarily
    const [delayedOpen, setDelayedOpen] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDelayedOpen(true);
        } else {
            const timer = setTimeout(() => setDelayedOpen(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const shouldRender = isOpen || delayedOpen;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Schedule a Call"
            size="lg"
            className="h-[80vh] md:h-[700px] flex flex-col"
        >
            {shouldRender && (
                <div className="relative w-full h-full min-h-[600px] flex-1">
                    {/* Loading fallback - Calendly acts weird with Suspense, so we rely on its own loader usually, 
                         but we can put a spinner behind it */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>

                    <InlineWidget
                        url={SITE_CONFIG.calendlyUrl}
                        styles={{
                            height: "100%",
                            width: "100%",
                            minHeight: "600px" // Ensure enough height for the calendar
                        }}
                    />
                </div>
            )}
        </Modal>
    );
}
