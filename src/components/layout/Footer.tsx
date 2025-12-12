"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import * as LucideIcons from "lucide-react";

export function Footer() {
    const { t } = useLanguage();
    const { header, contact, footer } = t;

    return (
        <footer className="bg-secondary py-12 border-t border-white/5">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="text-2xl font-bold font-outfit text-foreground">
                        {header.logo}<span className="text-primary">.</span>
                    </Link>
                    <p className="text-sm text-secondary-foreground">
                        © {new Date().getFullYear()} {footer.rights}
                    </p>
                </div>

                <nav className="flex gap-6 flex-wrap justify-center">
                    {header.nav.map((link) => (
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
                                className="p-2 rounded-full border border-white/10 text-secondary-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
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
