"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Calendar, ChevronDown, ChevronUp, Clock, Briefcase, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { container, fadeInUp } from "@/lib/animations";

const INITIAL_VISIBLE_COUNT = 3;

interface ExperienceItem {
    id: number | string;
    period: string;
    role: string;
    company: string;
    logo?: string;
    description: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
    highlights?: string[];
    skills?: string[];
    language?: string;
}

interface ExperienceLocale {
    title: string;
    subtitle?: string;
    roleDescription?: string;
    showMore?: string;
    showLess?: string;
    filterBySkill?: string;
    allSkills?: string;
    clearFilter?: string;
    items: ExperienceItem[];
}

export function Experience({ items }: Readonly<{ items?: ExperienceItem[] }>) {
    const { t, language: currentLang, direction } = useLanguage();
    const experience = t.experience as ExperienceLocale;
    const cmsItems = items?.filter(item => !item.language || item.language === currentLang);
    const itemsToDisplay = (cmsItems && cmsItems.length > 0) ? cmsItems : experience.items;
    const prefersReducedMotion = usePrefersReducedMotion();

    // Sort items by startDate descending
    const sortedItems = useMemo(() => [...itemsToDisplay].sort((a, b) => {
        const dateA = new Date(a.startDate || "1900-01").getTime();
        const dateB = new Date(b.startDate || "1900-01").getTime();
        return dateB - dateA;
    }), [itemsToDisplay]);

    // Extract all unique skills for filtering
    const allSkills = useMemo(() => Array.from(
        new Set(itemsToDisplay.flatMap(item => item.skills || []))
    ).sort((a, b) => a.localeCompare(b)), [itemsToDisplay]);

    // Skill filter state
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    // Filter items by skill
    const filteredItems = useMemo(() => selectedSkill
        ? sortedItems.filter(item => item.skills?.includes(selectedSkill))
        : sortedItems, [selectedSkill, sortedItems]);

    // Show More functionality
    const [showAll, setShowAll] = useState(false);
    const visibleItems = useMemo(() => showAll ? filteredItems : filteredItems.slice(0, INITIAL_VISIBLE_COUNT), [showAll, filteredItems]);
    const hasMoreItems = filteredItems.length > INITIAL_VISIBLE_COUNT;
    const hiddenCount = filteredItems.length - INITIAL_VISIBLE_COUNT;

    const [activeId, setActiveId] = useState<number | string | undefined>(sortedItems[0]?.id);
    const activeExperience = useMemo(() => sortedItems.find((item) => item.id === activeId) || sortedItems[0], [sortedItems, activeId]);

    // Mobile: Only first item expanded by default
    const [expandedIds, setExpandedIds] = useState<(number | string)[]>(
        sortedItems.length > 0 ? [sortedItems[0].id] : []
    );

    const toggleAccordion = (id: number | string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const currentIndex = visibleItems.findIndex(item => item.id === activeId);
        const isRtl = direction === "rtl";

        if (e.key === 'ArrowDown' || (isRtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight')) {
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, visibleItems.length - 1);
            setActiveId(visibleItems[nextIndex].id);
        } else if (e.key === 'ArrowUp' || (isRtl ? e.key === 'ArrowRight' : e.key === 'ArrowLeft')) {
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            setActiveId(visibleItems[prevIndex].id);
        }
    }, [activeId, visibleItems, direction]);

    useEffect(() => {
        const section = document.getElementById('experience');
        if (!section) return;

        const handleFocus = () => {
            globalThis.addEventListener('keydown', handleKeyDown);
        };
        const handleBlur = () => {
            globalThis.removeEventListener('keydown', handleKeyDown);
        };

        section.addEventListener('focusin', handleFocus);
        section.addEventListener('focusout', handleBlur);

        return () => {
            section.removeEventListener('focusin', handleFocus);
            section.removeEventListener('focusout', handleBlur);
            globalThis.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Timeline scroll animation
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });
    const scrollProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [ariaMessage, setAriaMessage] = useState("");

    // Update activeId if current selection is filtered out
    useEffect(() => {
        if (filteredItems.length > 0 && !filteredItems.some(item => item.id === activeId)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveId(filteredItems[0].id);
        }

        if (selectedSkill) {
            setAriaMessage(`Found ${filteredItems.length} results for ${selectedSkill}`);
        } else {
            setAriaMessage("");
        }
    }, [selectedSkill, filteredItems, activeId]);

    // Get localized labels with fallbacks
    const subtitle = experience.subtitle || "Work History";
    const roleDescLabel = experience.roleDescription || "Key Responsibilities";
    const showMoreText = experience.showMore || "Show More";
    const showLessText = experience.showLess || "Show Less";
    const filterLabel = experience.filterBySkill || "Filter by Skill";
    const allSkillsLabel = experience.allSkills || "All";
    const clearFilterLabel = experience.clearFilter || "Clear";

    return (
        <section id="experience" className="py-24 relative bg-secondary/10" aria-labelledby="experience-title">
            <div className="sr-only" aria-live="polite">{ariaMessage}</div>
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={experience.title}
                    subtitle={subtitle}
                    className="mb-12"
                    id="experience-title"
                />

                {/* Skill Filter */}
                {allSkills.length > 0 && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto mb-8"
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground ltr:mr-2 rtl:ml-2">
                                <Filter size={14} />
                                <span className="hidden sm:inline">{filterLabel}:</span>
                            </div>

                            <button
                                onClick={() => setSelectedSkill(null)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                    selectedSkill
                                        ? "bg-secondary/30 text-secondary-foreground hover:bg-secondary/50"
                                        : "bg-primary text-white"
                                )}
                            >
                                {allSkillsLabel}
                            </button>

                            {allSkills.slice(0, 8).map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => setSelectedSkill(skill === selectedSkill ? null : skill)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                        selectedSkill === skill
                                            ? "bg-primary text-white"
                                            : "bg-secondary/30 text-secondary-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    {skill}
                                </button>
                            ))}

                            {selectedSkill && (
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={12} />
                                    {clearFilterLabel}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                <div className="max-w-6xl mx-auto">
                    {/* Mobile Accordion View */}
                    <motion.div
                        className="md:hidden flex flex-col gap-4"
                        variants={prefersReducedMotion ? {} : container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {visibleItems.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={prefersReducedMotion ? {} : fadeInUp}
                                className="bg-background border border-foreground/5 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleAccordion(item.id)}
                                    className="w-full flex items-center justify-between p-4 ltr:text-left rtl:text-right bg-secondary/30"
                                    aria-expanded={expandedIds.includes(item.id)}
                                    aria-controls={`experience-content-${item.id}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn("rounded-xl bg-secondary/20 shrink-0 w-10 h-10 text-sm flex items-center justify-center border border-primary/10 font-bold text-primary uppercase")}>
                                            {item.company.charAt(0)}
                                        </div>
                                        <div>
                                            <span
                                                id={`experience-heading-${item.id}`}
                                                className="block text-foreground font-bold font-outfit text-sm mb-0.5"
                                            >
                                                {item.role}
                                            </span>
                                            <span className="block text-secondary-foreground text-xs">
                                                {item.company}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Calendar size={12} />
                                                <span>{item.period}</span>
                                                {item.duration && (
                                                    <>
                                                        <span className="text-foreground/20">•</span>
                                                        <Clock size={12} />
                                                        <span>{item.duration}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {expandedIds.includes(item.id) ?
                                        <ChevronUp className="text-primary shrink-0" size={20} /> :
                                        <ChevronDown className="text-secondary-foreground shrink-0" size={20} />
                                    }
                                </button>

                                <AnimatePresence>
                                    {expandedIds.includes(item.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            id={`experience-content-${item.id}`}
                                            role="region"
                                            aria-labelledby={`experience-heading-${item.id}`}
                                        >
                                            <div className="p-4 pt-0 border-t border-foreground/5">
                                                <div className="mt-4">
                                                    <p className="text-secondary-foreground text-sm leading-relaxed mb-3">
                                                        {item.description}
                                                    </p>

                                                    {item.highlights && item.highlights.length > 0 && (
                                                        <ul className="space-y-1.5 text-xs text-secondary-foreground/80 mb-3">
                                                            {item.highlights.map((highlight) => (
                                                                <li key={highlight} className="flex items-start gap-2">
                                                                    <span className="text-primary mt-1">•</span>
                                                                    <span>{highlight}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {item.skills && item.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                                            {item.skills.map((skill) => (
                                                                <button
                                                                    key={skill}
                                                                    onClick={() => setSelectedSkill(skill)}
                                                                    className={cn(
                                                                        "text-xs px-2 py-0.5 rounded-full border transition-all",
                                                                        selectedSkill === skill
                                                                            ? "bg-primary text-white border-primary"
                                                                            : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                                                    )}
                                                                >
                                                                    {skill}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}

                        {/* Show More Button - Mobile */}
                        {hasMoreItems && (
                            <motion.button
                                onClick={() => setShowAll(!showAll)}
                                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-secondary/30 text-secondary-foreground hover:bg-secondary/50 transition-all duration-300 font-medium text-sm mx-auto"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {showAll ? (
                                    <>
                                        <ChevronUp size={16} />
                                        {showLessText}
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        {showMoreText} ({hiddenCount})
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Desktop Layout with Timeline */}
                    <div className="hidden md:flex gap-8 lg:gap-16">
                        {/* Left Column: Timeline */}
                        <div className="md:w-1/3 relative" ref={containerRef}>
                            {/* Vertical Timeline Line - Background */}
                            <div className="absolute ltr:left-5 rtl:right-5 top-8 bottom-8 w-0.5 bg-foreground/5 rounded-full" />

                            {/* Vertical Timeline Line - Animated Fill */}
                            <motion.div
                                className="absolute ltr:left-5 rtl:right-5 top-8 w-0.5 bg-linear-to-b from-primary via-primary/50 to-primary/10 rounded-full origin-top"
                                style={{ scaleY: scrollProgress }}
                            />

                            <div className="flex flex-col gap-2 relative z-10">
                                {visibleItems.map((item, index) => {
                                    const currentYear = item.startDate?.split('-')[0];
                                    const prevYear = index > 0 ? visibleItems[index - 1].startDate?.split('-')[0] : null;
                                    const showYear = currentYear && currentYear !== prevYear;

                                    return (
                                        <div key={item.id} className="relative">
                                            {showYear && (
                                                <div className="absolute ltr:-left-12 rtl:-right-12 top-6 text-[10px] font-bold text-primary/40 uppercase tracking-widest ltr:rotate-270 rtl:rotate-90 origin-center">
                                                    {currentYear}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setActiveId(item.id)}
                                                className={cn(
                                                    "ltr:text-left rtl:text-right p-4 ltr:pl-12 rtl:pr-12 rounded-xl transition-all duration-300 border relative group focus:outline-none focus:ring-2 focus:ring-primary/50 w-full mb-2",
                                                    activeId === item.id
                                                        ? "bg-primary text-white border-primary shadow-lg"
                                                        : "bg-background text-secondary-foreground border-foreground/5 hover:bg-secondary hover:text-foreground"
                                                )}
                                            >
                                                {/* Timeline Dot */}
                                                <div className={cn(
                                                    "absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all",
                                                    activeId === item.id
                                                        ? "bg-white border-primary scale-125"
                                                        : "bg-background border-primary/50 group-hover:border-primary"
                                                )}>
                                                    {activeId === item.id && (
                                                        <motion.div
                                                            layoutId="activeIndicator"
                                                            className="absolute inset-1 rounded-full bg-primary"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mb-1">
                                                    <Briefcase size={14} className={activeId === item.id ? "text-white/80" : "text-primary"} />
                                                    <span className="text-sm font-bold font-outfit">{item.role}</span>
                                                </div>
                                                <span className={cn(
                                                    "block text-xs mb-1",
                                                    activeId === item.id ? "text-white/80" : "text-secondary-foreground/60"
                                                )}>
                                                    {item.company}
                                                </span>
                                                <div className={cn(
                                                    "flex items-center gap-2 text-xs",
                                                    activeId === item.id ? "text-white/70" : "text-secondary-foreground/50"
                                                )}>
                                                    <Calendar size={12} />
                                                    <span>{item.period}</span>
                                                    {item.duration && (
                                                        <>
                                                            <span className="opacity-50">•</span>
                                                            <span>{item.duration}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Show More Button - Desktop */}
                            {hasMoreItems && (
                                <motion.button
                                    onClick={() => setShowAll(!showAll)}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary/30 text-secondary-foreground hover:bg-secondary/50 transition-all duration-300 font-medium text-sm ltr:ml-8 rtl:mr-8"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp size={16} />
                                            {showLessText}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={16} />
                                            +{hiddenCount} {showMoreText}
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:w-2/3 flex flex-col relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeExperience.id}
                                    initial={prefersReducedMotion ? {} : { opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={prefersReducedMotion ? {} : { opacity: 0, x: direction === "rtl" ? 20 : -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-background border border-foreground/5 p-8 md:p-10 rounded-2xl relative overflow-hidden"
                                >
                                    {/* Background Decoration */}
                                    <div className="absolute top-0 ltr:right-0 rtl:left-0 w-40 h-40 bg-primary/5 ltr:rounded-bl-full rtl:rounded-br-full ltr:-mr-10 rtl:-ml-10 -mt-10" />
                                    <div className="absolute bottom-0 ltr:left-0 rtl:right-0 w-24 h-24 bg-primary/3 ltr:rounded-tr-full rtl:rounded-tl-full ltr:-ml-6 rtl:-mr-6 -mb-6" />

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex flex-col md:flex-row gap-6 md:items-start mb-6">
                                            <div className={cn("w-16 h-16 text-2xl rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 font-bold text-primary shrink-0 uppercase shadow-lg")}>
                                                {activeExperience.company.charAt(0)}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-2xl lg:text-3xl font-bold font-outfit text-foreground mb-2">
                                                    {activeExperience.role}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                                    <span className="text-primary font-medium">{activeExperience.company}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                    <span className="flex items-center gap-1.5 text-secondary-foreground">
                                                        <Calendar size={14} />
                                                        {activeExperience.period}
                                                    </span>
                                                    {activeExperience.duration && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                            <span className="flex items-center gap-1.5 text-secondary-foreground">
                                                                <Clock size={14} />
                                                                {activeExperience.duration}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6">
                                            <p className="text-lg text-secondary-foreground leading-relaxed">
                                                {activeExperience.description}
                                            </p>
                                        </div>

                                        {/* Highlights */}
                                        {activeExperience.highlights && activeExperience.highlights.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-xs uppercase tracking-wider text-secondary-foreground/60 font-bold mb-3">
                                                    {roleDescLabel}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {activeExperience.highlights.map((highlight) => (
                                                        <motion.li
                                                            key={highlight}
                                                            initial={prefersReducedMotion ? {} : { opacity: 0, x: direction === "rtl" ? 10 : -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-start gap-3 text-secondary-foreground"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                            <span>{highlight}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Skills Tags - Clickable for filtering */}
                                        {activeExperience.skills && activeExperience.skills.length > 0 && (
                                            <div className="pt-4 border-t border-foreground/5">
                                                <div className="flex flex-wrap gap-2">
                                                    {activeExperience.skills.map((skill) => (
                                                        <motion.button
                                                            key={skill}
                                                            onClick={() => setSelectedSkill(skill === selectedSkill ? null : skill)}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className={cn(
                                                                "text-sm px-3 py-1 rounded-full border font-medium transition-all",
                                                                selectedSkill === skill
                                                                    ? "bg-primary text-white border-primary"
                                                                    : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                                            )}
                                                        >
                                                            {skill}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Empty state when filter returns no results */}
                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-muted-foreground"
                        >
                            <p>No experiences found with skill &quot;{selectedSkill}&quot;</p>
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="mt-2 text-primary hover:underline"
                            >
                                {clearFilterLabel}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
