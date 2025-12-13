"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import * as LucideIcons from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer({ hasBlogPosts = true }: { hasBlogPosts?: boolean }) {
    const { t } = useLanguage();
    const { header, contact, footer } = t;

    const portfolioItems = t.portfolio.items || [];
    const showPortfolio = portfolioItems.length > 0;

    const navLinks = header.nav.filter(link => {
        if (link.href.includes('portfolio')) return showPortfolio;
        if (link.href.includes('blog')) return hasBlogPosts;
        return true;
    });

    return (
        <footer className="bg-secondary py-12 border-t border-foreground/5">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-8 w-8">
                            <Logo className="h-full w-full" />
                        </div>
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
                    {contact.socials.map((social, index) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (LucideIcons as any)[social.icon] || LucideIcons.Link;
                        return (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full border border-foreground/10 text-secondary-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            >
                                <Icon size={18} />
                            </a>
                        );
                    })}
                </div>

            </div>
        </footer>
    );
}
