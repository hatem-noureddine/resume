"use client";

import { useState, useEffect, useCallback } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { Activity, Gauge, Clock, Zap, Eye, Download } from "lucide-react";

interface VitalsData {
    CLS: number | null;
    FCP: number | null;
    INP: number | null;
    LCP: number | null;
    TTFB: number | null;
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
}

function VitalCard({ vitalKey, value }: VitalCardProps) {
    const info = VITALS_INFO[vitalKey];
    const status = value !== null ? getVitalStatus(value, info) : null;

    return (
        <div className={`p-4 rounded-lg ${status ? getStatusBgColor(status) : "bg-secondary/50"}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className={status ? getStatusColor(status) : "text-muted-foreground"}>
                    {info.icon}
                </span>
                <span className="font-semibold text-sm">{info.name}</span>
            </div>
            <div className={`text-2xl font-bold ${status ? getStatusColor(status) : "text-muted-foreground"}`}>
                {value !== null ? formatValue(value, info.unit) : "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{info.fullName}</div>
            <div className="text-xs text-muted-foreground mt-1">{info.description}</div>
            <div className="text-xs mt-2 flex gap-2">
                <span className="text-green-500">Good: ≤{info.good}{info.unit}</span>
                <span className="text-red-500">Poor: &gt;{info.needsImprovement}{info.unit}</span>
            </div>
        </div>
    );
}

/**
 * Performance Monitoring Dashboard - displays real-time Core Web Vitals
 * 
 * Usage:
 * ```tsx
 * <PerformanceDashboard />
 * ```
 */
export function PerformanceDashboard() {
    const [vitals, setVitals] = useState<VitalsData>({
        CLS: null,
        FCP: null,
        INP: null,
        LCP: null,
        TTFB: null,
    });
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
    const overallScore = measuredCount > 0
        ? Math.round(
            (Object.entries(vitals).filter(([, v]) => v !== null).reduce((acc, [key, value]) => {
                const info = VITALS_INFO[key as keyof VitalsData];
                const status = getVitalStatus(value!, info);
                return acc + (status === "good" ? 100 : status === "needs-improvement" ? 50 : 0);
            }, 0) / measuredCount)
        )
        : null;

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

    // Export to CSV
    const exportToCSV = useCallback(() => {
        const headers = ['Metric', 'Value', 'Unit', 'Status', 'Good Threshold', 'Needs Improvement Threshold'];
        const rows = Object.entries(vitals).map(([key, value]) => {
            const info = VITALS_INFO[key as keyof VitalsData];
            const status = value !== null ? getVitalStatus(value, info) : 'not measured';
            return [key, value ?? 'N/A', info.unit, status, info.good, info.needsImprovement];
        });
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `web-vitals-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [vitals]);

    return (
        <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="w-6 h-6 text-primary" />
                            Core Web Vitals
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Real-time performance monitoring
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Export Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={exportToJSON}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                                title="Export as JSON"
                            >
                                <Download className="w-3.5 h-3.5" />
                                JSON
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                                title="Export as CSV"
                            >
                                <Download className="w-3.5 h-3.5" />
                                CSV
                            </button>
                        </div>
                        {/* Score */}
                        <div className="text-right">
                            {overallScore !== null && (
                                <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                                    {overallScore}%
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {measuredCount}/5 metrics measured
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {(Object.keys(VITALS_INFO) as Array<keyof VitalsData>).map((key) => (
                        <VitalCard key={key} vitalKey={key} value={vitals[key]} />
                    ))}
                </div>

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

