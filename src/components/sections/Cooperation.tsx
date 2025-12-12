"use client";

import { motion } from "framer-motion";
import { Handshake, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Cooperation() {
    const { t } = useLanguage();
    const { cooperation } = t;

    return (
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-secondary/20 to-transparent">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            {cooperation.title}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            {cooperation.description}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Freelance</h3>
                                    <p className="text-muted-foreground">{cooperation.freelanceDesc}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Handshake className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{cooperation.partnership}</h3>
                                    <p className="text-muted-foreground">{cooperation.partnershipDesc}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary hover:bg-primary-dark transition-colors font-medium text-white shadow-lg shadow-primary/25"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {cooperation.contactBtn}
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="relative bg-secondary/80 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-background/50 p-6 rounded-xl text-center border border-white/5">
                                    <div className="text-3xl font-bold text-primary mb-1">50+</div>
                                    <div className="text-sm text-muted-foreground">{cooperation.stats.projects}</div>
                                </div>
                                <div className="bg-background/50 p-6 rounded-xl text-center border border-white/5">
                                    <div className="text-3xl font-bold text-primary mb-1">20+</div>
                                    <div className="text-sm text-muted-foreground">{cooperation.stats.clients}</div>
                                </div>
                                <div className="bg-background/50 p-6 rounded-xl text-center border border-white/5">
                                    <div className="text-3xl font-bold text-primary mb-1">5+</div>
                                    <div className="text-sm text-muted-foreground">{cooperation.stats.experience}</div>
                                </div>
                                <div className="bg-background/50 p-6 rounded-xl text-center border border-white/5">
                                    <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                    <div className="text-sm text-muted-foreground">{cooperation.stats.support}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
