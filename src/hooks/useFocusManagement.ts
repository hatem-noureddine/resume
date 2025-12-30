'use client';

import { useEffect, useRef, useCallback, RefObject, useState } from 'react';

/**
 * Handle arrow key navigation for vertical orientation
 */
function handleVerticalNavigation(key: string, currentIndex: number, itemCount: number, wrap: boolean): number | null {
    if (key === 'ArrowDown') {
        const next = currentIndex + 1;
        if (next >= itemCount) return wrap ? 0 : itemCount - 1;
        return next;
    }
    if (key === 'ArrowUp') {
        const prev = currentIndex - 1;
        if (prev < 0) return wrap ? itemCount - 1 : 0;
        return prev;
    }
    return null;
}

/**
 * Handle arrow key navigation for horizontal orientation
 */
function handleHorizontalNavigation(key: string, currentIndex: number, itemCount: number, wrap: boolean): number | null {
    if (key === 'ArrowRight') {
        const next = currentIndex + 1;
        if (next >= itemCount) return wrap ? 0 : itemCount - 1;
        return next;
    }
    if (key === 'ArrowLeft') {
        const prev = currentIndex - 1;
        if (prev < 0) return wrap ? itemCount - 1 : 0;
        return prev;
    }
    return null;
}

/**
 * Calculate the next focused index based on key press and orientation
 */
function calculateNewIndex(
    key: string,
    currentIndex: number,
    itemCount: number,
    orientation: 'vertical' | 'horizontal' | 'both',
    wrap: boolean
): number {
    if (key === 'Home') return 0;
    if (key === 'End') return itemCount - 1;

    if (orientation === 'vertical' || orientation === 'both') {
        const newIndex = handleVerticalNavigation(key, currentIndex, itemCount, wrap);
        if (newIndex !== null) return newIndex;
    }

    if (orientation === 'horizontal' || orientation === 'both') {
        const newIndex = handleHorizontalNavigation(key, currentIndex, itemCount, wrap);
        if (newIndex !== null) return newIndex;
    }

    return currentIndex;
}

export function useKeyboardNavigation(
    itemCount: number,
    options: {
        wrap?: boolean;
        orientation?: 'vertical' | 'horizontal' | 'both';
        onSelect?: (index: number) => void;
    } = {}
) {
    const { wrap = true, orientation = 'vertical', onSelect } = options;
    const [focusedIndex, setFocusedIndex] = useState(0);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);

    // Effect to apply focus when index changes
    useEffect(() => {
        const currentItem = itemRefs.current[focusedIndex];
        if (currentItem) {
            currentItem.focus();
        }
    }, [focusedIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Handle selection keys first
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(focusedIndex);
            return;
        }

        const newIndex = calculateNewIndex(e.key, focusedIndex, itemCount, orientation, wrap);

        if (newIndex !== focusedIndex) {
            e.preventDefault(); // Prevent scroll on arrow keys if navigation happened
            setFocusedIndex(newIndex);
        }
    }, [itemCount, wrap, orientation, onSelect, focusedIndex]);

    const getItemProps = useCallback((index: number) => ({
        ref: (el: HTMLElement | null) => {
            itemRefs.current[index] = el;
        },
        tabIndex: index === focusedIndex ? 0 : -1,
        'aria-selected': index === focusedIndex,
    }), [focusedIndex]);

    return {
        focusedIndex,
        setFocusedIndex,
        handleKeyDown,
        getItemProps,
    };
}

/**
 * Hook to trap focus within a container element.
 * Useful for modals, dialogs, and dropdown menus.
 */
export function useFocusTrap<T extends HTMLElement>(
    isActive: boolean = true
): RefObject<T | null> {
    const containerRef = useRef<T>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const getFocusableElements = useCallback((): HTMLElement[] => {
        if (!containerRef.current) return [];

        const selector = [
            'button:not([disabled])',
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(', ');

        return Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(selector)
        ).filter(el => el.offsetParent !== null);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable.at(-1);

        if (!lastElement) return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else if (document.activeElement === lastElement) {
            // Tab
            e.preventDefault();
            firstElement.focus();
        }
    }, [getFocusableElements]);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Store previously focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus first focusable element
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
            focusable[0].focus();
        } else {
            containerRef.current.focus();
        }

        // Add keydown listener
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus on cleanup
            previousActiveElement.current?.focus();
        };
    }, [isActive, getFocusableElements, handleKeyDown]);

    return containerRef;
}

/**
 * Hook to make an element focusable via skip link.
 * Adds an anchor target for keyboard users.
 */
export function useSkipLink(id: string): RefObject<HTMLElement | null> {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.setAttribute('id', id);
            ref.current.setAttribute('tabindex', '-1');
        }
    }, [id]);

    return ref;
}
