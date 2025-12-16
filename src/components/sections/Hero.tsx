"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { BlurImage } from "@/components/ui/BlurImage";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Download, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";
import { SITE_CONFIG } from "@/lib/constants";

const ClientCarousel = dynamic(() => import("@/components/sections/ClientCarousel").then(mod => mod.ClientCarousel), { ssr: false });
const TechCarousel = dynamic(() => import("@/components/sections/TechCarousel").then(mod => mod.TechCarousel), { ssr: false });

const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2.67-5-2.67" /></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

// Custom hook for mobile detection
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}

// Typing animation hook
function useTypingAnimation(texts: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!texts || texts.length === 0) return;

        const currentText = texts[currentIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, currentIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseTime]);

    return displayText;
}

interface HeroLocale {
    name: string;
    title: string;
    roles?: string[];
    description: string;
    downloadCV?: string;
    followMe?: string;
    availableForHire?: string;
    scrollDown?: string;
    readMore?: string;
    readLess?: string;
    stats: { value: string; label: string }[];
    floatingCards?: {
        projects: { value: string; label: string; sublabel: string };
        experience: { value: string; label: string; sublabel: string };
    };
    image: string;
}

export function Hero() {
    const { t, language } = useLanguage();
    const hero = t.hero as HeroLocale;
    const stats = (hero && Array.isArray(hero.stats)) ? hero.stats : [];
    const roles = hero.roles || ["Developer"];

    // Mobile detection for performance optimizations
    const isMobile = useIsMobile();

    // State for expandable description on mobile
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Typing animation for roles
    const typedRole = useTypingAnimation(roles, 80, 40, 2500);

    // Parallax effect - only on desktop for performance
    // Tracks scroll progress relative to the section
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Transform scroll progress into vertical movement
    // image moves faster (100px) than text (50px) for depth effect
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);

    // Get localized text with fallbacks
    const downloadCVText = hero.downloadCV || "Download CV";
    const followMeText = hero.followMe || "Follow Me";
    const scrollDownText = hero.scrollDown || "Scroll to explore";
    const readMoreText = hero.readMore || "Read more";
    const readLessText = hero.readLess || "Read less";
    const floatingCards = hero.floatingCards || {
        projects: { value: "50+", label: "Projects", sublabel: "Completed" },
        experience: { value: "12", label: "Years", sublabel: "Experience" }
    };

    const socialLinks = [
        { icon: GithubIcon, href: SITE_CONFIG.links.github },
        { icon: LinkedinIcon, href: SITE_CONFIG.links.linkedin },
        { icon: TwitterIcon, href: SITE_CONFIG.links.twitter },
        { icon: Mail, href: `mailto:${SITE_CONFIG.email}` },
    ];

    const scrollToContent = () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section ref={sectionRef} className="min-h-screen flex flex-col pt-20 relative overflow-hidden bg-background">
            <AnimatedBackground />

            <div className="container mx-auto px-4 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center grow py-8 lg:py-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={isMobile ? undefined : { y: textY }}
                    className="relative z-10"
                >
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold font-outfit mb-4 leading-[1.1] text-center lg:text-left">
                        <span className="block text-foreground">{hero.name.split(' ')[0]}</span>
                        <span className="block text-gradient">
                            {hero.name.split(' ').slice(1).join(' ')}
                        </span>
                    </h1>

                    {/* Typing Animation Role */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="h-8 md:h-10 mb-4 text-center lg:text-left"
                    >
                        <span className="text-lg md:text-2xl text-primary font-medium">
                            {typedRole}
                            <span className="animate-pulse">|</span>
                        </span>
                    </motion.div>

                    {/* Description with expandable functionality on mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-6 md:mb-8"
                    >
                        <p className={`text-base md:text-xl text-secondary-foreground text-left md:text-justify leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3 md:line-clamp-none' : ''
                            }`}>
                            {hero.description}
                        </p>
                        {/* Read more/less button - only visible on mobile when text is long */}
                        {hero.description && hero.description.length > 150 && (
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="md:hidden mt-2 text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                            >
                                {isDescriptionExpanded ? (
                                    <>
                                        {readLessText}
                                        <ChevronUp size={14} />
                                    </>
                                ) : (
                                    <>
                                        {readMoreText}
                                        <ChevronDown size={14} />
                                    </>
                                )}
                            </button>
                        )}
                    </motion.div>

                    {/* Stats Grid - improved mobile readability */}
                    <div className="grid grid-cols-3 gap-3 md:gap-6 border-t border-foreground/10 pt-5 md:pt-8 mb-6 md:mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="text-center lg:text-left"
                            >
                                <h3 className="text-2xl md:text-3xl font-bold font-outfit mb-1 text-foreground">{stat.value}</h3>
                                <p className="text-xs md:text-sm text-secondary-foreground uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA & Social Links - improved mobile layout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col items-center lg:flex-row lg:items-center gap-6 md:gap-8 text-secondary-foreground"
                    >
                        <Button variant="outline" size="lg" asChild className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6 w-full sm:w-auto">
                            <a href={localeMetadata[language].resume} download target="_blank" rel="noopener noreferrer">
                                <Download size={18} />
                                <span>{downloadCVText}</span>
                            </a>
                        </Button>

                        <div className="flex items-center gap-4 md:gap-6">
                            <span className="text-xs md:text-sm uppercase tracking-widest opacity-60 hidden sm:inline">{followMeText}</span>
                            <div className="w-8 md:w-12 h-px bg-secondary-foreground/30 hidden sm:block" />
                            <div className="flex gap-3 md:gap-4">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        className="p-2 rounded-full hover:bg-foreground/5 hover:text-primary transition-colors hover:scale-110 transform duration-200"
                                    >
                                        <social.icon size={20} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Image Section with floating cards */}
                <motion.div
                    style={isMobile ? undefined : { y: imageY }}
                    className="relative flex justify-center lg:justify-end mt-4 lg:mt-0 w-full max-w-[320px] md:max-w-[420px] lg:max-w-[500px] aspect-square mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[500px] md:h-[500px]"
                    >
                        {/* Orbiting elements - simplified on mobile */}
                        <div className={`absolute inset-0 ${isMobile ? '' : 'animate-spin-slow'}`}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 md:w-4 h-3 md:h-4 bg-primary rounded-full blur-[2px]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-purple-500 rounded-full blur-[2px]" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full blur-[1px]" />
                        </div>

                        <div className={`absolute inset-4 border border-foreground/5 rounded-full ${isMobile ? '' : 'animate-spin-reverse-slower'}`} />
                        <div className={`absolute inset-12 border border-foreground/10 rounded-full ${isMobile ? '' : 'animate-spin-slow'}`} />

                        {/* Main Image Container */}
                        <div className="absolute inset-6 sm:inset-8 rounded-full overflow-hidden border-2 border-foreground/10 bg-secondary/30 backdrop-blur-sm z-10 shadow-2xl shadow-primary/20">
                            <div className="relative w-full h-full">
                                <BlurImage
                                    src={hero.image}
                                    alt={hero.name}
                                    fill
                                    className="object-cover hover:scale-105"
                                    sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, 500px"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Floating Cards - improved positioning to prevent clipping */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute right-0 sm:-right-2 md:-right-4 top-8 sm:top-12 md:top-20 z-20 glass-card p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="text-xs sm:text-sm md:text-xl font-bold">{floatingCards.projects.value}</span>
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] md:text-xs text-secondary-foreground">{floatingCards.projects.label}</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm font-bold">{floatingCards.projects.sublabel}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="absolute left-0 sm:-left-2 md:-left-4 bottom-8 sm:bottom-12 md:bottom-20 z-20 glass-card p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <span className="text-xs sm:text-sm md:text-xl font-bold">{floatingCards.experience.value}</span>
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] md:text-xs text-secondary-foreground">{floatingCards.experience.label}</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm font-bold">{floatingCards.experience.sublabel}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator - hidden on small screens, responsive positioning */}
            <motion.button
                onClick={scrollToContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="hidden sm:flex absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-secondary-foreground/60 hover:text-primary transition-colors cursor-pointer z-30 group"
                aria-label={scrollDownText}
            >
                {/* Mouse Icon Animation */}
                <div className="w-[30px] h-[50px] rounded-[15px] border-2 border-current flex justify-center p-2 box-border opacity-70 group-hover:opacity-100 transition-opacity">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 bg-current rounded-full mb-1"
                    />
                </div>
                {/* Arrow below mouse */}
                <motion.div
                    animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                    }}
                >
                    <ChevronDown size={20} className="stroke-3" />
                </motion.div>
            </motion.button>

            {/* Carousels */}
            <div className="w-full mt-auto relative z-20 flex flex-col gap-0 border-t border-foreground/5 bg-background/30 backdrop-blur-sm">
                <TechCarousel />
                <div className="w-full h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
                <ClientCarousel />
            </div>
        </section >
    );
}
