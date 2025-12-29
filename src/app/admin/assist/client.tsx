"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SuggestionResponse } from "@/lib/ai-service";
import {
    Copy,
    Check,
    Sparkles,
    RefreshCw,
    History,
    Trash2,
    Zap,
    MessageSquare,
    ArrowRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
    slug: string;
    title?: string; // for projects
    company?: string; // for experience
    role?: string; // for experience
    description: string;
}

interface AnalysisResult {
    id: string;
    itemSlug: string;
    itemTitle: string;
    type: 'experience' | 'project';
    suggestions: string[];
    timestamp: number;
    customInstructions?: string;
}

interface AssistantClientProps {
    readonly initialExperience: Item[];
    readonly initialProjects: Item[];
}

export function AssistantClient({ initialExperience, initialProjects }: AssistantClientProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedType, setSelectedType] = useState<'experience' | 'project' | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customInstructions, setCustomInstructions] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    // History State
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Bulk analysis state
    const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("ai_assistant_history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to load history:", e);
            }
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem("ai_assistant_history", JSON.stringify(history));
    }, [history]);

    const addToHistory = useCallback((item: Item, type: 'experience' | 'project', suggestions: string[], instructions?: string) => {
        const result: AnalysisResult = {
            id: Math.random().toString(36).substring(7),
            itemSlug: item.slug,
            itemTitle: item.title || `${item.role} at ${item.company}`,
            type,
            suggestions,
            timestamp: Date.now(),
            customInstructions: instructions
        };
        setHistory(prev => [result, ...prev].slice(0, 20)); // Keep last 20
    }, []);

    const handleAnalyze = useCallback(async (item: Item, type: 'experience' | 'project', instructions?: string) => {
        setSelectedItem(item);
        setSelectedType(type);
        setIsLoading(true);
        setSuggestions([]);
        setCopiedIndex(null);
        setCopiedAll(false);

        try {
            const response = await fetch('/api/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: item.description,
                    type,
                    customInstructions: instructions || customInstructions
                }),
            });
            const data: SuggestionResponse = await response.json();

            if (data.suggestions) {
                setSuggestions(data.suggestions);
                addToHistory(item, type, data.suggestions, instructions || customInstructions);
            } else {
                setSuggestions(["No suggestions found. Check your API key."]);
            }
        } catch (error) {
            console.error(error);
            setSuggestions(["Error fetching suggestions. Please try again."]);
        } finally {
            setIsLoading(false);
        }
    }, [addToHistory, customInstructions]);

    const handleBulkAnalyze = async () => {
        const allItems = [
            ...initialExperience.map(i => ({ item: i, type: 'experience' as const })),
            ...initialProjects.map(i => ({ item: i, type: 'project' as const }))
        ];

        setIsBulkAnalyzing(true);
        setBulkProgress({ current: 0, total: allItems.length });

        for (let i = 0; i < allItems.length; i++) {
            const { item, type } = allItems[i];
            setBulkProgress(prev => ({ ...prev, current: i + 1 }));
            try {
                const response = await fetch('/api/assist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: item.description, type }),
                });
                const data: SuggestionResponse = await response.json();
                if (data.suggestions) {
                    addToHistory(item, type, data.suggestions);
                }
            } catch (err) {
                console.error(`Failed bulk analyze for ${item.slug}`, err);
            }
        }

        setIsBulkAnalyzing(false);
        setShowHistory(true);
    };

    const handleReanalyze = useCallback(() => {
        if (selectedItem && selectedType) {
            handleAnalyze(selectedItem, selectedType);
        }
    }, [selectedItem, selectedType, handleAnalyze]);

    const copyToClipboard = useCallback(async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, []);

    const copyAllSuggestions = useCallback(async () => {
        try {
            const allText = suggestions.join("\n\n");
            await navigator.clipboard.writeText(allText);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [suggestions]);

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("ai_assistant_history");
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Sparkles className="w-7 h-7 text-primary" />
                        AI Content Assistant
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Groq Powered</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Select an item to receive context-aware, LLM-powered suggestions.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className={showHistory ? "bg-primary/20 border-primary/50" : ""}
                    >
                        <History className="w-4 h-4 mr-2" />
                        History
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleBulkAnalyze}
                        disabled={isBulkAnalyzing}
                    >
                        {isBulkAnalyzing ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing {bulkProgress.current}/{bulkProgress.total}</>
                        ) : (
                            <><Zap className="w-4 h-4 mr-2" /> Bulk Analysis</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COL: Content Selection */}
                <div className={`space-y-8 ${showHistory ? 'hidden lg:block' : 'lg:col-span-1'}`}>
                    <section>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-3 bg-primary rounded-full" />
                            Experience ({initialExperience.length})
                        </h2>
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {initialExperience.map((item) => (
                                <Card
                                    key={item.slug}
                                    className={`cursor-pointer transition-all duration-200 border border-white/5 ${selectedItem?.slug === item.slug
                                        ? 'bg-primary/10 border-primary ring-1 ring-primary/20'
                                        : 'bg-secondary/20 hover:border-primary/50'
                                        }`}
                                    onClick={() => handleAnalyze(item, 'experience')}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="text-sm font-semibold">{item.role}</CardTitle>
                                        <p className="text-[10px] text-primary/70 mb-2 uppercase tracking-tight">{item.company}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-3 bg-blue-500 rounded-full" />
                            Projects ({initialProjects.length})
                        </h2>
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {initialProjects.map((item) => (
                                <Card
                                    key={item.slug}
                                    className={`cursor-pointer transition-all duration-200 border border-white/5 ${selectedItem?.slug === item.slug
                                        ? 'bg-primary/10 border-primary ring-1 ring-primary/20'
                                        : 'bg-secondary/20 hover:border-primary/50'
                                        }`}
                                    onClick={() => handleAnalyze(item, 'project')}
                                >
                                    <CardContent className="p-4">
                                        <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-2">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* MIDDLE/RIGHT COL: Analysis & Results */}
                <div className={`space-y-6 ${showHistory ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
                    {/* CUSTOM PROMPT CARD */}
                    <Card className="bg-secondary/20 border-white/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <MessageSquare className="w-12 h-12" />
                        </div>
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Custom Instructions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customInstructions}
                                    onChange={(e) => setCustomInstructions(e.target.value)}
                                    placeholder="e.g. 'Make it more technical', 'Focus on leadership', 'Shorten it'..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                />
                                {selectedItem && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleAnalyze(selectedItem, selectedType!, customInstructions)}
                                        disabled={isLoading}
                                    >
                                        Apply
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <AnimatePresence mode="wait">
                        {showHistory ? (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Analyses</h3>
                                    <button onClick={clearHistory} className="text-[10px] text-red-400 hover:underline flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Clear History
                                    </button>
                                </div>

                                {history.length > 0 ? (
                                    <div className="space-y-4">
                                        {history.map((result) => (
                                            <Card key={result.id} className="bg-secondary/10 border-white/5 hover:border-white/20 transition-all overflow-hidden">
                                                <div className={`h-1 w-full ${result.type === 'experience' ? 'bg-primary' : 'bg-blue-500'}`} />
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-sm">{result.itemTitle}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {new Date(result.timestamp).toLocaleTimeString()} · {new Date(result.timestamp).toLocaleDateString()}
                                                                </span>
                                                                {result.customInstructions && (
                                                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded italic">
                                                                        &quot;{result.customInstructions}&quot;
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 hover:bg-white/5"
                                                            onClick={async () => {
                                                                await navigator.clipboard.writeText(result.suggestions.join("\n"));
                                                            }}
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {result.suggestions.slice(0, 3).map((s, i) => (
                                                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                                                                <span className="text-primary text-[10px] mt-0.5">●</span>
                                                                <span className="line-clamp-1">{s}</span>
                                                            </li>
                                                        ))}
                                                        {result.suggestions.length > 3 && (
                                                            <li className="text-[10px] text-muted-foreground/50 ml-4">
                                                                + {result.suggestions.length - 3} more suggestions
                                                            </li>
                                                        )}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-secondary/10 border border-dashed border-white/10 rounded-xl">
                                        <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm text-muted-foreground">No recent analyses found.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : selectedItem ? (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <Card className="border-2 border-primary/20 bg-secondary/10 backdrop-blur-md">
                                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                            Analysis Results
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleReanalyze}
                                                disabled={isLoading}
                                                className="h-8"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                                                Reanalyze
                                            </Button>
                                            {suggestions.length > 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={copyAllSuggestions}
                                                    className="h-8"
                                                >
                                                    {copiedAll ? (
                                                        <><Check className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All</>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6">
                                        <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                                            <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Original Content</span>
                                                <span className="text-[10px] text-primary/50">{selectedItem.title || selectedItem.role}</span>
                                            </div>
                                            <p className="p-4 text-sm text-muted-foreground font-light leading-relaxed">
                                                {selectedItem.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                                                <ArrowRight className="w-3.5 h-3.5" />
                                                Optimization Suggestions
                                            </h3>
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">Llama 3.1 is thinking...</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Generating high-impact context-aware suggestions</p>
                                                    </div>
                                                </div>
                                            ) : suggestions.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {suggestions.map((suggestion, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="group flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all text-sm relative"
                                                        >
                                                            <div className="flex-1 leading-relaxed">
                                                                {suggestion}
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    copyToClipboard(suggestion, i);
                                                                }}
                                                                className="shrink-0 transition-all p-2 hover:bg-primary/20 rounded-lg h-9 w-9 flex items-center justify-center"
                                                                title="Copy suggestion"
                                                            >
                                                                {copiedIndex === i ? (
                                                                    <Check className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                )}
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                                    <p className="text-sm text-muted-foreground italic">No suggestions available. Click analyze to start.</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <div className="px-6 py-3 bg-primary/5 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-muted-foreground">AI guidance is provided for inspiration. Use your best judgement.</span>
                                        <span className="text-[10px] text-primary/40 font-mono">LLM-70B-V1</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col h-[500px] items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-secondary/5 text-muted-foreground gap-5"
                            >
                                <div className="p-6 bg-secondary/20 rounded-full animate-pulse">
                                    <Sparkles className="w-12 h-12 text-primary/30" />
                                </div>
                                <div className="text-center max-w-xs px-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-1">Let&apos;s improve your resume</h3>
                                    <p className="text-sm">Select an experience or project from the left to start receiving AI-powered suggestions.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                                        <Check className="w-3 h-3 text-green-500" /> High Impact
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                                        <Check className="w-3 h-3 text-green-500" /> Context Aware
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
