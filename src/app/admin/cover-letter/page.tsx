"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui";
import { Sparkles, Copy, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { haptic as hapticFeedback } from "@/lib/haptic";

export default function CoverLetterPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [generatedLetter, setGeneratedLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please provide a Job Description");
            return;
        }

        setIsGenerating(true);
        hapticFeedback.medium(); // Haptic start

        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobDescription,
                    customInstructions: instructions,
                }),
            });

            if (!res.ok) throw new Error("Generation failed");

            const data = await res.json();
            setGeneratedLetter(data.coverLetter);
            toast.success("Cover Letter Generated!");
            hapticFeedback.heavy(); // Haptic success
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Check API Key?");
            hapticFeedback.error();
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast.success("Copied to clipboard");
        hapticFeedback.subtle();
    };

    return (
        <AdminLayout title="Cover Letter Generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-10rem)]">
                {/* Input Column */}
                <div className="flex flex-col gap-6">
                    <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 flex-1 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center gap-2 text-lg font-medium">
                            <FileText className="w-5 h-5 text-primary" />
                            Job Details
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Paste Job Description
                            </label>
                            <textarea
                                className="flex-1 w-full bg-background/50 border rounded-lg p-4 resize-none focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-mono"
                                placeholder="# Software Engineer at Google..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Custom Instructions (Optional)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-background/50 border rounded-lg p-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                                placeholder="e.g. 'Emphasize my Next.js experience'"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription}
                            className="w-full h-12 text-base"
                        >
                            {isGenerating ? (
                                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <Sparkles className="w-5 h-5 mr-2" />
                            )}
                            {isGenerating ? "Writing..." : "Generate Cover Letter"}
                        </Button>
                    </div>
                </div>

                {/* Output Column */}
                <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border rounded-xl shadow-sm overflow-hidden relative group">
                    <div className="p-4 border-b flex justify-between items-center bg-muted/20">
                        <span className="font-medium text-sm flex items-center gap-2">
                            Generated Output
                        </span>
                        {generatedLetter && (
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {isGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                                <RefreshCw className="w-8 h-8 animate-spin text-primary/50" />
                                <p className="animate-pulse">Analyzing resume & job description...</p>
                            </div>
                        ) : generatedLetter ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans"
                            >
                                {generatedLetter}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-2 border-2 border-dashed border-muted m-4 rounded-lg">
                                <Sparkles className="w-10 h-10 mb-2 opacity-50" />
                                <p>Ready to generate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
