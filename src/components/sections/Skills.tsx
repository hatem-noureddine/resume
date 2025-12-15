"use client";

import { motion } from "framer-motion";
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
    Bot
} from "lucide-react";

interface SkillItem {
    name: string;
    icon?: string;
    link?: string;
}

interface SkillCategory {
    name: string;
    items: (string | SkillItem)[];
}

/**
 * Maps a skill name to a corresponding Lucide icon.
 */
const getSkillIcon = (skillName: string, explicitIcon?: string) => {
    if (explicitIcon) {
        const iconMap: Record<string, React.ReactNode> = {
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
        if (iconMap[explicitIcon]) return iconMap[explicitIcon];
    }

    const normalized = skillName.toLowerCase();

    if (normalized.includes("android") || normalized.includes("mobile") || normalized.includes("ios")) return <Smartphone className="w-4 h-4" />;
    if (normalized.includes("design") || normalized.includes("figma") || normalized.includes("ui") || normalized.includes("ux")) return <Palette className="w-4 h-4" />;
    if (normalized.includes("team") || normalized.includes("collab") || normalized.includes("agile")) return <Users className="w-4 h-4" />;
    if (normalized.includes("doc") || normalized.includes("analy")) return <FileText className="w-4 h-4" />;
    if (normalized.includes("arch") || normalized.includes("pattern")) return <Layers className="w-4 h-4" />;
    if (normalized.includes("api") || normalized.includes("server") || normalized.includes("backend")) return <Server className="w-4 h-4" />;
    if (normalized.includes("data") || normalized.includes("sql") || normalized.includes("room")) return <Database className="w-4 h-4" />;
    if (normalized.includes("git")) return <GitBranch className="w-4 h-4" />;
    if (normalized.includes("test") || normalized.includes("junit") || normalized.includes("quality")) return <CheckCircle className="w-4 h-4" />;
    if (normalized.includes("ci/cd") || normalized.includes("jenkins") || normalized.includes("tools")) return <Wrench className="w-4 h-4" />;
    if (normalized.includes("web") || normalized.includes("react") || normalized.includes("next")) return <Globe className="w-4 h-4" />;
    if (normalized.includes("ai") || normalized.includes("gpt") || normalized.includes("copilot")) return <Bot className="w-4 h-4" />;
    if (normalized.includes("kotlin") || normalized.includes("java") || normalized.includes("code")) return <Code className="w-4 h-4" />;
    if (normalized.includes("analytic")) return <BarChart className="w-4 h-4" />;
    if (normalized.includes("terminal") || normalized.includes("bash")) return <Terminal className="w-4 h-4" />;

    return <Code className="w-4 h-4" />;
};

/**
 * Professional Skills - Grid of skill cards
 */
const ProfessionalSkillsColumn = ({ items, title }: { items: (string | SkillItem)[], title: string }) => (
    <div className="w-full">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
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

        <div className="space-y-3">
            {items.map((item: string | SkillItem, index: number) => {
                const isObj = typeof item === 'object';
                const name = isObj ? (item as SkillItem).name : (item as string);
                const icon = isObj ? (item as SkillItem).icon : undefined;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-secondary/30 p-3 rounded-xl font-medium border border-foreground/5 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 flex items-center gap-3 group hover-lift"
                    >
                        <div className="text-primary group-hover:scale-110 transition-transform shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getSkillIcon(name, icon)}
                        </div>
                        <span className="text-sm md:text-base">{name}</span>
                    </motion.div>
                );
            })}
        </div>
    </div>
);

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

/**
 * Technical Skills - Color-coded Tag Cloud
 * All skills visible at once with category color differentiation
 */
const TechnicalSkillsColumn = ({ categories, title }: { categories: SkillCategory[], title: string }) => {
    // Flatten all skills with their category index for coloring
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
                initial={{ opacity: 0, x: 20 }}
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

            {/* Tag Cloud - All skills visible */}
            <div className="bg-secondary/10 rounded-xl border border-foreground/5 p-3 md:p-4">
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {allSkills.map(({ skill, categoryIndex }, index) => {
                        const isLink = typeof skill === 'object' && !!(skill as SkillItem).link;
                        const content = typeof skill === 'object' ? (skill as SkillItem).name : (skill as string);
                        const link = typeof skill === 'object' ? (skill as SkillItem).link : undefined;
                        const colorClass = categoryColors[categoryIndex % categoryColors.length];

                        const baseClass = `text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full border font-medium transition-all duration-200 ${colorClass}`;

                        if (isLink) {
                            return (
                                <motion.a
                                    key={`${categoryIndex}-${index}`}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.01 }}
                                    className={`${baseClass} cursor-pointer hover:scale-105`}
                                >
                                    {content}
                                </motion.a>
                            );
                        }

                        return (
                            <motion.span
                                key={`${categoryIndex}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.01 }}
                                className={baseClass}
                            >
                                {content}
                            </motion.span>
                        );
                    })}
                </div>

                {/* Category Legend - Compact */}
                <div className="mt-3 md:mt-4 pt-3 border-t border-foreground/5 flex flex-wrap gap-2 md:gap-3">
                    {categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${categoryDotColors[index % categoryDotColors.length]}`} />
                            <span>{category.name}</span>
                            <span className="opacity-50">({category.items.length})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export function Skills() {
    const { t } = useLanguage();
    const { skills } = t;

    return (
        <section id="skills" className="py-16 md:py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
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
                        items={skills.professional.items}
                        title={skills.professional.title}
                    />

                    {/* Right Column - Technical Skills */}
                    <TechnicalSkillsColumn
                        categories={skills.technical.categories}
                        title={skills.technical.title}
                    />
                </div>
            </div>
        </section>
    );
}
