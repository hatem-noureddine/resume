"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BookmarkedPost {
    slug: string;
    title: string;
    description: string;
    savedAt: string;
}

const STORAGE_KEY = "bookmarked-posts";

function getInitialBookmarks(): BookmarkedPost[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>(getInitialBookmarks);
    const mountedRef = useRef(false);

    // Save to localStorage whenever bookmarks change (after initial mount)
    useEffect(() => {
        if (mountedRef.current) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
        } else {
            mountedRef.current = true;
        }
    }, [bookmarks]);

    const isBookmarked = useCallback((slug: string) => {
        return bookmarks.some(b => b.slug === slug);
    }, [bookmarks]);

    const addBookmark = useCallback((post: Omit<BookmarkedPost, "savedAt">) => {
        setBookmarks(prev => {
            if (prev.some(b => b.slug === post.slug)) return prev;
            return [...prev, { ...post, savedAt: new Date().toISOString() }];
        });
    }, []);

    const removeBookmark = useCallback((slug: string) => {
        setBookmarks(prev => prev.filter(b => b.slug !== slug));
    }, []);

    const toggleBookmark = useCallback((post: Omit<BookmarkedPost, "savedAt">) => {
        if (isBookmarked(post.slug)) {
            removeBookmark(post.slug);
        } else {
            addBookmark(post);
        }
    }, [isBookmarked, addBookmark, removeBookmark]);

    const clearBookmarks = useCallback(() => {
        setBookmarks([]);
    }, []);

    return {
        bookmarks,
        isBookmarked,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        clearBookmarks,
        mounted: true, // Always mounted when hook is used
    };
}

