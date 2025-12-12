"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";

export function Hero() {
    const { t, language } = useLanguage();

    return (
        <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full -z-10" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
                        {t.hero.title}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6 leading-tight">
                        {t.hero.name}
                    </h1>
                    <p className="text-xl text-secondary-foreground mb-8 max-w-lg leading-relaxed">
                        {t.hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Button variant="default" size="lg" asChild className="group">
                            <Link href="#portfolio">
                                {t.header.nav[2].name} {/* Projects */}
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="group" asChild>
                            <a href={localeMetadata[language].resume} download target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 w-4 h-4 transition-transform group-hover:-translate-y-1" />
                                Download CV
                            </a>
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                        {t.hero.stats.map((stat, index) => (
                            <div key={index}>
                                <h3 className="text-2xl md:text-3xl font-bold font-outfit mb-1">{stat.value}</h3>
                                <p className="text-xs md:text-sm text-secondary-foreground uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-full opacity-20 blur-3xl" />
                        <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/10 bg-secondary/50 backdrop-blur-sm">
                            <Image
                                src="/profile.png"
                                alt={t.hero.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
