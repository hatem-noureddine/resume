"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { locales, SupportedLanguage, defaultLanguage } from "@/locales";

type Translation = typeof locales[SupportedLanguage];

interface CMSLanguage {
    slug: string;
    entry: {
        name: string;
        flag: string;
        isEnabled: boolean;
    };
}

interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: Translation;
    toggleLanguage: () => void;
    availableLanguages: SupportedLanguage[];
    cmsLanguages: CMSLanguage[];
    direction: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    cmsLanguages = []
}: Readonly<{
    children: ReactNode;
    cmsLanguages?: CMSLanguage[];
}>) {
    const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage);

    // Only languages that are enabled in CMS AND have a local translation file
    const activeCMSLanguages = useMemo(() =>
        cmsLanguages
            .filter(l => l.entry.isEnabled)
            .map(l => l.slug as SupportedLanguage)
            .filter(lang => Object.keys(locales).includes(lang)),
        [cmsLanguages]);

    const availableLanguages = useMemo(() =>
        activeCMSLanguages.length > 0
            ? activeCMSLanguages
            : Object.keys(locales) as SupportedLanguage[],
        [activeCMSLanguages]);

    const setLanguage = useCallback((lang: SupportedLanguage) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    }, []);

    /* eslint-disable react-hooks/set-state-in-effect */
    // This effect intentionally sets state to initialize language from URL/localStorage/browser
    useEffect(() => {
        // 1. Check URL parameters
        const params = new URLSearchParams(globalThis.location.search);
        const langParam = params.get('lang') as SupportedLanguage;

        if (langParam && availableLanguages.includes(langParam)) {
            setLanguageState(langParam);
            localStorage.setItem("language", langParam);
            return;
        }

        // 2. Check localStorage
        const storedLang = localStorage.getItem("language") as SupportedLanguage;
        if (storedLang && availableLanguages.includes(storedLang)) {
            setLanguageState(storedLang);
        } else {
            // 3. Browser language
            const browserLang = navigator.language.split("-")[0] as SupportedLanguage;
            if (availableLanguages.includes(browserLang)) {
                setLanguageState(browserLang);
            }
        }
    }, [availableLanguages]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const t = locales[language] || locales[defaultLanguage];

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const currentIndex = availableLanguages.indexOf(prev);
            const nextIndex = (currentIndex + 1) % availableLanguages.length;
            const newLang = availableLanguages[nextIndex];
            localStorage.setItem("language", newLang);
            return newLang;
        });
    }, [availableLanguages]);

    const direction = useMemo<"ltr" | "rtl">(() => (language === "ar" ? "rtl" : "ltr"), [language]);

    useEffect(() => {
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
    }, [direction, language]);

    const contextValue = useMemo(() => ({
        language,
        setLanguage,
        t,
        toggleLanguage,
        availableLanguages,
        cmsLanguages,
        direction
    }), [language, setLanguage, t, toggleLanguage, availableLanguages, cmsLanguages, direction]);

    return (
        <LanguageContext.Provider value={contextValue}>
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
