"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Services Section Component
 * Displays a grid of services offered, dynamically rendering icons based on data configuration.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MobileServiceCard = ({ service }: { service: any }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code;

    return (
        <motion.div
            key={service.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="group p-8 bg-background border border-foreground/5 rounded-2xl shadow-lg shadow-primary/5 mx-4 flex flex-col items-center text-center h-[350px] justify-center"
        >
            <div className="mb-6 inline-flex p-4 rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={40} />
            </div>
            <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                {service.title}
            </h3>
            <p className="text-secondary-foreground leading-relaxed">
                {service.description}
            </p>
        </motion.div>
    );
};

export function Services() {
    const { t } = useLanguage();
    const { services } = t;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % services.items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + services.items.length) % services.items.length);
    };

    return (
        <section id="services" className="py-24 bg-secondary/30 relative">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={t.services.title}
                    subtitle="Services"
                    className="mb-16"
                />

                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <MobileServiceCard service={services.items[currentIndex]} />
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-8">
                        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex gap-2">
                            {services.items.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-foreground/20"}`}
                                />
                            ))}
                        </div>
                        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.items.map((service, index) => {
                        // Dynamic icon lookup
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
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

