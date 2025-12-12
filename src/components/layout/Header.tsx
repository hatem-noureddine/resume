"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";

export function Header() {
    const { t, language, setLanguage, availableLanguages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
                setIsLanguageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname();
    const navLinks = t.header.nav.filter(link => {
        // Hide "Blog" link if we are on any blog page
        if (pathname?.startsWith("/blog") && link.href.includes("blog")) {
            return false;
        }
        return true;
    });

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-background/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold font-outfit text-foreground">
                    {t.header.logo}
                    <span className="text-primary">.</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Language Dropdown */}
                    {availableLanguages.length > 1 && (
                        <div className="relative" ref={languageMenuRef}>
                            <button
                                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                className="flex items-center gap-2 text-sm font-medium text-secondary-foreground hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-white/5 active:bg-white/10"
                            >
                                <span className="text-lg leading-none">{localeMetadata[language].flag}</span>
                                <span className="uppercase">{language}</span>
                                <ChevronDown
                                    className={cn(
                                        "w-3 h-3 transition-transform duration-200",
                                        isLanguageMenuOpen ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {isLanguageMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-2 min-w-[160px] bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden py-2"
                                    >
                                        <div className="flex flex-col">
                                            {availableLanguages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => {
                                                        setLanguage(lang);
                                                        setIsLanguageMenuOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-white/5",
                                                        language === lang
                                                            ? "text-primary font-bold bg-primary/5"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className="text-lg leading-none">{localeMetadata[lang].flag}</span>
                                                        <span className="uppercase">{localeMetadata[lang].name}</span>
                                                    </span>
                                                    {language === lang && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <Button variant="default" size="sm" asChild>
                        <Link href="#contact">{t.header.hireMe}</Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    {availableLanguages.length > 1 && (
                        <button
                            onClick={() => {
                                const currentIndex = availableLanguages.indexOf(language);
                                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                                setLanguage(availableLanguages[nextIndex]);
                            }}
                            className="text-foreground p-2 flex items-center gap-2"
                        >
                            <span className="text-lg leading-none">{localeMetadata[language].flag}</span>
                            <span className="uppercase text-sm font-bold">{language}</span>
                        </button>
                    )}
                    <button
                        className="text-foreground p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col items-center gap-6 py-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-secondary-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Button onClick={() => setIsOpen(false)} asChild>
                                <Link href="#contact">{t.header.hireMe}</Link>
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
