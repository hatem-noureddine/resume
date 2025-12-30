"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { BlurImage } from "@/components/ui/BlurImage";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Download, Mail, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";
import { SITE_CONFIG } from "@/config/site";
import { track } from "@vercel/analytics";
import { SectionTracker } from "@/components/ui/SectionTracker";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
// scrollMouseAnimation imported dynamically below

// Loading components
const Hero3DLoader = () => null; // Invisible loader for background
const CarouselLoader = () => (
    <div className="w-full h-20 bg-background/5 animate-pulse flex items-center justify-center">
        <div className="w-full max-w-4xl h-12 bg-foreground/5 rounded-lg" />
    </div>
);

const ClientCarousel = dynamic(() => import("@/components/sections/ClientCarousel").then(mod => mod.ClientCarousel), {
    ssr: false,
    loading: () => <CarouselLoader />
});
const TechCarousel = dynamic(() => import("@/components/sections/TechCarousel").then(mod => mod.TechCarousel), {
    ssr: false,
    loading: () => <CarouselLoader />
});
const Hero3D = dynamic(() => import("@/components/ui/Hero3D").then(mod => mod.Hero3D), {
    ssr: false,
    loading: () => <Hero3DLoader />
});
const QRCodeModal = dynamic(() => import("@/components/ui/QRCodeModal").then(mod => mod.QRCodeModal), {
    ssr: false
});
const LottieAnimation = dynamic(() => import("@/components/ui/LottieAnimation").then(mod => mod.LottieAnimation), {
    ssr: false
});

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
            if (isDeleting) {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            } else if (displayText.length < currentText.length) {
                setDisplayText(currentText.slice(0, displayText.length + 1));
            } else {
                setTimeout(() => setIsDeleting(true), pauseTime);
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, currentIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseTime]);

    return displayText;
}

import { type HeroLocale } from "@/locales/types";

interface Resume {
    label: string;
    language: string;
    file: string;
}

const StatItem = ({ stat, index }: { stat: { label: string; value: string }; index: number }) => (
    <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className="text-center ltr:lg:text-left rtl:lg:text-right"
    >
        <h3 className="text-2xl md:text-3xl font-bold font-outfit mb-1 text-foreground">{stat.value}</h3>
        <p className="text-xs md:text-sm text-secondary-foreground uppercase tracking-wider">{stat.label}</p>
    </motion.div>
);

