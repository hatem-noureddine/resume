"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useFeatureFlags } from "@/context/FeatureFlags";
import { localeMetadata } from "@/locales";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Header({ hasBlogPosts = true }: Readonly<{ hasBlogPosts?: boolean }>) {
    const { t, language, setLanguage, availableLanguages, direction } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("");
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

    // Scroll progress and active section detection
    const handleScroll = useCallback(() => {
        // Scroll progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setScrollProgress(progress);

        // Is scrolled (for background)
        setIsScrolled(scrollTop > 50);

        // Active section detection
        const sections = ['hero', 'services', 'experience', 'skills', 'portfolio', 'blog', 'contact'];
        const offset = 100; // Offset for header height

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= offset) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        }

        // If at top, clear active section
        if (scrollTop < 100) {
            setActiveSection("");
        }
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        // Use requestAnimationFrame to avoid synchronous setState warning
        requestAnimationFrame(() => handleScroll());
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

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
    const { isEnabled } = useFeatureFlags();
    const showPortfolio = portfolioItems.length > 0 && isEnabled('projects');

    const navLinks = t.header.nav.filter(link => {
        if (link.href.includes('portfolio')) return showPortfolio;
        if (link.href.includes('blog')) return hasBlogPosts;
        return true;
    });

    // Check if a nav link is active
    const isLinkActive = (href: string) => {
        if (href.startsWith('#')) {
            const sectionId = href.replace('#', '');
            return activeSection === sectionId;
        }
        return false;
    };

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3 md:py-4" : "bg-transparent py-4 md:py-6"
            )}
        >
            {/* Scroll Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground/5">
                <motion.div
                    className="h-full bg-linear-to-r from-primary to-purple-500"
                    style={{ width: `${scrollProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${scrollProgress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />
            </div>

            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2" aria-label="Home">
                    <div className="relative h-8 w-8">
                        <Logo className="h-full w-full" />
                    </div>
                    <span className="sr-only">Home</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-all relative py-1",
                                isLinkActive(link.href)
                                    ? "text-primary"
                                    : "text-foreground/70 hover:text-primary"
                            )}
                        >
                            {link.name}
                            {/* Active indicator */}
                            {isLinkActive(link.href) && (
                                <motion.span
                                    layoutId="activeSection"
                                    className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-primary rounded-full"
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Language Dropdown */}
                    {availableLanguages.length > 1 && (
                        <div className="relative" ref={languageMenuRef}>
                            <button
                                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                className="flex items-center gap-2 text-sm font-medium text-secondary-foreground hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-foreground/5 active:bg-foreground/10"
                                aria-label="Select language"
                                aria-expanded={isLanguageMenuOpen}
                                aria-haspopup="true"
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
                                        className="absolute top-full ltr:right-0 rtl:left-0 mt-2 min-w-[160px] bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-xl overflow-hidden py-2"
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

                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors",
                            isLinkActive("#contact") && "ring-2 ring-green-500/50"
                        )}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <Sparkles size={14} />
                        {t.contact?.title || "Contact Me"}
                    </a>
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 md:hidden"
                        >
                            {/* Backdrop with blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-background/95 backdrop-blur-xl"
                                onClick={() => setMobileMenuOpen(false)}
                            />

                            {/* Content */}
                            <motion.div
                                initial={{ x: direction === "rtl" ? "-100%" : "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: direction === "rtl" ? "-100%" : "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute inset-y-0 ltr:right-0 rtl:left-0 w-full bg-background flex flex-col"
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

                                <div className="flex-1 flex flex-col items-center justify-center gap-6 -mt-20">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    "text-3xl font-bold font-outfit transition-colors",
                                                    isLinkActive(link.href)
                                                        ? "text-primary"
                                                        : "text-foreground hover:text-primary"
                                                )}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: navLinks.length * 0.05 }}
                                    >
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
                                            {t.contact?.title || "Contact Me"}
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (navLinks.length + 1) * 0.05 }}
                                        className="flex items-center gap-8 mt-12 bg-secondary/30 p-4 rounded-full"
                                    >
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
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    );
}
