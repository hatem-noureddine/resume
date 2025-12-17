"use client";

import { useState, ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    children: ReactNode;
    className?: string;
}

export function CodeBlock({ children, className }: Readonly<CodeBlockProps>) {
    const [copied, setCopied] = useState(false);

    const extractText = (node: ReactNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (!node) return '';
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (typeof node === 'object' && 'props' in node) {
            return extractText((node as { props: { children?: ReactNode } }).props.children);
        }
        return '';
    };

    const copyToClipboard = async () => {
        const text = extractText(children);
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Extract language from className (e.g., "language-typescript")
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : null;

    return (
        <div className="relative group my-6">
            {/* Language badge */}
            {language && (
                <div className="absolute top-0 left-4 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    {language}
                </div>
            )}

            {/* Copy button */}
            <button
                onClick={copyToClipboard}
                aria-label={copied ? "Copied!" : "Copy code"}
                className={cn(
                    "absolute top-3 right-3 p-2 rounded-lg transition-all duration-200",
                    "opacity-0 group-hover:opacity-100 focus:opacity-100",
                    copied
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                )}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Code block */}
            <pre className={cn(
                "overflow-x-auto p-4 pt-6 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm border border-white/10",
                className
            )}>
                {children}
            </pre>
        </div>
    );
}
