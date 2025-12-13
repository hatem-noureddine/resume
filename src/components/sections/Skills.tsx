"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    ChevronDown,
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

/**
 * Maps a skill name to a corresponding Lucide icon.
 * Uses a normalized search for keywords if no explicit icon is provided.
 * 
 * @param skillName - The name of the skill (e.g., "React", "Project Management").
 * @param explicitIcon - Optional explicit icon name from data configuration.
 * @returns A JSX Element containing the Lucide icon.
 */
const getSkillIcon = (skillName: string, explicitIcon?: string) => {
    // If explicit icon name is provided, try to match it
    if (explicitIcon) {
        const iconMap: Record<string, any> = {
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

    // Heuristic mapping based on common keywords
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

    // Default fallback
    return <Code className="w-4 h-4" />;
};

/**
 * Skills Section Component
 * Displays professional and technical skills in a responsive layout.
 * - Professional Skills: Grid of cards with icons.
 * - Technical Skills: Accordion-style expandable categories with cloud/tag layout for items.
 */
export function Skills() {
    const { t } = useLanguage();
    const { skills } = t;

    const [openCategory, setOpenCategory] = useState<string | null>(null);

    return (
        <section id="skills" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">
                        {skills.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {skills.description}
                    </p>
                </motion.div>

                <div className="flex flex-col gap-20 max-w-5xl mx-auto">
                    {/* Professional Skills Section - Grid Layout */}
                    <div className="w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary font-outfit border-l-4 border-primary pl-4">
                                {skills.professional.title}
                            </h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {skills.professional.items.map((item: any, index: number) => {
                                const isObj = typeof item === 'object';
                                const name = isObj ? item.name : item;
                                const icon = isObj ? item.icon : undefined;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-card text-card-foreground p-4 rounded-xl font-medium border border-foreground/5 hover:border-primary/50 transition-all duration-300 flex items-center gap-3 group hover:shadow-md"
                                    >
                                        <div className="text-primary group-hover:scale-110 transition-transform shrink-0">
                                            {getSkillIcon(name, icon)}
                                        </div>
                                        <span className="text-base">{name}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Technical Skills Section - Categories with Icon Headers & Tag Lists */}
                    <div className="w-full">
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl font-bold mb-8 text-primary font-outfit border-l-4 border-primary pl-4"
                        >
                            {skills.technical.title}
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            {skills.technical.categories.map((category: any, index: number) => {
                                const isOpen = openCategory === category.name;
                                return (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-secondary/10 rounded-2xl border border-foreground/5 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "ring-2 ring-primary/20 shadow-lg" : ""}`}
                                    >
                                        <button
                                            onClick={() => setOpenCategory(isOpen ? null : category.name)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-foreground/5 transition-colors"
                                        >
                                            <h4 className="text-xl font-bold text-foreground flex items-center gap-3">
                                                <span className="text-primary">
                                                    {getSkillIcon(category.name)}
                                                </span>
                                                {category.name}
                                                <span className="text-xs bg-background px-2 py-1 rounded-full border border-foreground/10 text-muted-foreground font-normal">
                                                    {category.items.length}
                                                </span>
                                            </h4>
                                            <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        <motion.div
                                            initial={false}
                                            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 flex flex-wrap gap-2">
                                                {category.items.map((skill: any, skillIndex: number) => {
                                                    const isLink = typeof skill === 'object' && skill.link;
                                                    const content = typeof skill === 'object' ? skill.name : skill;

                                                    const ItemWrapper = isLink ? motion.a : motion.span;
                                                    const props = isLink ? { href: skill.link, target: "_blank", rel: "noopener noreferrer" } : {};

                                                    return (
                                                        <ItemWrapper
                                                            key={skillIndex}
                                                            {...props}
                                                            className={`text-sm bg-background px-3 py-1.5 rounded-full border border-foreground/10 text-secondary-foreground font-medium hover:bg-primary/5 hover:border-primary/30 transition-all ${isLink ? "cursor-pointer hover:text-primary hover:scale-105" : "cursor-default"}`}
                                                        >
                                                            {content}
                                                        </ItemWrapper>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
