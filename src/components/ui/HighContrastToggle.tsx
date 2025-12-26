"use client";

import { useTheme } from "@/context/ThemeContext";
import { Contrast } from "lucide-react";

export function HighContrastToggle() {
    const { highContrast, setHighContrast } = useTheme();

    return (
        <button
            onClick={() => setHighContrast(!highContrast)}
            className={`
                relative p-2 rounded-lg transition-all duration-200
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary
                ${highContrast ? 'bg-primary text-white' : 'text-foreground'}
            `}
            aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
            aria-pressed={highContrast}
            title={highContrast ? "Disable high contrast" : "Enable high contrast"}
        >
            <Contrast className="w-5 h-5" />
            {highContrast && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
            )}
        </button>
    );
}
