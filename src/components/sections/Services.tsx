"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Services Section Component
 * Displays a grid of services offered, dynamically rendering icons based on data configuration.
 */
export function Services() {
    const { t } = useLanguage();
    const { services } = t;

    return (
        <section id="services" className="py-24 bg-secondary/30 relative">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="My Quality Configuration"
                    subtitle="Services"
                    className="mb-16"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
