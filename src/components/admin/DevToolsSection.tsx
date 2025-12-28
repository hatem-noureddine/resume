"use client";

import { BarChart3, Palette, Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

interface DevToolInfo {
    title: string;
    description: string;
    command: string;
    url: string;
    icon: React.ReactNode;
}

const devTools: DevToolInfo[] = [
    {
        title: "Bundle Analyzer",
        description: "Analyze bundle size and dependencies",
        command: "npm run analyze",
        url: "http://localhost:8888",
        icon: <BarChart3 className="w-5 h-5" />,
    },
    {
        title: "Storybook",
        description: "Component documentation playground",
        command: "npm run storybook",
        url: "http://localhost:6006",
        icon: <Palette className="w-5 h-5" />,
    },
];

function DevToolCard({ title, description, command, url, icon }: DevToolInfo) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 rounded-xl bg-secondary/30 border border-white/10">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                    <span className="text-amber-500">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{description}</p>

                    {/* Command to run */}
                    <div className="flex items-center gap-2 mb-2">
                        <code className="flex-1 px-2 py-1 bg-black/30 rounded text-xs font-mono text-amber-400 truncate">
                            {command}
                        </code>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                            title="Copy command"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                        </button>
                    </div>

                    {/* Open link */}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                        <Terminal className="w-3 h-3" />
                        Open at {url}
                    </a>
                </div>
            </div>
        </div>
    );
}

export function DevToolsSection() {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-500" />
                Developer Tools
                <span className="text-xs font-normal text-muted-foreground ml-2">(requires terminal)</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                {devTools.map((tool) => (
                    <DevToolCard key={tool.title} {...tool} />
                ))}
            </div>
        </section>
    );
}
