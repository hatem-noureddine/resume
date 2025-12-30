"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BlurImage } from "@/components/ui/BlurImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { container } from "@/lib/animations";

// Mobile detection hook
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(globalThis.innerWidth < breakpoint);
        checkMobile();
        globalThis.addEventListener("resize", checkMobile);
        return () => globalThis.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}

interface PortfolioLocale {
    title: string;
    viewAll?: string;
    allCategory?: string;
    viewProject?: string;
    items: {
        id: number | string;
        title: string;
        category: string;
        image: string;
        link: string;
        slug?: string;
    }[];
}

export function Portfolio({ items }: Readonly<{ items?: PortfolioLocale['items'] }>) {
    const { t, direction, language } = useLanguage();
    const portfolio = t.portfolio as PortfolioLocale;
    const isMobile = useIsMobile();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Get localized text with fallbacks
    const viewAllText = portfolio.viewAll || "View All Projects";
    const allCategoryText = portfolio.allCategory || "All";

    const [filter, setFilter] = useState(allCategoryText);

    // Sync filter when language (allCategoryText) changes
    useEffect(() => {
        setFilter(allCategoryText);
    }, [allCategoryText]);

    const portfolioData = items ?? portfolio.items;

    const filteredByLanguage = portfolioData.filter(item => {
        // If it's from Keystatic, it has a language field
        if (item && typeof item === 'object' && 'language' in item) {
            return item.language === language;
        }
        // Fallback for static items or if language field is missing
        return true;
    });

    const categories = [allCategoryText, ...Array.from(new Set(filteredByLanguage.map((item) => item.category)))].filter((value, index, self) => self.indexOf(value) === index);

    const filteredProjects = filter === allCategoryText
        ? filteredByLanguage
        : filteredByLanguage.filter((item) => item.category === filter);

    if (!portfolioData || portfolioData.length === 0) {
        return null;
    }

    // Show only first 3 projects on home page
    const displayProjects = filteredProjects.slice(0, 3);

    // Animation variants with reduced motion support
    const cardVariants = prefersReducedMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            hidden: { opacity: 0, scale: 0.8, x: direction === "rtl" ? 20 : -20 },
            visible: { opacity: 1, scale: 1, x: 0 },
            exit: { opacity: 0, scale: 0.8, x: direction === "rtl" ? -20 : 20 }
        };

    return (
        <section id="portfolio" className="py-12 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={portfolio.title}
                    subtitle="Portfolio"
                    className="mb-8 md:mb-12"
                    id="portfolio-title"
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
                                    } `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid - responsive gaps and aspect ratios */}
                <motion.div
                    layout={!prefersReducedMotion}
                    variants={prefersReducedMotion ? {} : container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12"
                >
                    <AnimatePresence mode="popLayout">
                        {displayProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout={!prefersReducedMotion}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                                className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-video md:aspect-4/3 bg-secondary/20 shadow-card ken-burns"
                            >
                                <BlurImage
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className={`object-cover ${isMobile ? '' : 'group-hover:scale-110'} `}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                {/* Overlay - always visible on mobile, hover on desktop */}
                                <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex items-end p-4 md:p-6 transition-opacity duration-300 ${isMobile
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'
                                    } `}>
                                    <div className={`w-full transition-transform duration-300 ${isMobile
                                        ? ''
                                        : 'translate-y-4 group-hover:translate-y-0'
                                        } `}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-gray-300 text-sm mb-1">{project.category}</p>
                                                <h3 className="text-xl font-bold font-outfit text-white group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                            </div>
                                            <div className="flex gap-2">
                                                {project.slug && (
                                                    <Link
                                                        href={`/portfolio/${project.slug}`}
                                                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors"
                                                        aria-label={`View case study for ${project.title}`}
                                                    >
                                                        <Sparkles size={20} />
                                                    </Link>
                                                )}
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                                                    aria-label={`${portfolio.viewProject || "View"} ${project.title} `}
                                                >
                                                    <ArrowUpRight size={20} />
                                                </a>
                                            </div>
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
            <style dangerouslySetInnerHTML={{
                __html: `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`}} />
        </section>
    );
}
