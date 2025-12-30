"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import * as LucideIcons from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { CopyToClipboard } from "@/components/ui/CopyToClipboard";

const { ArrowUp } = LucideIcons;

export function Footer({ hasBlogPosts = true }: Readonly<{ hasBlogPosts?: boolean }>) {
    const { t } = useLanguage();
    const { header, contact, footer } = t;
    const prefersReducedMotion = usePrefersReducedMotion();
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Track scroll position for back-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    };

    const portfolioItems = t.portfolio.items || [];
    const showPortfolio = portfolioItems.length > 0;

    const navLinks = header.nav.filter(link => {
        if (link.href.includes('portfolio')) return showPortfolio;
        if (link.href.includes('blog')) return hasBlogPosts;
        return true;
    });

    return (
        <footer id="contact" className="bg-secondary pt-16 pb-12 border-t border-foreground/5 relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-16">
                    <NewsletterForm
                        title={'newsletter' in footer && footer.newsletter?.title ? footer.newsletter.title : "Subscribe to my newsletter"}
                        description={'newsletter' in footer && footer.newsletter?.description ? footer.newsletter.description : "Get notified about new posts and updates."}
                        onSubmit={async (email) => {
                            const response = await fetch('/api/newsletter', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email }),
                            });
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.error || 'Subscription failed');
                        }}
                        className="bg-background/50 rounded-2xl border border-foreground/5 p-8"
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/" className="flex items-center gap-2" aria-label="Home">
                            <div className="relative h-8 w-8">
                                <Logo className="h-full w-full" />
                            </div>
                            <span className="sr-only">Home</span>
                        </Link>
                        <p className="text-sm text-secondary-foreground">
                            © {new Date().getFullYear()} {footer.rights}
                        </p>
                    </div>

                    <nav className="flex gap-6 flex-wrap justify-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm text-secondary-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex gap-4">
                        {contact.socials.map((social) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const Icon = (LucideIcons as any)[social.icon] || LucideIcons.Link;
                            return (
                                <a
                                    key={social.icon}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full border border-foreground/10 text-secondary-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                    aria-label={social.icon}
                                >
                                    <Icon size={18} />
                                </a>
                            );
                        })}
                    </div>

                </div>

            </div>



            {/* Back to Top Button */}
            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label={footer.backToTop || "Back to top"}
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer >
    );
}
