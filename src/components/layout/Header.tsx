"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Header({ hasBlogPosts = true }: { hasBlogPosts?: boolean }) {
    const { t, language, setLanguage, availableLanguages } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const languageMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

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

    // Body scroll lock which fixes the "malformed" background scroll issue
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [mobileMenuOpen]);

    const portfolioItems = t.portfolio.items || [];
    const showPortfolio = portfolioItems.length > 0;

    const navLinks = t.header.nav.filter(link => {
        if (link.href.includes('portfolio')) return showPortfolio;
        if (link.href.includes('blog')) return hasBlogPosts;
        return true;
    });

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Logo className="h-full w-full" />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Language Dropdown */}
                    {availableLanguages.length > 1 && (
                        <div className="relative" ref={languageMenuRef}>
                            <button
                                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                className="flex items-center gap-2 text-sm font-medium text-secondary-foreground hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-foreground/5 active:bg-foreground/10"
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
                                        className="absolute top-full right-0 mt-2 min-w-[160px] bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-xl overflow-hidden py-2"
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
                                                        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-foreground/5",
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

                    <ThemeToggle />

                    <Link
                        href="#contact"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <Sparkles size={14} />
                        {t.hero.availableForHire || "Available for Hire"}
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <button
                        className="text-foreground p-2"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-background md:hidden flex flex-col"
                        >
                            <div className="container mx-auto px-4 h-20 flex items-center justify-end">
                                <button
                                    className="p-2 text-foreground hover:text-primary transition-colors cursor-pointer relative z-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center gap-8 -mt-20">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-3xl font-bold font-outfit text-foreground hover:text-primary transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <Link
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-lg font-medium hover:bg-green-500/20 transition-colors"
                                >
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <Sparkles size={18} />
                                    {t.hero.availableForHire || "Available for Hire"}
                                </Link>

                                <div className="flex items-center gap-8 mt-12 bg-secondary/30 p-4 rounded-full">
                                    {availableLanguages.length > 1 && (
                                        <button
                                            onClick={() => {
                                                const currentIndex = availableLanguages.indexOf(language);
                                                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                                                setLanguage(availableLanguages[nextIndex]);
                                            }}
                                            className="flex items-center gap-2 text-lg font-medium"
                                        >
                                            <span className="text-2xl">{localeMetadata[language].flag}</span>
                                            <span className="uppercase">{language}</span>
                                        </button>
                                    )}
                                    <div className="w-px h-6 bg-foreground/20" />
                                    <ThemeToggle />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    );
}
