"use client";

import { BarChart3, Palette, Terminal, Copy, Check, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface DevToolInfo {
    id: string;
    title: string;
    description: string;
    command: string;
    localUrl: string;
    prodUrl: string;
    icon: React.ReactNode;
}

const devTools: DevToolInfo[] = [
    {
        id: "analyzer",
        title: "Bundle Analyzer",
        description: "Analyze bundle size and dependencies",
        command: "npm run analyze",
        localUrl: "http://localhost:8888",
        prodUrl: "/admin/analyze/client.html",
        icon: <BarChart3 className="w-5 h-5" />,
    },
    {
        id: "storybook",
        title: "Storybook",
        description: "Component documentation playground",
        command: "npm run storybook",
        localUrl: "http://localhost:6006",
        prodUrl: "/admin/storybook/index.html",
        icon: <Palette className="w-5 h-5" />,
    },
];

function DevToolCard({ title, description, command, localUrl, prodUrl, icon }: Readonly<Omit<DevToolInfo, 'id'>>) {
    const [copied, setCopied] = useState(false);
    const [isProduction, setIsProduction] = useState(false);

    useEffect(() => {
        // Safe way to check if we're on a production-like URL or environment
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsProduction(
            globalThis.location.hostname !== 'localhost' &&
            globalThis.location.hostname !== '127.0.0.1'
        );
    }, []);

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
                    <p className="text-xs text-muted-foreground mb-3">{description}</p>

                    {isProduction ? (
                        <div className="space-y-2">
                            <a
                                href={prodUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded-lg transition-colors border border-primary/20"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View Production Report
                            </a>
                            <p className="text-[10px] text-muted-foreground text-center">
                                Static export from last build
                            </p>
                        </div>
                    ) : (
                        <>
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
                                href={localUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                            >
                                <Terminal className="w-3 h-3" />
                                Open at {localUrl}
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export function DevToolsSection() {
    const [isProduction, setIsProduction] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsProduction(
            globalThis.location.hostname !== 'localhost' &&
            globalThis.location.hostname !== '127.0.0.1'
        );
    }, []);

    return (
        <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-500" />
                Developer Tools
                <span className="text-xs font-normal text-muted-foreground ml-2">
                    {isProduction ? "(built reports)" : "(requires terminal)"}
                </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                {devTools.map((tool) => (
                    <DevToolCard
                        key={tool.id}
                        title={tool.title}
                        description={tool.description}
                        command={tool.command}
                        localUrl={tool.localUrl}
                        prodUrl={tool.prodUrl}
                        icon={tool.icon}
                    />
                ))}
            </div>
        </section>
    );
}
