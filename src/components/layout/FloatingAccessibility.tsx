"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Minus, Plus, Contrast, X, Eye, Type } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAnnouncer } from "@/context/AnnouncerContext";

type FontSize = 'small' | 'medium' | 'large';

const fontSizeConfig: Record<FontSize, { label: string }> = {
    small: { label: 'Small' },
    medium: { label: 'Medium' },
    large: { label: 'Large' }
};

/**
 * Premium floating accessibility controls panel on the left side.
 * Features smooth spring animations, glassmorphism design, and intuitive UX.
 */
export function FloatingAccessibility() {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const { fontSize, setFontSize, highContrast, setHighContrast } = useTheme();
    const { direction } = useLanguage();
    // Use shared state from context instead of local state
    const { isAccessibilityMenuOpen: isOpen, setAccessibilityMenuOpen: setIsOpen } = useAnnouncer();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.scrollY > 300;
            setIsVisible(shouldShow);
            // Hide tooltip after first scroll appearance
            if (shouldShow && showTooltip) {
                setTimeout(() => setShowTooltip(false), 3000);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showTooltip]);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
        const sizes: FontSize[] = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(fontSize);

        if (direction === 'increase' && currentIndex < sizes.length - 1) {
            setFontSize(sizes[currentIndex + 1]);
        } else if (direction === 'decrease' && currentIndex > 0) {
            setFontSize(sizes[currentIndex - 1]);
        }
    };

    const canDecrease = fontSize !== 'small';
    const canIncrease = fontSize !== 'large';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, x: direction === "rtl" ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === "rtl" ? 60 : -60 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    }}
                    className="fixed ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-start gap-3"
                >
                    {/* Main Toggle Button */}
                    <div className="relative">
                        <motion.button
                            onClick={() => {
                                setIsOpen(!isOpen);
                                setShowTooltip(false);
                            }}
                            className={`
                                relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl
                                transition-all duration-300 overflow-hidden
                                ${isOpen
                                    ? 'bg-primary text-white shadow-primary/30'
                                    : 'bg-background/90 backdrop-blur-xl border border-foreground/10 text-foreground shadow-lg hover:shadow-xl hover:border-primary/30'
                                }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Toggle accessibility controls"
                            aria-expanded={isOpen}
                        >
                            {/* Animated icon transition */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isOpen ? 'close' : 'open'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? (
                                        <X size={22} strokeWidth={2.5} />
                                    ) : (
                                        <Accessibility size={22} strokeWidth={2} />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pulse ring when not open */}
                            {!isOpen && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-primary/40"
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                        </motion.button>

                        {/* Initial tooltip */}
                        <AnimatePresence>
                            {showTooltip && !isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: direction === "rtl" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction === "rtl" ? 10 : -10 }}
                                    className="absolute ltr:left-full rtl:right-full ltr:ml-3 rtl:mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap shadow-lg"
                                >
                                    Accessibility
                                    <div className="absolute ltr:right-full rtl:left-full top-1/2 -translate-y-1/2 border-8 border-transparent ltr:border-r-foreground rtl:border-l-foreground" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Expanded Controls Panel */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25
                                }}
                                className="w-56 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-2xl"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-foreground/10">
                                    <Eye size={18} className="text-primary" />
                                    <h3 className="text-sm font-semibold">Accessibility</h3>
                                </div>

                                {/* Font Size Section */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Type size={14} className="text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Text Size
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 p-1 bg-muted/50 rounded-xl">
                                        <motion.button
                                            onClick={() => handleFontSizeChange('decrease')}
                                            disabled={!canDecrease}
                                            className={`
                                                flex items-center justify-center w-10 h-10 rounded-lg transition-all
                                                ${canDecrease
                                                    ? 'text-foreground hover:bg-background hover:shadow-md active:scale-95'
                                                    : 'text-muted-foreground/40 cursor-not-allowed'
                                                }
                                            `}
                                            whileHover={canDecrease ? { scale: 1.05 } : {}}
                                            whileTap={canDecrease ? { scale: 0.95 } : {}}
                                            aria-label="Decrease font size"
                                        >
                                            <Minus size={18} />
                                        </motion.button>

                                        <motion.div
                                            className="flex-1 text-center py-2 px-3 bg-background rounded-lg shadow-sm border border-foreground/5"
                                            layout
                                        >
                                            <span className="text-sm font-semibold">{fontSizeConfig[fontSize].label}</span>
                                        </motion.div>

                                        <motion.button
                                            onClick={() => handleFontSizeChange('increase')}
                                            disabled={!canIncrease}
                                            className={`
                                                flex items-center justify-center w-10 h-10 rounded-lg transition-all
                                                ${canIncrease
                                                    ? 'text-foreground hover:bg-background hover:shadow-md active:scale-95'
                                                    : 'text-muted-foreground/40 cursor-not-allowed'
                                                }
                                            `}
                                            whileHover={canIncrease ? { scale: 1.05 } : {}}
                                            whileTap={canIncrease ? { scale: 0.95 } : {}}
                                            aria-label="Increase font size"
                                        >
                                            <Plus size={18} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* High Contrast Toggle */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Contrast size={14} className="text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Contrast
                                        </span>
                                    </div>

                                    <motion.button
                                        onClick={() => setHighContrast(!highContrast)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                                            ${highContrast
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-muted/50 text-foreground hover:bg-muted'
                                            }
                                        `}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
                                        aria-pressed={highContrast}
                                    >
                                        <span className="text-sm font-medium">High Contrast</span>

                                        {/* Toggle switch */}
                                        <div className={`
                                            relative w-11 h-6 rounded-full transition-colors
                                            ${highContrast ? 'bg-white/30' : 'bg-foreground/20'}
                                        `}>
                                            <motion.div
                                                className={`
                                                    absolute top-1 w-4 h-4 rounded-full shadow-sm
                                                    ${highContrast ? 'bg-white' : 'bg-foreground/60'}
                                                `}
                                                animate={{ left: highContrast ? 24 : 4 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
