"use client";

import { BarChart3, Palette, Terminal, Copy, Check, ExternalLink, Activity } from "lucide-react";
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

type Status = 'online' | 'offline' | 'checking';

function getStatusColor(status: Status) {
    if (status === 'online') return 'bg-green-500';
    if (status === 'offline') return 'bg-red-500';
    return 'bg-yellow-500';
}

function getStatusLabel(status: Status) {
    if (status === 'online') return 'Active';
    if (status === 'offline') return 'Offline';
    return 'Checking';
}

function DevToolCard({ title, description, command, localUrl, prodUrl, icon }: Readonly<Omit<DevToolInfo, 'id'>>) {
    const [copied, setCopied] = useState(false);
    const [isProduction, setIsProduction] = useState(false);
    const [status, setStatus] = useState<Status>('checking');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsProduction(
            globalThis.location.hostname !== 'localhost' &&
            globalThis.location.hostname !== '127.0.0.1'
        );
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            const urlToCheck = isProduction ? prodUrl : localUrl;

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                await fetch(urlToCheck, {
                    method: 'HEAD',
                    mode: 'no-cors',
                    signal: controller.signal,
                    cache: 'no-store'
                });

                clearTimeout(timeoutId);
                setStatus('online');
            } catch {
                setStatus('offline');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [isProduction, localUrl, prodUrl]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    return (
        <div className="p-4 rounded-xl bg-secondary/30 border border-white/10 relative overflow-hidden group">
            {/* Status Indicator Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${statusColor}`} />

            <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                    <span className="text-amber-500">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="font-medium text-sm truncate">{title}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`w-2 h-2 rounded-full ${statusColor} ${status !== 'offline' ? 'animate-pulse' : ''}`} />
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                {statusLabel}
                            </span>
                        </div>
                    </div>
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
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline hover:text-primary/80 transition-colors"
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Service Status & Tools
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                        {isProduction ? "(production build)" : "(local env)"}
                    </span>
                </h2>
                <div className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest font-bold">
                    Real-time Monitoring
                </div>
            </div>
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
