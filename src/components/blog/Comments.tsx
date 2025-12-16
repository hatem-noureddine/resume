'use client';

import Giscus from '@giscus/react';
import { useTheme } from '@/context/ThemeContext';

interface CommentsProps {
    slug: string;
}

/**
 * Giscus-powered comments section for blog posts.
 * 
 * Prerequisites:
 * 1. Enable GitHub Discussions on your repository
 * 2. Install the Giscus app: https://github.com/apps/giscus
 * 3. Configure at https://giscus.app/ to get your repo settings
 * 
 * Environment variables needed:
 * - NEXT_PUBLIC_GISCUS_REPO: e.g., "hatem-noureddine/resume"
 * - NEXT_PUBLIC_GISCUS_REPO_ID: from giscus.app
 * - NEXT_PUBLIC_GISCUS_CATEGORY: e.g., "Blog Comments"
 * - NEXT_PUBLIC_GISCUS_CATEGORY_ID: from giscus.app
 */
export function Comments({ slug }: CommentsProps) {
    const { theme } = useTheme();

    // Get configuration from environment variables
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Blog Comments';
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

    // Don't render if not configured
    if (!repo || !repoId || !categoryId) {
        return null;
    }

    return (
        <section id="comments" className="mt-16 pt-8 border-t border-foreground/10">
            <h2 className="text-2xl font-bold font-outfit mb-6">Comments</h2>
            <Giscus
                id="comments"
                repo={repo as `${string}/${string}`}
                repoId={repoId}
                category={category}
                categoryId={categoryId}
                mapping="specific"
                term={slug}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
                lang="en"
                loading="lazy"
            />
        </section>
    );
}
