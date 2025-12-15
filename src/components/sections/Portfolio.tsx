"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

// Mobile detection hook
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}

// Reduced motion hook
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return prefersReducedMotion;
}

interface PortfolioLocale {
    title: string;
    viewAll?: string;
    allCategory?: string;
    items: {
        id: number;
        title: string;
        category: string;
        image: string;
        link: string;
    }[];
}

export function Portfolio() {
    const { t } = useLanguage();
    const portfolio = t.portfolio as PortfolioLocale;
    const portfolioData = portfolio.items;
    const [filter, setFilter] = useState("All");

    const isMobile = useIsMobile();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Get localized text with fallbacks
    const viewAllText = portfolio.viewAll || "View All Projects";
    const allCategoryText = portfolio.allCategory || "All";

    const categories = [allCategoryText, ...Array.from(new Set(portfolioData.map((item) => item.category)))];

    const filteredProjects = filter === allCategoryText
        ? portfolioData
        : portfolioData.filter((item) => item.category === filter);

    if (!portfolioData || portfolioData.length === 0) {
        return null;
    }

    // Show only first 3 projects on home page
    const displayProjects = filteredProjects.slice(0, 3);

    // Animation variants with reduced motion support
    const cardVariants = prefersReducedMotion
        ? { initial: {}, animate: {}, exit: {} }
        : {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
        };

    return (
        <section id="portfolio" className="py-12 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={portfolio.title}
                    subtitle="Portfolio"
                    className="mb-8 md:mb-12"
                />

                {/* Filters - horizontal scroll on mobile, responsive sizing */}
                <div className="mb-10 md:mb-16 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 md:gap-4 justify-start md:justify-center min-w-max md:min-w-0 px-1 md:px-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${filter === cat
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid - responsive gaps and aspect ratios */}
                <motion.div
                    layout={!prefersReducedMotion}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12"
                >
                    <AnimatePresence>
                        {displayProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout={!prefersReducedMotion}
                                variants={cardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                                className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-video md:aspect-4/3 bg-secondary/20 shadow-card ken-burns"
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className={`object-cover transition-transform duration-500 ${isMobile ? '' : 'group-hover:scale-110'}`}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                {/* Overlay - always visible on mobile, hover on desktop */}
                                <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex items-end p-4 md:p-6 transition-opacity duration-300 ${isMobile
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                    <div className={`w-full transition-transform duration-300 ${isMobile
                                        ? ''
                                        : 'translate-y-4 group-hover:translate-y-0'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-300 text-xs md:text-sm mb-0.5 md:mb-1">{project.category}</p>
                                                <h3 className="text-base md:text-xl font-bold font-outfit text-white">{project.title}</h3>
                                            </div>
                                            <a
                                                href={project.link}
                                                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors shrink-0"
                                                aria-label={`View ${project.title}`}
                                            >
                                                <ArrowUpRight size={isMobile ? 16 : 20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-8 md:mt-12 flex justify-center">
                    <Button variant="secondary" size="lg" asChild className="rounded-full px-6 md:px-8 border border-foreground/10 hover:border-primary/30">
                        <Link href="/portfolio" className="inline-flex items-center gap-2">
                            {viewAllText} <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
