"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export function Portfolio() {
    const { t } = useLanguage();
    const portfolioData = t.portfolio.items;
    const [filter, setFilter] = useState("All");

    const categories = ["All", ...Array.from(new Set(portfolioData.map((item) => item.category)))];

    const filteredProjects = filter === "All"
        ? portfolioData
        : portfolioData.filter((item) => item.category === filter);

    if (!portfolioData || portfolioData.length === 0) {
        return null;
    }

    // Show only first 3 projects on home page
    const displayProjects = filteredProjects.slice(0, 3);

    return (
        <section id="portfolio" className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={t.portfolio.title}
                    subtitle="Portfolio"
                    className="mb-12"
                />

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                ? "bg-primary text-white"
                                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    <AnimatePresence>
                        {displayProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-secondary/20"
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-300 text-sm mb-1">{project.category}</p>
                                                <h3 className="text-xl font-bold font-outfit text-white">{project.title}</h3>
                                            </div>
                                            <a
                                                href={project.link}
                                                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                                            >
                                                <ArrowUpRight size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-12 flex justify-center">
                    <Button variant="secondary" size="lg" asChild className="rounded-full px-8 border border-foreground/10 hover:border-primary/30">
                        <Link href="/portfolio" className="inline-flex items-center gap-2">
                            View All Projects <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