const SocialLinks = ({ followMeText }: { followMeText: string }) => {
    const socialLinks = [
        { icon: GithubIcon, href: SITE_CONFIG.links.github, label: "GitHub" },
        { icon: LinkedinIcon, href: SITE_CONFIG.links.linkedin, label: "LinkedIn" },
        { icon: TwitterIcon, href: SITE_CONFIG.links.twitter, label: "Twitter" },
        { icon: Mail, href: `mailto:${SITE_CONFIG.email}`, label: "Email" },
    ];

    return (
        <div className="flex items-center gap-4 md:gap-6">
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-60 hidden sm:inline">{followMeText}</span>
            <div className="w-8 md:w-12 h-px bg-secondary-foreground/30 hidden sm:block" />
            <div className="flex gap-3 md:gap-4">
                {socialLinks.map((social) => (
                    <Link
                        key={social.label}
                        href={social.href}
                        className="p-2 rounded-full hover:bg-foreground/5 hover:text-primary transition-colors hover:scale-110 transform duration-200"
                        aria-label={social.label}
                    >
                        <social.icon size={20} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

interface HeroDescriptionProps {
    description: string;
    isExpanded: boolean;
    onToggle: (v: boolean) => void;
    readMoreText: string;
    readLessText: string;
}

const HeroDescription = ({ description, isExpanded, onToggle, readMoreText, readLessText }: HeroDescriptionProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6 md:mb-8"
    >
        <p className={`text-base md:text-xl text-secondary-foreground text-center ltr:lg:text-left rtl:lg:text-right md:text-justify leading-relaxed ${isExpanded ? '' : 'line-clamp-3 md:line-clamp-none'}`}>
            {description}
        </p>
        {description && description.length > 150 && (
            <button
                onClick={() => onToggle(!isExpanded)}
                className="md:hidden mt-2 text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
                {isExpanded ? (
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
);

interface HeroActionButtonsProps {
    currentResumes: Resume[];
    resumeMenuRef: React.RefObject<HTMLDivElement | null>;
    isResumeMenuOpen: boolean;
    setIsResumeMenuOpen: (v: boolean) => void;
    handleResumeDownload: (label: string) => void;
    handleShareProfile: () => void;
    downloadCVText: string;
    language: string;
}

const HeroActionButtons = ({
    currentResumes,
    resumeMenuRef,
    isResumeMenuOpen,
    setIsResumeMenuOpen,
    handleResumeDownload,
    handleShareProfile,
    downloadCVText,
    language
}: HeroActionButtonsProps) => (
    <>
        {currentResumes.length > 1 ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto" ref={resumeMenuRef}>
                    <MagneticButton className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            withHaptic
                            onClick={() => setIsResumeMenuOpen(!isResumeMenuOpen)}
                            className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6 w-full sm:w-auto"
                            aria-haspopup="true"
                            aria-expanded={isResumeMenuOpen}
                        >
                            <Download size={18} />
                            <span>{downloadCVText}</span>
                            <ChevronDown size={14} className={cn("transition-transform", isResumeMenuOpen && "rotate-180")} />
                        </Button>
                    </MagneticButton>

                    <AnimatePresence>
                        {isResumeMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full mb-2 left-0 w-full sm:w-48 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden py-2 z-50"
                            >
                                {currentResumes.map((resume) => (
                                    <a
                                        key={resume.label}
                                        href={resume.file}
                                        download
                                        className="flex items-center px-4 py-2 hover:bg-foreground/5 text-sm transition-colors"
                                        onClick={() => {
                                            setIsResumeMenuOpen(false);
                                            handleResumeDownload(resume.label);
                                        }}
                                    >
                                        {resume.label}
                                    </a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <MagneticButton className="w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="lg"
                        withHaptic
                        onClick={handleShareProfile}
                        className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6 w-full sm:w-auto"
                        aria-label="Share profile"
                    >
                        <Share2 size={18} />
                    </Button>
                </MagneticButton>
            </div>
        ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" asChild withHaptic className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6 w-full sm:w-auto">
                        <a
                            href={currentResumes.length === 1 ? currentResumes[0].file : (localeMetadata as Record<string, { resume: string }>)[language].resume}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleResumeDownload(currentResumes.length === 1 ? currentResumes[0].label : 'default')}
                        >
                            <Download size={18} />
                            <span>{downloadCVText}</span>
                        </a>
                    </Button>
                </MagneticButton>

                <MagneticButton className="w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleShareProfile}
                        className="border-primary/20 hover:bg-primary/10 gap-2 rounded-full px-6 w-full sm:w-auto"
                        aria-label="Share profile"
                    >
                        <Share2 size={18} />
                    </Button>
                </MagneticButton>
            </div>
        )}
    </>
);

interface HeroContentProps {
    hero: HeroLocale;
    direction: "ltr" | "rtl";
    textY: MotionValue<number>;
    typedRole: string;
    isMobile: boolean;
    isDescriptionExpanded: boolean;
    setIsDescriptionExpanded: (v: boolean) => void;
    readMoreText: string;
    readLessText: string;
    stats: { label: string; value: string }[];
    currentResumes: Resume[];
    resumeMenuRef: React.RefObject<HTMLDivElement | null>;
    isResumeMenuOpen: boolean;
    setIsResumeMenuOpen: (v: boolean) => void;
    handleResumeDownload: (label: string) => void;
    handleShareProfile: () => void;
    downloadCVText: string;
    followMeText: string;
    language: string;
}

const HeroContentSection = ({
    hero,
    direction,
    textY,
    typedRole,
    isMobile,
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    readMoreText,
    readLessText,
    stats,
    currentResumes,
    resumeMenuRef,
    isResumeMenuOpen,
    setIsResumeMenuOpen,
    handleResumeDownload,
    handleShareProfile,
    downloadCVText,
    followMeText,
    language
}: HeroContentProps) => (
    <motion.div
        initial={{ opacity: 0, x: direction === "rtl" ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={isMobile ? undefined : { y: textY }}
        className="relative z-10"
    >
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold font-outfit mb-4 leading-[1.1] text-center ltr:lg:text-left rtl:lg:text-right">
            <span className="block text-foreground">{hero.name.split(' ')[0]}</span>
            <span className="block text-gradient">
                {hero.name.split(' ').slice(1).join(' ')}
            </span>
        </h1>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-8 md:h-10 mb-4 text-center ltr:lg:text-left rtl:lg:text-right"
        >
            <span className="text-lg md:text-2xl text-primary font-medium">
                {typedRole}
                <span className="animate-pulse">|</span>
            </span>
        </motion.div>

        <HeroDescription
            description={hero.description}
            isExpanded={isDescriptionExpanded}
            onToggle={setIsDescriptionExpanded}
            readMoreText={readMoreText}
            readLessText={readLessText}
        />

        <div className="grid grid-cols-3 gap-3 md:gap-6 border-t border-foreground/10 pt-5 md:pt-8 mb-6 md:mb-8">
            {stats.map((stat, index) => (
                <StatItem key={stat.label} stat={stat} index={index} />
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center lg:flex-row lg:items-center gap-6 md:gap-8 text-secondary-foreground"
        >
            <HeroActionButtons
                currentResumes={currentResumes}
                resumeMenuRef={resumeMenuRef}
                isResumeMenuOpen={isResumeMenuOpen}
                setIsResumeMenuOpen={setIsResumeMenuOpen}
                handleResumeDownload={handleResumeDownload}
                handleShareProfile={handleShareProfile}
                downloadCVText={downloadCVText}
                language={language}
            />

            <SocialLinks followMeText={followMeText} />
        </motion.div>
    </motion.div>
);

interface HeroImageProps {
    isMobile: boolean;
    imageY: MotionValue<number>;
    hero: HeroLocale;
    direction: string;
    floatingCards: {
        projects: { value: string; label: string; sublabel: string };
        experience: { value: string; label: string; sublabel: string };
    };
}

const HeroImageSection = ({ isMobile, imageY, hero, direction, floatingCards }: HeroImageProps) => (
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
            <div className={`absolute inset-0 ${isMobile ? '' : 'animate-spin-slow'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 md:w-4 h-3 md:h-4 bg-primary rounded-full blur-[2px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-purple-500 rounded-full blur-[2px]" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full blur-[1px]" />
            </div>

            <div className={`absolute inset-4 border border-foreground/5 rounded-full ${isMobile ? '' : 'animate-spin-reverse-slower'}`} />
            <div className={`absolute inset-12 border border-foreground/10 rounded-full ${isMobile ? '' : 'animate-spin-slow'}`} />

            <div className="absolute inset-6 sm:inset-8 rounded-full overflow-hidden border-2 border-foreground/10 bg-secondary/30 backdrop-blur-sm z-10 shadow-2xl shadow-primary/20">
                <div className="relative w-full h-full">
                    <BlurImage
                        src={hero.image}
                        alt={hero.name}
                        fill
                        className="object-cover rounded-3xl"
                        priority={true}
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, 500px"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: direction === "rtl" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute ltr:right-0 rtl:left-0 sm:ltr:-right-2 sm:rtl:-left-2 md:ltr:-right-4 md:rtl:-left-4 top-8 sm:top-12 md:top-20 z-20 glass-card p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl"
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
                initial={{ opacity: 0, x: direction === "rtl" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute ltr:left-0 rtl:right-0 sm:ltr:-left-2 sm:rtl:-right-2 md:ltr:-left-4 md:rtl:-right-4 bottom-8 sm:bottom-12 md:bottom-20 z-20 glass-card p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl"
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
);

interface HeroScrollIndicatorProps {
    prefersReducedMotion: boolean;
    scrollAnimationData: Record<string, unknown> | null;
    scrollDownText: string;
    onScroll: () => void;
}

const HeroScrollIndicator = ({
    prefersReducedMotion,
    scrollAnimationData,
    scrollDownText,
    onScroll
}: HeroScrollIndicatorProps) => (
    <motion.button
        onClick={onScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden sm:flex absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-secondary-foreground/60 hover:text-primary transition-colors cursor-pointer z-30 group"
        aria-label={scrollDownText}
    >
        {prefersReducedMotion ? (
            <>
                <div className="w-[30px] h-[50px] rounded-[15px] border-2 border-current flex justify-center p-2 box-border opacity-70">
                    <div className="w-1.5 h-1.5 bg-current rounded-full mb-1" />
                </div>
                <ChevronDown size={20} className="stroke-3" />
            </>
        ) : (
            scrollAnimationData && (
                <LottieAnimation
                    animationData={scrollAnimationData}
                    loop
                    autoplay
                    className="w-[40px] h-[70px] opacity-70 group-hover:opacity-100 transition-opacity"
                />
            )
        )}
    </motion.button>
);

export function Hero({ resumes = [] }: Readonly<{ resumes?: Resume[] }>) {
    const { t, language, direction } = useLanguage();
    const hero = t.hero as HeroLocale;
    const stats = (hero && Array.isArray(hero.stats)) ? hero.stats : [];
    const roles = hero.roles || ["Developer"];

    // Mobile detection for performance optimizations
    const isMobile = useIsMobile();
    const prefersReducedMotion = usePrefersReducedMotion();

    // State for expandable description on mobile
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Typing animation for roles
    const typedRole = useTypingAnimation(roles, 80, 40, 2500);

    // Filter resumes by current language
    const currentResumes = resumes.filter(r => r.language === language);
    const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const resumeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resumeMenuRef.current && !resumeMenuRef.current.contains(event.target as Node)) {
                setIsResumeMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [scrollAnimationData, setScrollAnimationData] = useState<unknown>(null);
    useEffect(() => {
        import("@/../public/lottie/scroll-mouse.json").then(mod => setScrollAnimationData(mod.default));
    }, []);

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

    const scrollToContent = () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleResumeDownload = (resumeLabel: string) => {
        track('Resume Download', { resume: resumeLabel, language: language });
    };

    const handleShareProfile = () => {
        track('Share Profile QR Code Opened');
        setIsQRModalOpen(true);
    };

    return (
        <SectionTracker sectionId="hero">
            <section ref={sectionRef} className="min-h-screen flex flex-col pt-20 relative overflow-hidden bg-background">
                <AnimatedBackground />
                <ErrorBoundary name="Hero3D" fallback={null}>
                    {!isMobile && !prefersReducedMotion && <Hero3D />}
                </ErrorBoundary>

                <div className="container mx-auto px-4 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center grow py-8 lg:py-12 relative">
                    <HeroContentSection
                        hero={hero}
                        direction={direction}
                        textY={textY}
                        typedRole={typedRole}
                        isMobile={isMobile}
                        isDescriptionExpanded={isDescriptionExpanded}
                        setIsDescriptionExpanded={setIsDescriptionExpanded}
                        readMoreText={readMoreText}
                        readLessText={readLessText}
                        stats={stats}
                        currentResumes={currentResumes}
                        resumeMenuRef={resumeMenuRef}
                        isResumeMenuOpen={isResumeMenuOpen}
                        setIsResumeMenuOpen={setIsResumeMenuOpen}
                        handleResumeDownload={handleResumeDownload}
                        handleShareProfile={handleShareProfile}
                        downloadCVText={downloadCVText}
                        followMeText={followMeText}
                        language={language}
                    />

                    <HeroImageSection
                        isMobile={isMobile}
                        imageY={imageY}
                        hero={hero}
                        direction={direction}
                        floatingCards={floatingCards}
                    />
                </div>

                <HeroScrollIndicator
                    prefersReducedMotion={prefersReducedMotion}
                    scrollAnimationData={scrollAnimationData as Record<string, unknown> | null}
                    scrollDownText={scrollDownText}
                    onScroll={scrollToContent}
                />

                {/* Carousels */}
                <div className="w-full mt-auto relative z-20 flex flex-col gap-0 border-t border-foreground/5 bg-background/30 backdrop-blur-sm">
                    <TechCarousel />
                    <div className="w-full h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
                    <ClientCarousel />
                </div>

                <QRCodeModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                />
            </section >
        </SectionTracker>
    );
}
