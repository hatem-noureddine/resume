"use client";

import { useState, useEffect, useCallback, TouchEvent, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ServiceItem } from "@/locales/types";


/**
 * Services Section Component
 * Displays a grid of services offered, dynamically rendering icons based on data configuration.
 */

const MobileServiceCard = ({ service, prefersReducedMotion }: { service: ServiceItem, prefersReducedMotion: boolean }) => {
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
            className="group p-6 md:p-8 bg-background border border-foreground/5 rounded-2xl shadow-lg shadow-primary/5 mx-4 flex flex-col items-center text-center min-h-[300px] justify-between"
        >
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 md:mb-6 inline-flex p-3 md:p-4 rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon size={32} className="md:w-10 md:h-10" />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-outfit mb-2 md:mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                </h3>
                <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
                    {service.description}
                </p>
            </div>
            <Link
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
            >
                Get Started <ArrowRight size={16} />
            </Link>
        </motion.div>
    );
};

export function Services() {
    const { t } = useLanguage();
    const { services } = t;
    const [currentIndex, setCurrentIndex] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();
    const carouselRef = useRef<HTMLDivElement>(null);

    // Touch swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;
    const totalItems = services.items.length;
    const progress = ((currentIndex + 1) / totalItems) * 100;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [totalItems]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [totalItems]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    }, [prevSlide, nextSlide]);

    // Focus management for keyboard navigation
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.focus();
        }
    }, []);

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

                {/* Mobile Carousel with Swipe and Keyboard */}
                <div
                    ref={carouselRef}
                    className="md:hidden relative outline-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="region"
                    aria-label="Services carousel"
                    aria-roledescription="carousel"
                >
                    {/* Progress Bar */}
                    <div className="mb-6 px-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-secondary-foreground">
                                {currentIndex + 1} / {totalItems}
                            </span>
                            <span className="text-xs text-secondary-foreground">
                                Use ← → keys to navigate
                            </span>
                        </div>
                        <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <MobileServiceCard
                                service={services.items[currentIndex]}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-6">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            className="rounded-full w-10 h-10"
                            aria-label="Previous service"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex gap-2">
                            {services.items.map((item: ServiceItem, index: number) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                        ? "bg-primary scale-125"
                                        : "bg-foreground/20 hover:bg-foreground/40"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={index === currentIndex ? "true" : "false"}
                                />
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextSlide}
                            className="rounded-full w-10 h-10"
                            aria-label="Next service"
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    {/* Swipe hint for mobile */}
                    <p className="text-center text-xs text-secondary-foreground mt-4 opacity-60">
                        Swipe or use arrow keys to navigate
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
                                className="group p-8 bg-background border border-foreground/5 hover:border-primary/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between min-h-[280px]"
                            >
                                <div>
                                    <div className="mb-6 inline-flex p-4 rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-secondary-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                                <Link
                                    href="#contact"
                                    className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                                >
                                    Get Started <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
