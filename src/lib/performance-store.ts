export interface MetricSnapshot {
    value: number;
    timestamp: number;
}

export interface PagePerformanceHistory {
    page: string;
    baselineTimestamp?: number;
    metrics: {
        CLS: MetricSnapshot[];
        FCP: MetricSnapshot[];
        INP: MetricSnapshot[];
        LCP: MetricSnapshot[];
        TTFB: MetricSnapshot[];
    };
    overallScoreHistory: MetricSnapshot[];
}

const STORAGE_KEY = 'vitals_history';

export function savePerformanceSnapshot(
    page: string,
    vitals: Record<string, number | null>,
    overallScore: number | null
) {
    if (globalThis.window === undefined) return;

    const rawHistory = globalThis.window.localStorage.getItem(STORAGE_KEY);
    const history: Record<string, PagePerformanceHistory> = rawHistory ? JSON.parse(rawHistory) : {};

    if (!history[page]) {
        history[page] = {
            page,
            metrics: {
                CLS: [],
                FCP: [],
                INP: [],
                LCP: [],
                TTFB: [],
            },
            overallScoreHistory: [],
        };
    }

    const timestamp = Date.now();

    // Update individual metrics
    Object.entries(vitals).forEach(([key, value]) => {
        if (value !== null && key in history[page].metrics) {
            const metricKey = key as keyof PagePerformanceHistory['metrics'];
            history[page].metrics[metricKey].push({ value, timestamp });
            // Keep last 50 entries
            if (history[page].metrics[metricKey].length > 50) {
                history[page].metrics[metricKey].shift();
            }
        }
    });

    // Update overall score history
    if (overallScore !== null) {
        history[page].overallScoreHistory.push({ value: overallScore, timestamp });
        if (history[page].overallScoreHistory.length > 50) {
            history[page].overallScoreHistory.shift();
        }
    }

    globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getPerformanceHistory(): Record<string, PagePerformanceHistory> {
    if (globalThis.window === undefined) return {};
    const rawHistory = globalThis.window.localStorage.getItem(STORAGE_KEY);
    return rawHistory ? JSON.parse(rawHistory) : {};
}

export function clearPerformanceHistory() {
    if (globalThis.window === undefined) return;
    globalThis.window.localStorage.removeItem(STORAGE_KEY);
}

export function getHistoryForPage(page: string): PagePerformanceHistory | null {
    const history = getPerformanceHistory();
    return history[page] || null;
}

export function setBaseline(page: string, timestamp: number) {
    if (globalThis.window === undefined) return;
    const history = getPerformanceHistory();
    if (history[page]) {
        history[page].baselineTimestamp = timestamp;
        globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
}

export function clearBaseline(page: string) {
    if (globalThis.window === undefined) return;
    const history = getPerformanceHistory();
    if (history[page]) {
        delete history[page].baselineTimestamp;
        globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
}
