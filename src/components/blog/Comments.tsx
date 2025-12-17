"use client";

import { useTheme } from "@/context/ThemeContext";
import Giscus from "@giscus/react";
import { SITE_CONFIG } from "@/config/site";

export function Comments() {
    const { theme } = useTheme();

    // Map site theme to Giscus theme
    const giscusTheme = theme === "dark"
        ? "dark"
        : "light";

    // Don't render if config is missing (basic check)
    // In a real scenario, we might want to warn the user or just hide it gracefully
    if (!SITE_CONFIG.giscus.repo) {
        return null;
    }

    return (
        <section className="w-full mt-16 print:hidden" aria-label="Comments">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-foreground/10 flex-1" />
                <h2 className="text-2xl font-bold font-outfit text-center">
                    Comments
                </h2>
                <div className="h-px bg-foreground/10 flex-1" />
            </div>

            <div className="min-h-[300px]">
                <Giscus
                    id="comments"
                    repo={SITE_CONFIG.giscus.repo}
                    repoId={SITE_CONFIG.giscus.repoId}
                    category={SITE_CONFIG.giscus.category}
                    categoryId={SITE_CONFIG.giscus.categoryId}
                    mapping="pathname"
                    term="Welcome to my blog!"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    theme={giscusTheme}
                    lang="en"
                    loading="lazy"
                />
            </div>
        </section>
    );
}
