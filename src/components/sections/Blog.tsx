"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "@/lib/posts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MobileBlogCard = ({ post, blogText }: { post: Post, blogText: any }) => {
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

    if (!posts || posts.length === 0) {
        return null;
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(posts.length, 3)); // Limit to first 3 posts as per original design
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.min(posts.length, 3)) % Math.min(posts.length, 3));
    };

    const displayPosts = posts.slice(0, 3);

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
                            <MobileBlogCard post={displayPosts[currentIndex]} blogText={blog} />
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-8">
                        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex gap-2">
                            {displayPosts.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-foreground/20"}`}
                                />
                            ))}
                        </div>
                        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        displayPosts.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-secondary/30 rounded-2xl overflow-hidden border border-foreground/5 hover:border-primary/50 transition-colors"
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
                        <div className="col-span-full text-center text-secondary-foreground py-12">
                            {blog.notFound}
                        </div>
                    )}
                </div>

                <div className="mt-12 flex justify-center">
                    <Button variant="secondary" size="lg" asChild className="rounded-full px-8 border border-foreground/10 hover:border-primary/30">
                        <Link href="/blog" className="inline-flex items-center gap-2">
                            {t.header.nav.find(n => n.href === '/blog')?.name || "View all posts"} <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

