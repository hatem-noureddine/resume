"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Award, Calendar, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { container, fadeInUp } from "@/lib/animations";

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    badge?: string;
    category: "cloud" | "frontend" | "backend" | "ai" | "other";
}

interface CertificationsProps {
    items: Certification[];
}

export function Certifications({ items }: Readonly<CertificationsProps>) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (!items || items.length === 0) return null;

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case "cloud": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "frontend": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
            case "backend": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "ai": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <section id="certifications" className="py-24 bg-background/50">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Certifications & Badges"
                    subtitle="Professional Credentials"
                />

                <motion.div
                    variants={prefersReducedMotion ? {} : container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                >
                    {items.map((cert) => (
                        <motion.div
                            key={cert.name}
                            variants={prefersReducedMotion ? {} : fadeInUp}
                            className="glass-card group p-6 rounded-3xl border border-foreground/5 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
                        >
                            {/* Decorative element */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />

                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center border border-foreground/5 p-2 overflow-hidden shadow-inner">
                                        {cert.badge ? (
                                            <Image
                                                src={cert.badge}
                                                alt={cert.name}
                                                width={60}
                                                height={60}
                                                className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Award className="w-8 h-8 text-primary/40" />
                                        )}
                                    </div>
                                    <span className={`px - 3 py - 1 rounded - full text - [10px] font - bold uppercase tracking - widest border ${getCategoryStyles(cert.category)} `}>
                                        {cert.category}
                                    </span>
                                </div>

                                <div className="grow">
                                    <h3 className="text-xl font-bold font-outfit text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {cert.name}
                                    </h3>
                                    <p className="text-secondary-foreground font-medium mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {cert.issuer}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
                                            <Calendar size={14} className="text-primary/60" />
                                            <span>Issued: {new Date(cert.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                                        </div>
                                        {cert.credentialId && (
                                            <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
                                                <ShieldCheck size={14} className="text-primary/60" />
                                                <span className="truncate">ID: {cert.credentialId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {cert.credentialUrl && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-secondary/50 hover:bg-primary hover:text-white text-foreground text-sm font-bold transition-all duration-300 mt-auto"
                                    >
                                        Verify Credential
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
