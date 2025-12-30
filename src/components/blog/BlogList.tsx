"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronLeft, ChevronRight, Tag, Clock, Home } from "lucide-react";
import { Post } from "@/lib/posts";
import { useLanguage } from "@/context/LanguageContext";
import { container } from "@/lib/animations";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EmptyState } from "@/components/ui/EmptyState";

const POSTS_PER_PAGE = 6;

interface BlogListProps {
    readonly initialPosts: Post[];
}

export function BlogList({ initialPosts }: Readonly<BlogListProps>) {
    const { t } = useLanguage();
    const { blog } = t;
    const prefersReducedMotion = usePrefersReducedMotion();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Derive groups dynamically from posts
    const activeGroups = useMemo(() => {
        const groups: Record<string, Set<string>> = {};

        // Initialize groups based on categories found in posts
        initialPosts.forEach(post => {
            const category = post.category || "General";
            if (!groups[category]) {
                groups[category] = new Set();
            }
            post.tags.forEach(tag => groups[category].add(tag));
        });

        // Convert Sets to arrays and sort keys
        const sortedGroups: Record<string, string[]> = {};
        Object.keys(groups).sort((a, b) => a.localeCompare(b)).forEach(key => {
            sortedGroups[key] = Array.from(groups[key]).sort((a, b) => a.localeCompare(b));
        });

        return sortedGroups;
    }, [initialPosts]);


    const filteredPosts = initialPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleTagClick = (tag: string) => {
        if (selectedTag === tag) {
            setSelectedTag(null);
        } else {
            setSelectedTag(tag);
            setCurrentPage(1); // Reset to first page
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTag(null);
        setCurrentPage(1);
    };

    const animationProps = prefersReducedMotion
        ? {}
        : {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 }
        };

    return (
        <div className="space-y-12">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-secondary-foreground">
                <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home size={14} />
                    {blog.breadcrumb?.home || "Home"}
                </Link>
                <ChevronRight size={14} className="text-muted-foreground" />
                <span className="text-foreground font-medium">{blog.breadcrumb?.blog || "Blog"}</span>
            </nav>

            {/* Results count */}
            <div className="text-sm text-secondary-foreground">
                {blog.showing || "Showing"} <span className="font-medium text-foreground">{filteredPosts.length}</span> {blog.posts || "posts"}
                {selectedTag && (
                    <span> {blog.taggedWith || "tagged with"} <span className="text-primary font-medium">{selectedTag}</span></span>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="relative grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder={blog.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-foreground/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border transition-all font-medium ${isFilterOpen || selectedTag
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary/30 border-foreground/10 hover:border-foreground/20"
                            }`}
                    >
                        <Filter size={20} />
                        <span>{blog.filterByTopic}</span>
                    </button>
                </div>

                {/* Collapsible Filter Panel */}
                <AnimatePresence>
                    {(isFilterOpen || selectedTag) && (
                        <motion.div
                            {...animationProps}
                            className="overflow-hidden"
                        >
                            <div className="bg-secondary/20 border border-foreground/5 rounded-2xl p-6 max-w-4xl mx-auto backdrop-blur-sm">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Object.entries(activeGroups).map(([groupName, tags]) => (
                                        <div key={groupName}>
                                            <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                                <Tag size={16} /> {groupName}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => handleTagClick(tag)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${selectedTag === tag
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-background/50 hover:bg-secondary border-foreground/5 hover:border-foreground/10"
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end border-t border-foreground/5 pt-4">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    >
                                        <X size={14} /> {blog.clearFilters}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Posts Grid */}
            <div className="min-h-[400px]">
                {paginatedPosts.length > 0 ? (
                    <motion.div
                        key={currentPage + (selectedTag || "") + searchQuery}
                        variants={prefersReducedMotion ? {} : container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {paginatedPosts.map((post) => {
                                return (
                                    <motion.article
                                        layout={!prefersReducedMotion}
                                        variants={prefersReducedMotion ? {} : {
                                            hidden: { opacity: 0, scale: 0.9 },
                                            show: { opacity: 1, scale: 1 },
                                            exit: { opacity: 0, scale: 0.9 }
                                        }}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        key={post.slug}
                                        className="group bg-secondary/30 rounded-2xl overflow-hidden border border-foreground/5 hover:border-primary/50 transition-colors flex flex-col"
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                <span>{post.date}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {post.readingTime || "1 min read"}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="text-secondary-foreground mb-6 line-clamp-3 grow">
                                                {post.description}
                                            </p>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all mt-auto"
                                            >
                                                {blog.readMore} <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <EmptyState
                        title={blog.notFound}
                        description={blog.tryAdjusting || "Try adjusting your search or filters to find what you're looking for."}
                        action={
                            <button
                                onClick={clearFilters}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors font-medium"
                            >
                                {blog.clearFilters}
                            </button>
                        }
                    />
                )
                }
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-foreground/10 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={blog.previous}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-sm font-medium">
                        {blog.page || "Page"} {currentPage} {blog.of || "of"} {totalPages}
                    </div>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border border-foreground/10 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={blog.next}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
