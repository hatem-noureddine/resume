"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "@/lib/posts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { BlogLocale } from "@/locales/types";

const MobileBlogCard = ({ post, blogText }: { post: Post, blogText: BlogLocale }) => {
    return (
        <motion.article
            key={post.slug}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="group bg-secondary/30 rounded-2xl overflow-hidden border border-foreground/5 hover:border-primary/50 transition-colors mx-4 h-[450px] flex flex-col"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 text-sm text-secondary-foreground">
                    <span>{post.date}</span>
                    <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                        {post.tags[0]}
                    </span>
                </div>
                <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>
                <p className="text-secondary-foreground mb-6 line-clamp-3 md:line-clamp-4 grow">
                    {post.description}
                </p>
                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all mt-auto"
                >
                    {blogText.readMore} <ArrowRight size={16} />
                </Link>
            </div>
        </motion.article>
    );
};

export function Blog({ posts }: { posts: Post[] }) {
    const { t } = useLanguage();
    const { blog } = t;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState("All");

    if (!posts || posts.length === 0) {
        return null;
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(posts.length, 3));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.min(posts.length, 3)) % Math.min(posts.length, 3));
    };

    const uniqueCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    // Limit to 6 posts for grid view
    const displayGridPosts = filteredPosts.slice(0, 6);

    // Mobile always shows top 3 of ALL posts (carousel) or filtered? 
    // Usually mobile carousel shows featured. Let's keep it simple: Mobile carousel shows top 3 of ALL.
    const carouselPosts = posts.slice(0, 3);

    return (
        <section id="blog" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Blog"
                    subtitle={blog.title}
                    className="mb-16"
                />

                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <MobileBlogCard post={carouselPosts[currentIndex]} blogText={blog} />
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-8">
                        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full" aria-label="Previous post">
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex gap-2">
                            {carouselPosts.map((p, index) => (
                                <div
                                    key={p.slug}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-foreground/20"}`}
                                />
                            ))}
                        </div>
                        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full" aria-label="Next post">
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Grid with Filter */}
                <div className="hidden md:block">
                    {/* Filters */}
                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        {uniqueCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    activeCategory === category
                                        ? "bg-primary text-white shadow-lg scale-105"
                                        : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                                aria-pressed={activeCategory === category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayGridPosts.length > 0 ? (
                                displayGridPosts.map((post) => (
                                    <motion.article
                                        layout
                                        key={post.slug}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-secondary/30 rounded-2xl overflow-hidden border border-foreground/5 hover:border-primary/50 transition-colors flex flex-col h-full"
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-center mb-4 text-sm text-secondary-foreground">
                                                <span>{post.date}</span>
                                                <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                                                    {post.tags[0]}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="text-secondary-foreground mb-6 line-clamp-3 md:line-clamp-4 grow">
                                                {post.description}
                                            </p>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all mt-auto"
                                            >
                                                {blog.readMore} <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </motion.article>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center text-secondary-foreground py-12"
                                >
                                    {blog.notFound}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Button variant="secondary" size="lg" asChild className="rounded-full px-8 border border-foreground/10 hover:border-primary/30">
                        <Link href="/blog" className="inline-flex items-center gap-2">
                            {blog.viewAll || "View All Posts"} <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

