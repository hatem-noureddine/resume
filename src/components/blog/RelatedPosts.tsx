"use client";

import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/lib/posts";

interface RelatedPostsProps {
    posts: Post[];
    currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
    // Filter out current post and get related posts (by tags or category)
    const currentPost = posts.find(p => p.slug === currentSlug);

    if (!currentPost) return null;

    const relatedPosts = posts
        .filter(p => p.slug !== currentSlug)
        .map(post => {
            // Calculate relevance score based on matching tags and category
            let score = 0;
            if (post.category === currentPost.category) score += 2;
            post.tags.forEach(tag => {
                if (currentPost.tags.includes(tag)) score += 1;
            });
            return { ...post, score };
        })
        .filter(p => p.score > 0) // Only show posts with at least one match
        .sort((a, b) => b.score - a.score) // Sort by relevance
        .slice(0, 3); // Limit to 3 related posts

    if (relatedPosts.length === 0) return null;

    return (
        <section className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold font-outfit mb-8">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((post, index) => (
                    <motion.article
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-secondary/30 rounded-xl p-5 border border-white/5 hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <span className="bg-secondary px-2 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span>{post.date}</span>
                        </div>
                        <h3 className="font-bold font-outfit mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            {post.tags.slice(0, 2).join(", ")}
                        </div>
                        <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all"
                        >
                            Read more <ArrowRight className="w-3 h-3" />
                        </Link>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
