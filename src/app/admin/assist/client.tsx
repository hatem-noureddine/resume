"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SuggestionResponse } from "@/lib/ai-service";
import { Copy, Check, Sparkles, RefreshCw } from "lucide-react";

interface Item {
    slug: string;
    title?: string; // for projects
    company?: string; // for experience
    role?: string; // for experience
    description: string;
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
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    const handleAnalyze = async (item: Item, type: 'experience' | 'project') => {
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
                body: JSON.stringify({ content: item.description, type }),
            });
            const data: SuggestionResponse = await response.json();
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error(error);
            setSuggestions(["Error fetching suggestions."]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReanalyze = useCallback(() => {
        if (selectedItem && selectedType) {
            handleAnalyze(selectedItem, selectedType);
        }
    }, [selectedItem, selectedType]);

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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="w-7 h-7 text-primary" />
                    AI Content Assistant
                </h1>
                <p className="text-muted-foreground mt-1">
                    Select an item to analyze and receive AI-powered suggestions for improvement.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Experience ({initialExperience.length})</h2>
                        <div className="space-y-3">
                            {initialExperience.map((item) => (
                                <Card
                                    key={item.slug}
                                    className={`cursor-pointer transition-all duration-200 ${selectedItem?.slug === item.slug
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'hover:border-primary/50'
                                        }`}
                                    onClick={() => handleAnalyze(item, 'experience')}
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base">{item.role} at {item.company}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-4">Projects ({initialProjects.length})</h2>
                        <div className="space-y-3">
                            {initialProjects.map((item) => (
                                <Card
                                    key={item.slug}
                                    className={`cursor-pointer transition-all duration-200 ${selectedItem?.slug === item.slug
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'hover:border-primary/50'
                                        }`}
                                    onClick={() => handleAnalyze(item, 'project')}
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:sticky lg:top-24 h-fit">
                    {selectedItem ? (
                        <Card className="border-2 border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Analysis Results
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleReanalyze}
                                        disabled={isLoading}
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                                        Reanalyze
                                    </Button>
                                    {suggestions.length > 0 && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={copyAllSuggestions}
                                        >
                                            {copiedAll ? (
                                                <><Check className="w-4 h-4 mr-1 text-green-500" /> Copied!</>
                                            ) : (
                                                <><Copy className="w-4 h-4 mr-1" /> Copy All</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Selected Item</h3>
                                    <p className="font-medium">{selectedItem.title || `${selectedItem.role} at ${selectedItem.company}`}</p>
                                    <p className="text-sm text-muted-foreground mt-2 p-3 bg-secondary/30 rounded-lg border border-white/10">{selectedItem.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">AI Suggestions</h3>
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <p className="text-sm text-muted-foreground">Analyzing content...</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-3">
                                            {suggestions.map((suggestion, i) => (
                                                <li
                                                    key={i}
                                                    className="group flex gap-3 text-sm p-3 bg-secondary/20 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                                                >
                                                    <span className="text-primary mt-0.5 shrink-0">✨</span>
                                                    <span className="flex-1">{suggestion}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(suggestion, i);
                                                        }}
                                                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-primary/20 rounded"
                                                        title="Copy suggestion"
                                                    >
                                                        {copiedIndex === i ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col h-64 items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-muted-foreground gap-3">
                            <Sparkles className="w-8 h-8 opacity-50" />
                            <p>Select an item to analyze</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
