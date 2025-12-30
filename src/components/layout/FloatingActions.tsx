"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { useLanguage } from "@/context/LanguageContext";
import { localeMetadata } from "@/locales";
import { SITE_CONFIG } from "@/config/site";

export function FloatingActions() {
    const { t, language, direction } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    // Get text from locale but fallback to safe strings since proper type casting might be complex
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hero: any = t.hero;
    const downloadCVText = hero?.downloadCV || "CV";

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past 300px (Hero section area)
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Social links with Lottie support
    const socialLinks = [
        { icon: SiGithub, lottieIcon: "github" as const, href: SITE_CONFIG.links.github, label: "GitHub" },
        { icon: SiLinkedin, lottieIcon: "linkedin" as const, href: SITE_CONFIG.links.linkedin, label: "LinkedIn" },
        { icon: SiX, lottieIcon: null, href: SITE_CONFIG.links.twitter, label: "X (Twitter)" },
        { icon: Mail, lottieIcon: "mail" as const, href: `mailto:${SITE_CONFIG.email}`, label: "Email" },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: direction === "rtl" ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === "rtl" ? -50 : 50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
                >
                    {/* Download CV Action */}
                    <motion.a
                        href={localeMetadata[language].resume}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200 relative group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download size={20} />
                        {/* Tooltip */}
                        <span className="absolute ltr:right-full rtl:left-full ltr:mr-2 rtl:ml-2 px-2 py-1 bg-background border border-border rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                            {downloadCVText}
                        </span>
                    </motion.a>

                    {/* Divider */}
                    <div className="w-px h-8 bg-border mx-auto my-1" />

                    {/* Social Links */}
                    <div className="flex flex-col gap-3 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors relative group"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <social.icon size={18} />
                                {/* Tooltip */}
                                <span className="absolute ltr:right-full rtl:left-full ltr:mr-3 rtl:ml-3 px-2 py-1 bg-background border border-border rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                                    {social.label}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

