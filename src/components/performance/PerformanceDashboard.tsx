"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { Activity, Gauge, Clock, Zap, Eye, Download, History, List, AlertTriangle, RefreshCw } from "lucide-react";
import { getPerformanceHistory, clearPerformanceHistory, savePerformanceSnapshot, setBaseline, clearBaseline, type PagePerformanceHistory } from "@/lib/performance-store";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

interface VitalsData {
    CLS: number | null;
    FCP: number | null;
    INP: number | null;
    LCP: number | null;
    TTFB: number | null;
    [key: string]: number | null;
}

interface VitalInfo {
    name: string;
    fullName: string;
    unit: string;
    good: number;
    needsImprovement: number;
    icon: React.ReactNode;
    description: string;
}

const VITALS_INFO: Record<keyof VitalsData, VitalInfo> = {
    LCP: {
        name: "LCP",
        fullName: "Largest Contentful Paint",
        unit: "ms",
        good: 2500,
        needsImprovement: 4000,
        icon: <Eye className="w-5 h-5" />,
        description: "Time until largest content element is visible",
    },
    FCP: {
        name: "FCP",
        fullName: "First Contentful Paint",
        unit: "ms",
        good: 1800,
        needsImprovement: 3000,
        icon: <Clock className="w-5 h-5" />,
        description: "Time until first content is painted",
    },
    CLS: {
        name: "CLS",
        fullName: "Cumulative Layout Shift",
        unit: "",
        good: 0.1,
        needsImprovement: 0.25,
        icon: <Activity className="w-5 h-5" />,
        description: "Visual stability score (lower is better)",
    },
    INP: {
        name: "INP",
        fullName: "Interaction to Next Paint",
        unit: "ms",
        good: 200,
        needsImprovement: 500,
        icon: <Zap className="w-5 h-5" />,
        description: "Responsiveness to user interactions",
    },
    TTFB: {
        name: "TTFB",
        fullName: "Time to First Byte",
        unit: "ms",
        good: 800,
        needsImprovement: 1800,
        icon: <Gauge className="w-5 h-5" />,
        description: "Server response time",
    },
};

function getVitalStatus(value: number, info: VitalInfo): "good" | "needs-improvement" | "poor" {
    if (value <= info.good) return "good";
    if (value <= info.needsImprovement) return "needs-improvement";
    return "poor";
}

function getStatusColor(status: "good" | "needs-improvement" | "poor"): string {
    switch (status) {
        case "good":
            return "text-green-500";
        case "needs-improvement":
            return "text-yellow-500";
        case "poor":
            return "text-red-500";
    }
}

function getStatusBgColor(status: "good" | "needs-improvement" | "poor"): string {
    switch (status) {
        case "good":
            return "bg-green-500/20";
        case "needs-improvement":
            return "bg-yellow-500/20";
        case "poor":
            return "bg-red-500/20";
    }
}

function formatValue(value: number, unit: string): string {
    if (unit === "ms") {
        return `${Math.round(value)}ms`;
    }
    return value.toFixed(3);
}

interface VitalCardProps {
    readonly vitalKey: keyof VitalsData;
    readonly value: number | null;
    readonly baselineValue?: number | null;
}

