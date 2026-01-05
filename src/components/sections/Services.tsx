"use client";

import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { useFeatureFlags } from "@/context/FeatureFlags";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSwipe } from "@/hooks/useSwipe";
import type { ServiceItem } from "@/locales/types";


/**
 * FlipCard Component
 * Implements a 3D flip effect to show service details without layout shifts.
 */
const FlipCard = ({
    service,
    prefersReducedMotion,
    className,
    cardHeight
}: {
    service: ServiceItem,
    prefersReducedMotion: boolean,
    className?: string,
    cardHeight?: number
}) => {
    const { t } = useLanguage();
    const [isFlipped, setIsFlipped] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`group perspective-1000 w-full h-full ${className}`}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                style={{
                    transformStyle: "preserve-3d",
                    height: cardHeight ? `${cardHeight}px` : "100%",
                    minHeight: "420px"
                }}
                className="relative w-full"
            >
                {/* Front Face */}
                <button
                    onClick={handleFlip}
                    style={{ backfaceVisibility: "hidden" }}
                    className="w-full h-full p-8 bg-background border border-foreground/5 rounded-2xl shadow-lg shadow-primary/5 flex flex-col items-center text-center justify-between transition-all hover:border-primary/30 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`${t.services.showMore} for ${service.title}`}
                >
                    <div className="flex flex-col items-center text-center w-full">
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

                    <div className="mt-6 p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Plus size={20} />
                    </div>
                </button>

                {/* Back Face */}
                <button
                    onClick={handleFlip}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        position: "absolute",
                        top: 0,
                        left: 0
                    }}
                    className="w-full h-full p-6 md:p-8 bg-primary rounded-2xl shadow-lg flex flex-col items-center text-center justify-between text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={`${t.services.showLess} for ${service.title}`}
                >
                    <div className="flex flex-col items-center text-center w-full">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-white/20 text-white">
                            <Icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold font-outfit mb-3">
                            {service.title}
                        </h3>
                        <p className="text-sm font-light leading-relaxed italic opacity-90">
                            {service.longDescription || service.description}
                        </p>
                    </div>

                    <div className="mt-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all">
                        <Minus size={20} />
                    </div>
                </button>
            </motion.div>
        </div>
    );
};

/**
 * Services Section Component
 * Displays a grid of services offered with 3D flip cards.
 */
export function Services() {
    const { t } = useLanguage();
    const { isEnabled } = useFeatureFlags();
    const { services } = t;

    const [maxHeight, setMaxHeight] = useState<number>(0);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const totalItems = services.items.length;
    const progress = ((currentIndex + 1) / totalItems) * 100;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [totalItems]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [totalItems]);

    useLayoutEffect(() => {
        const updateHeight = () => {
            const heights = cardRefs.current
                .filter(ref => ref !== null)
                .map(ref => {
                    // Reset height to auto to measure natural content height
                    const inner = ref?.firstElementChild as HTMLElement;
                    if (inner) {
                        const originalHeight = inner.style.height;
                        inner.style.height = 'auto';
                        const height = inner.scrollHeight;
                        inner.style.height = originalHeight;
                        return height;
                    }
                    return 0;
                });

            if (heights.length > 0) {
                const max = Math.max(...heights);
                if (max > 0) {
                    setMaxHeight(max);
                }
            }
        };

        // Initial measurement
        const timeoutId = setTimeout(updateHeight, 150);

        window.addEventListener('resize', updateHeight);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
        };
    }, [services.items]);


    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }, [nextSlide, prevSlide]);

    // Touch handlers for swipe
    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
        onSwipeLeft: nextSlide,
        onSwipeRight: prevSlide,
        minSwipeDistance: 50
    });

    if (!isEnabled('showServices')) {
        return null;
    }

    return (
        <section
            id="services"
            className="py-16 md:py-24 bg-secondary/30 relative"
            aria-labelledby="services-title"
        >
            <div className="container mx-auto px-4">
                <SectionHeading
                    id="services-title"
                    title={t.services.title}
                    subtitle="Services"
                    className="mb-10 md:mb-16"
                />

                <div
                    className="md:hidden relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    aria-label="Services carousel"
                    role="region"
                >
                    {/* Progress Bar */}
                    <div className="mb-8 px-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-secondary-foreground">
                                {currentIndex + 1} / {totalItems}
                            </span>
                            <span className="text-xs text-secondary-foreground opacity-50">
                                Swipe to see more
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
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="px-4"
                            >
                                <div
                                    ref={(el) => { cardRefs.current[currentIndex] = el; }}
                                    className="h-full"
                                >
                                    <FlipCard
                                        service={services.items[currentIndex]}
                                        prefersReducedMotion={prefersReducedMotion}
                                        cardHeight={maxHeight}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            className="rounded-full w-10 h-10 border-foreground/10 hover:bg-primary hover:text-white"
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
                            className="rounded-full w-10 h-10 border-foreground/10 hover:bg-primary hover:text-white"
                            aria-label="Next service"
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {services.items.map((service: ServiceItem, index: number) => {
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <div
                                    ref={(el) => { cardRefs.current[index] = el; }}
                                    className="h-full"
                                >
                                    <FlipCard
                                        service={service}
                                        prefersReducedMotion={prefersReducedMotion}
                                        cardHeight={maxHeight}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
