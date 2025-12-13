"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function Experience() {
    const { t } = useLanguage();
    const { experience } = t;

    // Sort items by startDate descending
    // Using any for item to avoid type conflicts if interface isn't updated yet, 
    // assuming data is present as per recent updates.
    const sortedItems = [...experience.items].sort((a: any, b: any) => {
        const dateA = new Date(a.startDate || "1900-01").getTime();
        const dateB = new Date(b.startDate || "1900-01").getTime();
        return dateB - dateA;
    });

    const [activeId, setActiveId] = useState(sortedItems[0].id);

    // Find active experience data
    const activeExperience = sortedItems.find((item) => item.id === activeId) || sortedItems[0];

    return (
        <section id="experience" className="py-24 relative bg-secondary/10">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="My Experience Resume"
                    subtitle="Experience"
                    className="mb-16"
                />

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Left Column: List/Tabs */}
                    <div className="md:w-1/3 flex flex-col gap-4">
                        {sortedItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveId(item.id)}
                                className={cn(
                                    "text-left p-6 rounded-xl transition-all duration-300 border",
                                    activeId === item.id
                                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                                        : "bg-background text-secondary-foreground border-foreground/5 hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <span className="block text-lg font-bold font-outfit mb-1">{item.period}</span>
                                <span className={cn("block text-sm", activeId === item.id ? "text-white/80" : "text-secondary-foreground/60")}>
                                    {item.company}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:w-2/3 flex flex-col relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeExperience.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-background border border-foreground/5 p-8 md:p-10 rounded-2xl relative overflow-hidden h-full flex flex-col justify-center"
                            >
                                {/* Background Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />

                                <div className="relative z-10 w-full">
                                    <div className="flex flex-col md:flex-row gap-6 md:items-start mb-8">
                                        {/* Logo Placeholder */}
                                        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-foreground/10 text-2xl font-bold text-secondary-foreground shrink-0 uppercase">
                                            {activeExperience.company.charAt(0)}
                                        </div>

                                        <div>
                                            <h3 className="text-3xl font-bold font-outfit text-foreground mb-2">
                                                {activeExperience.role}
                                            </h3>
                                            <div className="flex items-center gap-3 text-primary font-medium">
                                                <span className="text-lg">{activeExperience.company}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                <span className="flex items-center gap-2 text-sm text-secondary-foreground">
                                                    <Calendar size={14} /> {activeExperience.period}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm uppercase tracking-wider text-secondary-foreground/60 font-bold">Role Description</h4>
                                        <p className="text-lg text-secondary-foreground leading-relaxed">
                                            {activeExperience.description}
                                        </p>
                                        {/* Fake Points for demo since data only has one string description */}
                                        <ul className="space-y-2 mt-4 text-secondary-foreground/80 list-disc list-inside">
                                            <li>Collaborated with cross-functional teams to deliver high-quality software.</li>
                                            <li>Implemented robust and scalable frontend solutions using modern frameworks.</li>
                                            <li>Participated in code reviews and mentored junior developers.</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
