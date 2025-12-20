"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SuggestionResponse } from "@/lib/ai-service";

interface Item {
    slug: string;
    title?: string; // for projects
    company?: string; // for experience
    role?: string; // for experience
    description: string;
}

interface AssistantClientProps {
    initialExperience: Item[];
    initialProjects: Item[];
}

export function AssistantClient({ initialExperience, initialProjects }: AssistantClientProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedType, setSelectedType] = useState<'experience' | 'project' | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async (item: Item, type: 'experience' | 'project') => {
        setSelectedItem(item);
        setSelectedType(type);
        setIsLoading(true);
        setSuggestions([]);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Experience</h2>
                    <div className="space-y-4">
                        {initialExperience.map((item) => (
                            <Card key={item.slug} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleAnalyze(item, 'experience')}>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">{item.role} at {item.company}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    <Button size="sm" variant="outline" className="mt-2 w-full">Analyze</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Projects</h2>
                    <div className="space-y-4">
                        {initialProjects.map((item) => (
                            <Card key={item.slug} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleAnalyze(item, 'project')}>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    <Button size="sm" variant="outline" className="mt-2 w-full">Analyze</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>

            <div className="sticky top-10 h-fit">
                {selectedItem ? (
                    <Card className="h-full border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle>Analysis Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Item</h3>
                                <p className="font-medium">{selectedItem.title || `${selectedItem.role} at ${selectedItem.company}`}</p>
                                <p className="text-sm text-gray-600 mt-1 p-3 bg-muted rounded-md">{selectedItem.description}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">AI Suggestions</h3>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {suggestions.map((suggestion, i) => (
                                            <li key={i} className="flex gap-2 text-sm">
                                                <span className="text-primary mt-1">✨</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex h-64 items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                        Select an item to verify
                    </div>
                )}
            </div>
        </div>
    );
}