function VitalCard({ vitalKey, value, baselineValue }: VitalCardProps) {
    const info = VITALS_INFO[vitalKey];
    const status = value === null ? null : getVitalStatus(value, info);

    let isImprovement = null;
    let delta = null;
    if (value !== null && baselineValue !== null && baselineValue !== undefined) {
        delta = ((value - baselineValue) / baselineValue) * 100;
        isImprovement = delta < 0;
    }

    return (
        <div className={`p-4 rounded-lg border transition-all ${status ? getStatusBgColor(status) : "bg-secondary/50 border-white/5"}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={status ? getStatusColor(status) : "text-muted-foreground"}>
                        {info.icon}
                    </span>
                    <span className="font-semibold text-sm">{info.name}</span>
                </div>
                {delta !== null && Math.abs(delta) > 0.1 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isImprovement ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
                    </span>
                )}
            </div>
            <div className={`text-2xl font-bold ${status ? getStatusColor(status) : "text-muted-foreground"}`}>
                {value === null ? "—" : formatValue(value, info.unit)}
            </div>
            {baselineValue !== undefined && baselineValue !== null && (
                <div className="text-[10px] text-muted-foreground mt-1">
                    Baseline: {formatValue(baselineValue, info.unit)}
                </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">{info.fullName}</div>
        </div>
    );
}

export function PerformanceDashboard() {
    const currentPath = usePathname();
    const [vitals, setVitals] = useState<VitalsData>({
        CLS: null,
        FCP: null,
        INP: null,
        LCP: null,
        TTFB: null,
    });
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedPage, setSelectedPage] = useState<string>(currentPath);
    const [history, setHistory] = useState<Record<string, PagePerformanceHistory>>({});
    const [showHistory, setShowHistory] = useState(false);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [progress, setProgress] = useState(0);

    const loadHistory = useCallback(() => {
        setHistory(getPerformanceHistory());
    }, []);

    useEffect(() => {
        loadHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMetric = useCallback((metric: Metric) => {
        setVitals((prev) => ({
            ...prev,
            [metric.name]: metric.value,
        }));
        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        // Register web vitals observers
        onCLS(handleMetric);
        onFCP(handleMetric);
        onINP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);
    }, [handleMetric]);

    const measuredCount = Object.values(vitals).filter((v) => v !== null).length;

    const overallScore = useMemo(() => {
        if (measuredCount === 0) return null;
        const total = Object.entries(vitals).filter(([, v]) => v !== null).reduce((acc, [key, value]) => {
            const info = VITALS_INFO[key as keyof VitalsData];
            const status = getVitalStatus(value!, info);
            return acc + (status === "good" ? 100 : status === "needs-improvement" ? 50 : 0);
        }, 0);
        return Math.round(total / measuredCount);
    }, [vitals, measuredCount]);

    // Listen for metrics from iframes
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== globalThis.window?.location.origin) return;
            if (event.data?.type === 'PERFORMANCE_METRIC') {
                const { metric, pathname } = event.data;
                // Update vitals for the currently selected page
                if (pathname === selectedPage) {
                    setVitals((prev) => ({
                        ...prev,
                        [metric.name]: metric.value,
                    }));
                    setLastUpdated(new Date());
                }
                // Save history for the page that reported the metric
                // We need to calculate the overall score for this specific metric and pathname
                const info = VITALS_INFO[metric.name as keyof VitalsData];
                const status = getVitalStatus(metric.value, info);
                const score = (status === "good" ? 100 : status === "needs-improvement" ? 50 : 0);
                savePerformanceSnapshot(pathname, { [metric.name]: metric.value }, score);
                loadHistory(); // Reload history to reflect the new snapshot
            }
        };
        globalThis.window?.addEventListener('message', handleMessage);
        return () => globalThis.window?.removeEventListener('message', handleMessage);
    }, [selectedPage, loadHistory]); // Added loadHistory to dependencies

    // Save history periodically
    useEffect(() => {
        if (overallScore !== null) {
            const timer = setTimeout(() => {
                savePerformanceSnapshot(selectedPage, vitals, overallScore);
                loadHistory();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [vitals, overallScore, selectedPage, loadHistory]);

    // Calculate score color based on overall score
    const getScoreColor = (score: number): string => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    // Export to JSON
    const exportToJSON = useCallback(() => {
        const data = {
            timestamp: lastUpdated?.toISOString() || new Date().toISOString(),
            overallScore,
            metrics: Object.entries(vitals).reduce((acc, [key, value]) => {
                const info = VITALS_INFO[key as keyof VitalsData];
                return {
                    ...acc,
                    [key]: {
                        value,
                        unit: info.unit,
                        status: value !== null ? getVitalStatus(value, info) : null,
                        threshold: { good: info.good, needsImprovement: info.needsImprovement }
                    }
                };
            }, {})
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `web-vitals-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [vitals, lastUpdated, overallScore]);



    const runPageTest = async (path: string) => {
        setIsMeasuring(true);
        setProgress(0);
        setSelectedPage(path);

        if (path !== currentPath) {
            setVitals({ CLS: null, FCP: null, INP: null, LCP: null, TTFB: null });
        }

        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 95));
        }, 500);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = path;
        document.body.appendChild(iframe);

        await new Promise(resolve => setTimeout(resolve, 5000));

        iframe.remove();
        clearInterval(interval);
        setProgress(100);
        setIsMeasuring(false);
        loadHistory();

        setTimeout(() => setProgress(0), 1000);
    };

    const pageHistory = history[selectedPage];
    const avgScore = (pageHistory?.overallScoreHistory && pageHistory.overallScoreHistory.length > 0)
        ? Math.round(pageHistory.overallScoreHistory.reduce((a, b) => a + b.value, 0) / pageHistory.overallScoreHistory.length)
        : null;

    const baselineTimestamp = pageHistory?.baselineTimestamp;
    const baselineSnapshot = useMemo(() => {
        if (!baselineTimestamp || !pageHistory) return null;

        const metrics: Record<string, number | null> = {};
        Object.entries(pageHistory.metrics).forEach(([key, values]) => {
            const match = values.find(v => v.timestamp === baselineTimestamp);
            metrics[key] = match ? match.value : null;
        });

        const scoreMatch = pageHistory.overallScoreHistory.find(v => v.timestamp === baselineTimestamp);

        return {
            vitals: metrics as VitalsData,
            score: scoreMatch ? scoreMatch.value : null
        };
    }, [pageHistory, baselineTimestamp]);

    const isRegression = overallScore !== null && avgScore !== null && overallScore < avgScore - 5;

    return (
        <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden">
            {isMeasuring && (
                <div className="h-1 w-full bg-secondary overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-6 h-6 text-primary" />
                                Performance Dashboard
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Measuring: <span className="text-primary font-mono">{selectedPage}</span>
                            </p>
                        </div>
                        <select
                            value={selectedPage}
                            onChange={(e) => runPageTest(e.target.value)}
                            disabled={isMeasuring}
                            className="bg-secondary/50 border border-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                        >
                            <option value="/">Home</option>
                            <option value="/blog">Blog</option>
                            <option value="/portfolio">Portfolio</option>
                            <option value="/admin">Admin</option>
                        </select>
                        <button
                            onClick={() => runPageTest(selectedPage)}
                            disabled={isMeasuring}
                            className="p-1.5 hover:bg-white/5 rounded-md transition-colors"
                            title="Re-run test"
                        >
                            <RefreshCw className={`w-4 h-4 ${isMeasuring ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${showHistory ? 'bg-primary text-white' : 'bg-secondary/50 hover:bg-secondary'}`}
                            >
                                <History className="w-3.5 h-3.5" />
                                History
                            </button>
                            <button
                                onClick={exportToJSON}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                JSON
                            </button>
                        </div>
                        <div className="text-right">
                            {overallScore !== null && (
                                <div className="flex flex-col items-end">
                                    <div className={`text-3xl font-bold ${getScoreColor(overallScore)} flex items-center gap-2`}>
                                        {overallScore}%
                                        {isRegression && (
                                            <span title="Performance regression detected!">
                                                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                            </span>
                                        )}
                                    </div>
                                    {avgScore !== null && (
                                        <div className="text-[10px] text-muted-foreground">
                                            Avg: {avgScore}%
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {showHistory ? (
                        <div key="history" className="space-y-4 py-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    Metric History for {selectedPage}
                                </h3>
                                <button
                                    onClick={() => { clearPerformanceHistory(); loadHistory(); }}
                                    className="text-[10px] text-red-400 hover:underline"
                                >
                                    Clear All History
                                </button>
                            </div>
                            {pageHistory ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Score Trend</p>
                                        <div className="h-32 w-full flex items-end gap-1 bg-black/20 rounded-lg p-2 overflow-hidden border border-white/5">
                                            {pageHistory.overallScoreHistory.map((s) => (
                                                <div
                                                    key={s.timestamp}
                                                    className={`w-full ${getScoreColor(s.value).replace('text-', 'bg-')}`}
                                                    style={{ height: `${s.value}%` }}
                                                    title={`${new Date(s.timestamp).toLocaleTimeString()}: ${s.value}%`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                                        {pageHistory.overallScoreHistory.slice().reverse().map((s) => (
                                            <div key={s.timestamp} className="flex items-center justify-between text-[10px] p-2 bg-white/5 rounded border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">{new Date(s.timestamp).toLocaleString()}</span>
                                                    {s.timestamp === baselineTimestamp && (
                                                        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter text-[8px]">Baseline</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${getScoreColor(s.value)} w-8 text-right`}>{s.value}%</span>
                                                    {s.timestamp === baselineTimestamp ? (
                                                        <button
                                                            onClick={() => { clearBaseline(selectedPage); loadHistory(); }}
                                                            className="p-1 hover:bg-white/10 rounded text-red-400"
                                                            title="Clear baseline"
                                                        >
                                                            <Zap className="w-3 h-3 fill-current" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setBaseline(selectedPage, s.timestamp); loadHistory(); }}
                                                            className="px-1.5 py-0.5 hover:bg-white/10 rounded text-[8px] border border-white/10 text-muted-foreground hover:text-white"
                                                        >
                                                            SET BASELINE
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-xl">
                                    No history recorded for this page yet.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {(Object.keys(VITALS_INFO) as Array<keyof VitalsData>).map((key) => (
                                <VitalCard
                                    key={key}
                                    vitalKey={key}
                                    value={vitals[key]}
                                    baselineValue={baselineSnapshot?.vitals[key]}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {lastUpdated && (
                    <div className="text-xs text-muted-foreground mt-4 text-center">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                )}

                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2">💡 How to improve</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li><strong>LCP:</strong> Optimize images, preload critical assets, use CDN</li>
                        <li><strong>FCP:</strong> Reduce render-blocking resources, inline critical CSS</li>
                        <li><strong>CLS:</strong> Set explicit dimensions for images/embeds</li>
                        <li><strong>INP:</strong> Optimize event handlers, reduce JavaScript execution</li>
                        <li><strong>TTFB:</strong> Use caching, optimize server response, use edge functions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
