"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    slug: string;
    title: string;
    description: string;
    className?: string;
    size?: "sm" | "md";
}

export function BookmarkButton({
    slug,
    title,
    description,
    className,
    size = "md"
}: Readonly<BookmarkButtonProps>) {
    const { isBookmarked, toggleBookmark, mounted } = useBookmarks();

    const bookmarked = isBookmarked(slug);

    if (!mounted) {
        return (
            <button
                className={cn(
                    "p-2 rounded-full opacity-50 cursor-default",
                    className
                )}
                disabled
            >
                <Bookmark className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
            </button>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark({ slug, title, description });
            }}
            className={cn(
                "p-2 rounded-full transition-colors",
                bookmarked
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
                className
            )}
            aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
            title={bookmarked ? "Remove from reading list" : "Save for later"}
        >
            <AnimatePresence mode="wait" initial={false}>
                {bookmarked ? (
                    <motion.div
                        key="bookmarked"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                    >
                        <BookmarkCheck className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="not-bookmarked"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Bookmark className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
