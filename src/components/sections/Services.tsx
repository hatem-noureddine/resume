"use client";

import { useState, useEffect, useCallback, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

/**
 * Services Section Component
 * Displays a grid of services offered, dynamically rendering icons based on data configuration.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MobileServiceCard = ({ service, prefersReducedMotion }: { service: any, prefersReducedMotion: boolean }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code;

    const animationProps = prefersReducedMotion
        ? { initial: {}, animate: {}, exit: {} }
        : {
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -50 }
        };

    return (
        <motion.div
            key={service.id}
            {...animationProps}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="group p-6 md:p-8 bg-background border border-foreground/5 rounded-2xl shadow-lg shadow-primary/5 mx-4 flex flex-col items-center text-center min-h-[280px] justify-center"
        >
            <div className="mb-4 md:mb-6 inline-flex p-3 md:p-4 rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-lg md:text-xl font-bold font-outfit mb-2 md:mb-3 group-hover:text-primary transition-colors">
                {service.title}
            </h3>
            <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
                {service.description}
            </p>
        </motion.div>
    );
};

export function Services() {
    const { t } = useLanguage();
    const { services } = t;
    const [currentIndex, setCurrentIndex] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Touch swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % services.items.length);
    }, [services.items.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + services.items.length) % services.items.length);
    }, [services.items.length]);

    // Touch handlers for swipe
    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <section id="services" className="py-16 md:py-24 bg-secondary/30 relative">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={t.services.title}
                    subtitle="Services"
                    className="mb-10 md:mb-16"
                />

                {/* Mobile Carousel with Swipe */}
                <div
                    className="md:hidden relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <MobileServiceCard
                                service={services.items[currentIndex]}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-6">
                        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full w-10 h-10">
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex gap-2">
                            {services.items.map((_: unknown, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-foreground/20"}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full w-10 h-10">
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    {/* Swipe hint for mobile */}
                    <p className="text-center text-xs text-secondary-foreground mt-4 opacity-60">
                        Swipe to navigate
                    </p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.items.map((service: { id: number; title: string; description: string; icon: string }, index: number) => {
                        // Dynamic icon lookup
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code;

                        const animationProps = prefersReducedMotion
                            ? {}
                            : {
                                initial: { opacity: 0, y: 20 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true },
                                transition: { duration: 0.5, delay: index * 0.1 }
                            };

                        return (
                            <motion.div
                                key={service.id}
                                {...animationProps}
                                className="group p-8 bg-background border border-foreground/5 hover:border-primary/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="mb-6 inline-flex p-4 rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-secondary-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
