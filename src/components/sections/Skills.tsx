"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    Layout,
    Code,
    Smartphone,
    Palette,
    Users,
    FileText,
    CheckCircle,
    Layers,
    Server,
    Database,
    GitBranch,
    Terminal,
    Globe,
    BarChart,
    Wrench,
    Bot,
    ChevronDown,
    ChevronUp,
    Filter,
    X
} from "lucide-react";

interface SkillItem {
    name: string;
    icon?: string;
    link?: string;
    language?: string;
}

interface SkillCategory {
    name: string;
    items: (string | SkillItem)[];
}

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { container, fadeInLeft } from "@/lib/animations";



// Mobile detection hook
function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(globalThis.innerWidth < breakpoint);
        checkMobile();
        globalThis.addEventListener("resize", checkMobile);
        return () => globalThis.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Skill icon mapping - patterns to match skill names
 */
const skillPatterns: Array<{ patterns: string[], icon: React.ReactNode }> = [
    { patterns: ["android", "mobile", "ios"], icon: <Smartphone className="w-4 h-4" /> },
    { patterns: ["design", "figma", "ui", "ux"], icon: <Palette className="w-4 h-4" /> },
    { patterns: ["team", "collab", "agile"], icon: <Users className="w-4 h-4" /> },
    { patterns: ["doc", "analy"], icon: <FileText className="w-4 h-4" /> },
    { patterns: ["arch", "pattern"], icon: <Layers className="w-4 h-4" /> },
    { patterns: ["api", "server", "backend"], icon: <Server className="w-4 h-4" /> },
    { patterns: ["data", "sql", "room"], icon: <Database className="w-4 h-4" /> },
    { patterns: ["git"], icon: <GitBranch className="w-4 h-4" /> },
    { patterns: ["test", "junit", "quality"], icon: <CheckCircle className="w-4 h-4" /> },
    { patterns: ["ci/cd", "jenkins", "tools"], icon: <Wrench className="w-4 h-4" /> },
    { patterns: ["web", "react", "next"], icon: <Globe className="w-4 h-4" /> },
    { patterns: ["ai", "gpt", "copilot"], icon: <Bot className="w-4 h-4" /> },
    { patterns: ["kotlin", "java", "code"], icon: <Code className="w-4 h-4" /> },
    { patterns: ["analytic"], icon: <BarChart className="w-4 h-4" /> },
    { patterns: ["terminal", "bash"], icon: <Terminal className="w-4 h-4" /> },
];

const explicitIconMap: Record<string, React.ReactNode> = {
    "Layout": <Layout className="w-4 h-4" />,
    "Code": <Code className="w-4 h-4" />,
    "Smartphone": <Smartphone className="w-4 h-4" />,
    "Palette": <Palette className="w-4 h-4" />,
    "Users": <Users className="w-4 h-4" />,
    "FileText": <FileText className="w-4 h-4" />,
    "CheckCircle": <CheckCircle className="w-4 h-4" />,
    "Layers": <Layers className="w-4 h-4" />,
    "Server": <Server className="w-4 h-4" />,
    "Database": <Database className="w-4 h-4" />,
    "GitBranch": <GitBranch className="w-4 h-4" />,
    "Terminal": <Terminal className="w-4 h-4" />,
    "Globe": <Globe className="w-4 h-4" />,
    "BarChart": <BarChart className="w-4 h-4" />,
    "Wrench": <Wrench className="w-4 h-4" />,
    "Bot": <Bot className="w-4 h-4" />
};

/**
 * Maps a skill name to a corresponding Lucide icon.
 */
const getSkillIcon = (skillName: string, explicitIcon?: string): React.ReactNode => {
    // Check for explicit icon first
    if (explicitIcon && explicitIconMap[explicitIcon]) {
        return explicitIconMap[explicitIcon];
    }

    // Match against patterns
    const normalized = skillName.toLowerCase();
    const matched = skillPatterns.find(({ patterns }) =>
        patterns.some(pattern => normalized.includes(pattern))
    );

    return matched?.icon ?? <Code className="w-4 h-4" />;
};

/**
 * Professional Skills - Grid of skill cards
 */
/**
 * Professional Skills - Grid of skill cards
 */
