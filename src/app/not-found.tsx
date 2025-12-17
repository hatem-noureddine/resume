"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();
    const { notFound } = t;

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10 opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full -z-10 opacity-50" />

            {/* Logo */}
            <Link href="/" className="mb-8" aria-label="Home">
                <Logo className="w-16 h-16 opacity-50 hover:opacity-100 transition-opacity" />
                <span className="sr-only">Home</span>
            </Link>

            {/* 404 Number */}
            <h1 className="text-[150px] md:text-[200px] font-bold font-outfit leading-none text-gradient-static">
                {notFound.title}
            </h1>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-bold font-outfit text-foreground mb-4 text-center">
                {notFound.subtitle}
            </h2>
            <p className="text-secondary-foreground text-center max-w-md mb-8">
                {notFound.message}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-center"
                >
                    {notFound.home}
                </Link>
                <Link
                    href="/#contact"
                    className="px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors border border-foreground/10 text-center"
                >
                    {notFound.contact}
                </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 text-secondary-foreground/30">
                <div className="w-2 h-2 rounded-full bg-current" />
                <div className="w-2 h-2 rounded-full bg-current" />
                <div className="w-2 h-2 rounded-full bg-current" />
            </div>
        </main>
    );
}
