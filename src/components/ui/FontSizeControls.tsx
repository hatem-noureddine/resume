"use client";

import { useTheme } from "@/context/ThemeContext";
import { Minus, Plus, Type } from "lucide-react";

export function FontSizeControls() {
    const { fontSize, setFontSize } = useTheme();

    const sizes = ["small", "medium", "large"] as const;
    const currentIndex = sizes.indexOf(fontSize);

    const decrease = () => {
        if (currentIndex > 0) {
            setFontSize(sizes[currentIndex - 1]);
        }
    };

    const increase = () => {
        if (currentIndex < sizes.length - 1) {
            setFontSize(sizes[currentIndex + 1]);
        }
    };

    return (
        <fieldset
            className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1 border-none"
            aria-label="Font size controls"
        >
            <legend className="sr-only">Font size controls</legend>
            <button
                onClick={decrease}
                disabled={currentIndex === 0}
                className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease font size"
                title="Smaller text"
            >
                <Minus className="w-3 h-3" />
            </button>

            <span
                className="px-1.5 text-xs font-medium flex items-center gap-1 min-w-12 justify-center"
                aria-live="polite"
            >
                <Type className="w-3 h-3" />
                <span className="capitalize">{fontSize}</span>
            </span>

            <button
                onClick={increase}
                disabled={currentIndex === sizes.length - 1}
                className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase font size"
                title="Larger text"
            >
                <Plus className="w-3 h-3" />
            </button>
        </fieldset>
    );
}