const ProfessionalSkillsColumn = ({
    items,
    title,
    prefersReducedMotion
}: Readonly<{
    items: (string | SkillItem)[],
    title: string,
    prefersReducedMotion: boolean
}>) => {
    return (
        <div className="w-full">
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-6"
            >
                <h3 className="text-xl md:text-2xl font-bold text-primary font-outfit flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {title}
                </h3>
                <div className="w-16 h-1 bg-primary/30 rounded-full mt-2" />
            </motion.div>

            <motion.div
                variants={prefersReducedMotion ? {} : container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
            >
                {items.map((item: string | SkillItem) => {
                    const isObj = typeof item === 'object';
                    const name = isObj ? item.name : item;
                    const icon = isObj ? item.icon : undefined;

                    return (
                        <motion.div
                            key={name}
                            variants={prefersReducedMotion ? {} : fadeInLeft}
                            className="bg-secondary/30 p-3 rounded-xl font-medium border border-foreground/5 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 flex items-center gap-3 group hover-lift"
                        >
                            <div className="text-primary group-hover:scale-110 transition-transform shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                {getSkillIcon(name, icon)}
                            </div>
                            <span className="text-sm md:text-base">{name}</span>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

// Category colors for tag cloud
const categoryColors = [
    'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20',
    'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20',
    'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20',
    'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20',
    'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20',
    'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20',
];

const categoryDotColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
];

const categoryBorderColors = [
    'border-blue-500/50',
    'border-purple-500/50',
    'border-emerald-500/50',
    'border-orange-500/50',
    'border-pink-500/50',
    'border-cyan-500/50',
];

/**
 * Skill Tag with Tooltip
 */
const SkillTag = ({
    skill,
    categoryIndex,
    index,
    prefersReducedMotion,
    isFiltered
}: Readonly<{
    skill: string | SkillItem,
    categoryIndex: number,
    index: number,
    prefersReducedMotion: boolean,
    isFiltered: boolean
}>) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const isSkillObject = typeof skill === 'object';
    const isLink = isSkillObject && !!skill.link;
    const content = isSkillObject ? skill.name : skill;
    const link = isSkillObject ? skill.link : undefined;
    const colorClass = categoryColors[categoryIndex % categoryColors.length];

    const baseClass = `text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full border font-medium transition-all duration-200 ${colorClass} ${isFiltered ? 'ring-2 ring-primary ring-offset-1' : ''}`;

    const animationProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, scale: 0.8 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { delay: index * 0.01 }
        };

    const tooltipContent = (
        <AnimatePresence>
            {showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg shadow-lg whitespace-nowrap z-50"
                >
                    <div className="flex items-center gap-2">
                        {getSkillIcon(content)}
                        <span>{content}</span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (isLink) {
        return (
            <motion.a
                {...animationProps}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClass} cursor-pointer hover:scale-105 relative`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {tooltipContent}
                {content}
            </motion.a>
        );
    }

    return (
        <motion.span
            {...animationProps}
            className={`${baseClass} relative`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {tooltipContent}
            {content}
        </motion.span>
    );
};

/**
 * Desktop: Category-based collapsible grid
 */
const DesktopCategoryGrid = ({
    categories,
    title,
    prefersReducedMotion,
    activeFilter,
    setActiveFilter
}: Readonly<{
    categories: SkillCategory[],
    title: string,
    prefersReducedMotion: boolean,
    activeFilter: number | null,
    setActiveFilter: (filter: number | null) => void
}>) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0, 1, 2])); // First 3 expanded by default

    const toggleCategory = (index: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedCategories(newExpanded);
    };

    const filteredCategories = activeFilter === null
        ? categories
        : categories.filter((_, i) => i === activeFilter);

    return (
        <div className="w-full">
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-4 md:mb-6"
            >
                <h3 className="text-xl md:text-2xl font-bold text-primary font-outfit flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    {title}
                </h3>
                <div className="w-16 h-1 bg-primary/30 rounded-full mt-2" />
            </motion.div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setActiveFilter(null)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === null
                        ? 'bg-primary text-white'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary'
                        }`}
                >
                    <Filter className="w-3 h-3" />
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => {
                            const idx = categories.findIndex(c => c.name === category.name);
                            setActiveFilter(activeFilter === idx ? null : idx);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === categories.findIndex(c => c.name === category.name)
                            ? `${categoryDotColors[categories.findIndex(c => c.name === category.name) % categoryDotColors.length]} text-white`
                            : `bg-secondary/50 text-foreground hover:bg-secondary border ${categoryBorderColors[categories.findIndex(c => c.name === category.name) % categoryBorderColors.length]}`
                            }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${activeFilter === categories.findIndex(c => c.name === category.name) ? 'bg-white' : categoryDotColors[categories.findIndex(c => c.name === category.name) % categoryDotColors.length]}`} />
                        {category.name}
                        <span className="opacity-60">({category.items.length})</span>
                    </button>
                ))}
                {activeFilter !== null && (
                    <button
                        onClick={() => setActiveFilter(null)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs text-secondary-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Collapsible Category Sections */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredCategories.map((category, catIndex) => {
                        const originalIndex = categories.indexOf(category);
                        const isExpanded = expandedCategories.has(originalIndex);
                        const colorClass = categoryBorderColors[originalIndex % categoryBorderColors.length];
                        const dotColor = categoryDotColors[originalIndex % categoryDotColors.length];

                        return (
                            <motion.div
                                key={category.name}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                transition={{ delay: catIndex * 0.05 }}
                                className={`bg-secondary/10 rounded-xl border ${colorClass} overflow-hidden`}
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(originalIndex)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-secondary/20 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                                        <span className="font-medium text-sm">{category.name}</span>
                                        <span className="text-xs text-secondary-foreground">({category.items.length})</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-secondary-foreground" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-secondary-foreground" />
                                    )}
                                </button>

                                {/* Skills Grid */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-3 pb-3"
                                        >
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {category.items.map((skill, skillIndex) => (
                                                    <SkillTag
                                                        key={typeof skill === 'string' ? `${skill}-${originalIndex}` : `${skill.name}-${originalIndex}`}
                                                        skill={skill}
                                                        categoryIndex={originalIndex}
                                                        index={skillIndex}
                                                        prefersReducedMotion={prefersReducedMotion}
                                                        isFiltered={activeFilter === originalIndex}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

/**
 * Mobile: Tag Cloud (original design)
 */
const MobileTagCloud = ({
    categories,
    title,
    prefersReducedMotion
}: Readonly<{
    categories: SkillCategory[],
    title: string,
    prefersReducedMotion: boolean
}>) => {
    const allSkills = categories.flatMap((category, catIndex) =>
        category.items.map((skill) => ({
            skill,
            categoryIndex: catIndex,
            categoryName: category.name,
        }))
    );

    return (
        <div className="w-full">
            <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-4 md:mb-6"
            >
                <h3 className="text-xl md:text-2xl font-bold text-primary font-outfit flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    {title}
                </h3>
                <div className="w-16 h-1 bg-primary/30 rounded-full mt-2" />
            </motion.div>

            <div className="bg-secondary/10 rounded-xl border border-foreground/5 p-3">
                <div className="flex flex-wrap gap-1.5">
                    {allSkills.map(({ skill, categoryIndex }) => (
                        <SkillTag
                            key={typeof skill === 'string' ? `${skill}-${categoryIndex}` : `${skill.name}-${categoryIndex}`}
                            skill={skill}
                            categoryIndex={categoryIndex}
                            index={allSkills.findIndex(s => s.skill === skill && s.categoryIndex === categoryIndex)}
                            prefersReducedMotion={prefersReducedMotion}
                            isFiltered={false}
                        />
                    ))}
                </div>

                {/* Category Legend */}
                <div className="mt-3 pt-3 border-t border-foreground/5 flex flex-wrap gap-2">
                    {categories.map((category, catIdx) => (
                        <div key={category.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${categoryDotColors[catIdx % categoryDotColors.length]}`} />
                            <span>{category.name}</span>
                            <span className="opacity-50">({category.items.length})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export function Skills({
    professionalItems,
    technicalCategories
}: Readonly<{
    professionalItems?: (string | SkillItem)[],
    technicalCategories?: SkillCategory[]
}>) {
    const { t, language: currentLang } = useLanguage();
    const { skills } = t;
    const prefersReducedMotion = usePrefersReducedMotion();
    const isMobile = useIsMobile();
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    const professionalSkillsToFilter = (professionalItems && professionalItems.length > 0) ? professionalItems : [];
    const displayProfesh = professionalSkillsToFilter.length > 0
        ? professionalSkillsToFilter.filter(s => typeof s === 'string' || !s.language || s.language === currentLang)
        : skills.professional.items;

    const technicalCategoriesToFilter = (technicalCategories && technicalCategories.length > 0) ? technicalCategories : [];
    const displayTech = technicalCategoriesToFilter.length > 0
        ? technicalCategoriesToFilter.map(cat => ({
            ...cat,
            items: cat.items.filter(s => typeof s === 'string' || !s.language || s.language === currentLang)
        })).filter(cat => cat.items.length > 0)
        : skills.technical.categories;

    return (
        <section id="skills" className="py-16 md:py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">
                        {skills.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {skills.description}
                    </p>
                </motion.div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
                    {/* Left Column - Professional Skills */}
                    <ProfessionalSkillsColumn
                        items={displayProfesh}
                        title={skills.professional.title}
                        prefersReducedMotion={prefersReducedMotion}
                    />

                    {/* Right Column - Technical Skills */}
                    {isMobile ? (
                        <MobileTagCloud
                            categories={displayTech}
                            title={skills.technical.title}
                            prefersReducedMotion={prefersReducedMotion}
                        />
                    ) : (
                        <DesktopCategoryGrid
                            categories={displayTech}
                            title={skills.technical.title}
                            prefersReducedMotion={prefersReducedMotion}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
