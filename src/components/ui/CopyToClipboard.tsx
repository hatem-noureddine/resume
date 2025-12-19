"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnnouncer } from "@/context/AnnouncerContext";

interface CopyToClipboardProps {
    text: string;
    className?: string;
}

export function CopyToClipboard({ text, className }: Readonly<CopyToClipboardProps>) {
    const [copied, setCopied] = useState(false);
    const { announce } = useAnnouncer();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            announce("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            announce("Failed to copy to clipboard", "assertive");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "inline-flex items-center justify-center p-1 rounded-md transition-all",
                copied
                    ? "text-green-500 bg-green-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                className
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
            aria-label={copied ? "Copied to clipboard" : `Copy ${text} to clipboard`}
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
    );
}
