"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { locales, SupportedLanguage, defaultLanguage } from "@/locales";

type Translation = typeof locales[SupportedLanguage];

interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: Translation;
    toggleLanguage: () => void;
    availableLanguages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);

    const t = locales[language];
    const availableLanguages = Object.keys(locales) as SupportedLanguage[];

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const currentIndex = availableLanguages.indexOf(prev);
            const nextIndex = (currentIndex + 1) % availableLanguages.length;
            return availableLanguages[nextIndex];
        });
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage, availableLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
