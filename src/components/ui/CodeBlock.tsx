"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlight, Prism } from "prism-react-renderer";

// Add Kotlin language support
 
(typeof global !== "undefined" ? global : window).Prism = Prism;
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Required for Prism language loading
require("prismjs/components/prism-kotlin");

// Android Studio Darcula theme - exact color values
const androidStudioTheme = {
    plain: {
        color: "#A9B7C6",           // Default text
        backgroundColor: "#2B2B2B", // Darcula background
    },
    styles: [
        // Comments - gray italic
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: { color: "#808080", fontStyle: "italic" as const },
        },
        // Punctuation
        {
            types: ["punctuation"],
            style: { color: "#A9B7C6" },
        },
        // Keywords - orange (fun, val, var, class, if, else, when, etc.)
        {
            types: ["keyword", "atrule", "attr-value"],
            style: { color: "#CC7832", fontWeight: "bold" as const },
        },
        // Strings - green
        {
            types: ["string", "char", "attr-name"],
            style: { color: "#6A8759" },
        },
        // Numbers - blue
        {
            types: ["number", "constant"],
            style: { color: "#6897BB" },
        },
        // Boolean, null
        {
            types: ["boolean"],
            style: { color: "#CC7832" },
        },
        // Functions - yellow/gold
        {
            types: ["function", "function-variable"],
            style: { color: "#FFC66D" },
        },
        // Class names - light blue
        {
            types: ["class-name", "maybe-class-name"],
            style: { color: "#A9B7C6" },
        },
        // Annotations - yellow (@Composable, @Test, etc.)
        {
            types: ["annotation", "decorator"],
            style: { color: "#BBB529" },
        },
        // Operators
        {
            types: ["operator", "entity", "url"],
            style: { color: "#A9B7C6" },
        },
        // Properties and variables - purple
        {
            types: ["property", "variable", "tag", "symbol"],
            style: { color: "#9876AA" },
        },
        // Regex
        {
            types: ["regex", "important"],
            style: { color: "#CC7832" },
        },
        // Built-in types (Int, String, etc.)
        {
            types: ["builtin"],
            style: { color: "#CC7832" },
        },
        // Namespace
        {
            types: ["namespace"],
            style: { color: "#A9B7C6", opacity: 0.7 },
        },
    ],
};

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
    showLineNumbers?: boolean;
}

export function CodeBlock({
    code,
    language = "kotlin",
    className,
    showLineNumbers = true
}: Readonly<CodeBlockProps>) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Normalize language names
    const normalizedLanguage = language.toLowerCase()
        .replace("language-", "")
        .replace("kt", "kotlin")
        .replace("js", "javascript")
        .replace("ts", "typescript")
        .replace("tsx", "typescript")
        .replace("jsx", "javascript");

    return (
        <div className="relative group my-6">
            {/* Language badge */}
            <div className="absolute top-0 left-4 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full capitalize">
                {normalizedLanguage}
            </div>

            {/* Copy button */}
            <button
                onClick={copyToClipboard}
                aria-label={copied ? "Copied!" : "Copy code"}
                className={cn(
                    "absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 z-10",
                    "opacity-0 group-hover:opacity-100 focus:opacity-100",
                    copied
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                )}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Syntax highlighted code block */}
            <Highlight
                theme={androidStudioTheme}
                code={code.trim()}
                language={normalizedLanguage}
            >
                {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={cn(
                            highlightClassName,
                            "overflow-x-auto p-4 pt-8 rounded-xl font-mono text-sm border border-white/10",
                            className
                        )}
                        style={style}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} className="table-row">
                                {showLineNumbers && (
                                    <span className="table-cell pr-4 text-right text-white/30 select-none text-xs">
                                        {i + 1}
                                    </span>
                                )}
                                <span className="table-cell">
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}

// Legacy component for backwards compatibility with ReactMarkdown
interface LegacyCodeBlockProps {
    children: React.ReactNode;
    className?: string;
}

export function CodeBlockLegacy({ children, className }: LegacyCodeBlockProps) {
    // Extract language from className (e.g., "language-kotlin")
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';

    // Extract text from children
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (!node) return '';
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (typeof node === 'object' && 'props' in node) {
            return extractText((node as { props: { children?: React.ReactNode } }).props.children);
        }
        return '';
    };

    const code = extractText(children);

    return <CodeBlock code={code} language={language} />;
}
