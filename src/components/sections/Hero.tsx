"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Download, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";
import { ClientCarousel } from "@/components/sections/ClientCarousel";
import { TechCarousel } from "@/components/sections/TechCarousel";

const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2.67-5-2.67" /></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export function Hero() {
    const { t, language } = useLanguage();

    const socialLinks = [
        { icon: GithubIcon, href: "https://github.com" },
        { icon: LinkedinIcon, href: "https://linkedin.com" },
        { icon: TwitterIcon, href: "https://twitter.com" },
        { icon: Mail, href: "mailto:contact@example.com" },
    ];

    return (
        <section className="min-h-screen flex flex-col pt-20 relative overflow-hidden bg-background">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10 opacity-50 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full -z-10 opacity-50 animate-pulse-slow delay-75" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center flex-grow py-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-outfit mb-6 leading-[1.1]">
                        <span className="block text-foreground">{t.hero.name.split(' ')[0]}</span>
                        <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">
                            {t.hero.name.split(' ').slice(1).join(' ')}
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-lg md:text-xl text-secondary-foreground mb-8 text-justify leading-relaxed"
                    >
                        {t.hero.description}
                    </motion.p>



                    <div className="grid grid-cols-3 gap-6 border-t border-foreground/10 pt-8 mb-8">
                        {t.hero.stats.map((stat, index) => (
                            <div key={index}>
                                <h3 className="text-2xl md:text-3xl font-bold font-outfit mb-1 text-foreground">{stat.value}</h3>
                                <p className="text-xs md:text-sm text-secondary-foreground uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-8 text-secondary-foreground"
                    >
                        <Button variant="outline" size="lg" asChild className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6">
                            <a href={localeMetadata[language].resume} download target="_blank" rel="noopener noreferrer">
                                <Download size={18} />
                                <span>Download CV</span>
                            </a>
                        </Button>

                        <div className="flex items-center gap-6">
                            <span className="text-sm uppercase tracking-widest opacity-60">Follow Me</span>
                            <div className="w-12 h-[1px] bg-secondary-foreground/30" />
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        className="hover:text-primary transition-colors hover:scale-110 transform duration-200"
                                    >
                                        <social.icon size={20} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="relative flex justify-center lg:justify-end">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px]"
                    >
                        {/* Orbiting elements */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full blur-[2px]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full blur-[2px]" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full blur-[1px]" />
                        </div>

                        <div className="absolute inset-4 border border-foreground/5 rounded-full animate-spin-reverse-slower" />
                        <div className="absolute inset-12 border border-foreground/10 rounded-full animate-spin-slow" />

                        {/* Main Image Container */}
                        <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-foreground/10 bg-secondary/30 backdrop-blur-sm z-10 shadow-2xl shadow-primary/20">
                            <div className="relative w-full h-full">
                                <Image
                                    src={t.hero.image}
                                    alt={t.hero.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                    unoptimized // Fix for GitHub Pages image loading issues
                                />
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -right-4 top-20 z-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-foreground/10 shadow-xl hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="text-xl font-bold">50+</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary-foreground">Projects</p>
                                    <p className="text-sm font-bold">Completed</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="absolute -left-4 bottom-20 z-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-foreground/10 shadow-xl hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <span className="text-xl font-bold">12</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary-foreground">Years</p>
                                    <p className="text-sm font-bold">Experience</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            {/* Carousels - Integrated into flow with premium backdrop */}
            <div className="w-full mt-auto relative z-20 flex flex-col gap-0 border-t border-foreground/5 bg-background/30 backdrop-blur-sm">
                <TechCarousel />
                <div className="w-full h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
                <ClientCarousel />
            </div>
        </section>
    );
}
