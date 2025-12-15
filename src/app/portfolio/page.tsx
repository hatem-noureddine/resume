"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import rawPortfolioData from "@/data/portfolio.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

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

export default function PortfolioPage() {
    const { t } = useLanguage();
    const { portfolio } = t;
    const [filter, setFilter] = useState("All");
    const prefersReducedMotion = usePrefersReducedMotion();
    const isMobile = useIsMobile();

    const categories = ["All", ...Array.from(new Set(rawPortfolioData.map((item) => item.category)))];

    const filteredProjects = filter === "All"
        ? rawPortfolioData
        : rawPortfolioData.filter((item) => item.category === filter);

    // Get project count per category
    const getCategoryCount = (category: string) => {
        if (category === "All") return rawPortfolioData.length;
        return rawPortfolioData.filter((item) => item.category === category).length;
    };

    const animationProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 }
        };

    const cardAnimationProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
            transition: { duration: 0.3 }
        };

    return (
        <main className="min-h-screen pb-20 bg-background">
            <Header />

            <section className="pt-28 pb-12 container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-secondary-foreground mb-8">
                    <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Home size={14} />
                        {portfolio.breadcrumb?.home || "Home"}
                    </Link>
                    <ChevronRight size={14} className="text-muted-foreground" />
                    <span className="text-foreground font-medium">{portfolio.breadcrumb?.portfolio || "Portfolio"}</span>
                </nav>

                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-8 hover:bg-transparent pl-0 hover:text-primary">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft size={20} />
                            {portfolio.backToHome || "Back to Home"}
                        </Link>
                    </Button>

                    <motion.div
                        {...animationProps}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-6">
                            {portfolio.pageTitle || "All Projects"}
                        </h1>
                        <p className="text-secondary-foreground max-w-2xl mx-auto">
                            {portfolio.pageDescription || "Explore my complete portfolio of projects across development, design, and mobile apps."}
                        </p>
                    </motion.div>
                </div>

                {/* Results count */}
                <div className="text-sm text-secondary-foreground mb-6 text-center">
                    {portfolio.showing || "Showing"} <span className="font-medium text-foreground">{filteredProjects.length}</span> {portfolio.projects || "projects"}
                    {filter !== "All" && (
                        <span> {portfolio.inCategory || "in"} <span className="text-primary font-medium">{filter}</span></span>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${filter === cat
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-foreground border border-foreground/5"
                                }`}
                        >
                            {cat === "All" ? (portfolio.allCategory || "All") : cat}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === cat ? "bg-white/20" : "bg-foreground/10"}`}>
                                {getCategoryCount(cat)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-foreground/5 border-dashed">
                        <h3 className="text-xl font-bold mb-2">{portfolio.noProjects || "No projects found"}</h3>
                        <p className="text-muted-foreground mb-6">{portfolio.tryDifferentFilter || "Try selecting a different category."}</p>
                        <button
                            onClick={() => setFilter("All")}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors font-medium"
                        >
                            {portfolio.showAll || "Show All Projects"}
                        </button>
                    </div>
                ) : (
                    /* Grid */
                    <motion.div
                        layout={!prefersReducedMotion}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout={!prefersReducedMotion}
                                    {...cardAnimationProps}
                                    className={`group relative overflow-hidden rounded-2xl aspect-4/3 bg-secondary/20 ${isMobile ? '' : ''}`}
                                >
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Overlay - always visible on mobile */}
                                    <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex items-end p-6 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}>
                                        <div className={`w-full transition-transform duration-300 ${isMobile ? '' : 'translate-y-4 group-hover:translate-y-0'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-300 text-sm mb-1">{project.category}</p>
                                                    <h3 className="text-xl font-bold font-outfit text-white">{project.title}</h3>
                                                </div>
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                                                    aria-label={`${portfolio.viewProject || "View"} ${project.title}`}
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
                )}
            </section>

            <Footer />
        </main>
    );
}
