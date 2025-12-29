"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const DynamicChatWidget = dynamic(
    () => import("./ChatWidget").then((mod) => mod.ChatWidget),
    { ssr: false }
);

export function ChatWidgetWrapper() {
    return (
        <ErrorBoundary name="ChatWidget">
            <DynamicChatWidget />
        </ErrorBoundary>
    );
}
