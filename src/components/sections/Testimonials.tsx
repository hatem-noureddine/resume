"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface Testimonial {
    author: string;
    role: string;
    company: string;
    content: string;
    avatar?: string;
    rating: number;
    language: string;
}

export function Testimonials({ items }: Readonly<{ items: Testimonial[] }>) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Auto-play
    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    if (!items || items.length === 0) return null;

    const current = items[currentIndex];

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    return (
        <section className="py-24 relative overflow-hidden bg-background/50">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <SectionHeading
                    title="Testimonials"
                    subtitle="What people say about working with me"
                    align="center"
                />

                <div className="max-w-4xl mx-auto mt-16 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="glass-card p-8 md:p-12 rounded-[2.5rem] relative"
                        >
                            <Quote className="absolute top-8 left-8 text-primary/10 w-16 h-16 -z-10" />

                            <div className="flex flex-col items-center text-center">
                                {/* Stars */}
                                <div className="flex gap-1 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className={star <= current.rating ? "fill-primary text-primary" : "text-foreground/10"}
                                        />
                                    ))}
                                </div>

                                <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-10 italic">
                                    &ldquo;{current.content}&rdquo;
                                </p>

                                <div className="flex flex-col items-center">
                                    {current.avatar ? (
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4 border-2 border-primary/20 overflow-hidden relative">
                                            {current.avatar.startsWith('http') ? (
                                                <Image src={current.avatar} alt={current.author} fill className="object-cover" />
                                            ) : (
                                                <span>{current.avatar}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4 border-2 border-primary/20">
                                            {current.author.charAt(0)}
                                        </div>
                                    )}
                                    <h4 className="text-lg font-bold font-outfit text-foreground">{current.author}</h4>
                                    <p className="text-sm text-secondary-foreground font-medium">
                                        {current.role} @ <span className="text-primary">{current.company}</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    {items.length > 1 && (
                        <>
                            <div className="flex justify-center gap-4 mt-12">
                                <button
                                    onClick={prev}
                                    className="p-3 rounded-full bg-secondary/50 border border-foreground/5 hover:bg-primary hover:text-white transition-all duration-300"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={next}
                                    className="p-3 rounded-full bg-secondary/50 border border-foreground/5 hover:bg-primary hover:text-white transition-all duration-300"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Indicators */}
                            <div className="flex justify-center gap-2 mt-8">
                                {items.map((item, i) => (
                                    <button
                                        key={item.author}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-primary" : "w-2 bg-foreground/10"
                                            }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
