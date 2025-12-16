"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage);

    const setLanguage = (lang: SupportedLanguage) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };


    useEffect(() => {
        const storedLang = localStorage.getItem("language") as SupportedLanguage;
        if (storedLang && Object.keys(locales).includes(storedLang)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguageState(storedLang);
        } else {
            const browserLang = navigator.language.split("-")[0] as SupportedLanguage;
            if (Object.keys(locales).includes(browserLang)) {
                 
                setLanguageState(browserLang);
            }
        }
    }, []);

    const t = locales[language];
    const availableLanguages = Object.keys(locales) as SupportedLanguage[];

    const toggleLanguage = () => {
        setLanguageState((prev) => {
            const currentIndex = availableLanguages.indexOf(prev);
            const nextIndex = (currentIndex + 1) % availableLanguages.length;
            const newLang = availableLanguages[nextIndex];
            localStorage.setItem("language", newLang);
            return newLang;
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
