"use client";

import { createContext, useContext, useEffect, useState, useMemo, use } from "react";

type Theme = "dark" | "light" | "system";
type FontSize = "small" | "medium" | "large";

type ThemeProviderProps = {
    readonly children: React.ReactNode;
    readonly defaultTheme?: Theme;
    readonly storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    highContrast: boolean;
    setHighContrast: (enabled: boolean) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    highContrast: false,
    setHighContrast: () => null,
    fontSize: "medium",
    setFontSize: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const HIGH_CONTRAST_KEY = "high-contrast-enabled";
const FONT_SIZE_KEY = "font-size-preference";

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [highContrast, setHighContrastState] = useState(false);
    const [fontSize, setFontSizeState] = useState<FontSize>("medium");

    // Load saved preferences on mount
    useEffect(() => {
        const storedTheme = localStorage.getItem(storageKey) as Theme;
        if (storedTheme) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(storedTheme);
        }
        const storedHighContrast = localStorage.getItem(HIGH_CONTRAST_KEY);
        if (storedHighContrast === "true") {

            setHighContrastState(true);
        }
        const storedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize;
        if (storedFontSize && ["small", "medium", "large"].includes(storedFontSize)) {

            setFontSizeState(storedFontSize);
        }
    }, [storageKey]);

    // Apply theme classes to document
    useEffect(() => {
        const root = globalThis.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        // Remove the initialization style tag once React has taken over
        const initStyle = globalThis.document.getElementById('theme-init');
        if (initStyle) {
            initStyle.remove();
        }
    }, [theme]);

    // Apply high contrast class to document
    useEffect(() => {
        const root = globalThis.document.documentElement;
        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }
    }, [highContrast]);

    // Apply font size class to document
    useEffect(() => {
        const root = globalThis.document.documentElement;
        root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
        root.classList.add(`font-size-${fontSize}`);
    }, [fontSize]);

    const value = useMemo(() => ({
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        highContrast,
        setHighContrast: (enabled: boolean) => {
            localStorage.setItem(HIGH_CONTRAST_KEY, String(enabled));
            setHighContrastState(enabled);
        },
        fontSize,
        setFontSize: (size: FontSize) => {
            localStorage.setItem(FONT_SIZE_KEY, size);
            setFontSizeState(size);
        },
    }), [theme, storageKey, highContrast, fontSize]);

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = use(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
