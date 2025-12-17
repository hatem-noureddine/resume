'use client';

import { useEffect, useRef, useCallback, RefObject, useState } from 'react';

// ... (omitted useFocusTrap)

export function useKeyboardNavigation(
    itemCount: number,
    options: {
        wrap?: boolean;
        orientation?: 'vertical' | 'horizontal' | 'both';
        onSelect?: (index: number) => void;
    } = {}
) {
    const { wrap = true, orientation = 'vertical', onSelect } = options;
    const [focusedIndex, setFocusedIndexState] = useState(0);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);

    const setFocusedIndex = useCallback((index: number) => {
        setFocusedIndexState(index);
    }, []);

    // Effect to apply focus when index changes
    useEffect(() => {
        itemRefs.current[focusedIndex]?.focus();
    }, [focusedIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const currentIndex = focusedIndex;
        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowDown':
                if (orientation === 'vertical' || orientation === 'both') {
                    e.preventDefault();
                    newIndex = currentIndex + 1;
                    if (newIndex >= itemCount) {
                        newIndex = wrap ? 0 : itemCount - 1;
                    }
                }
                break;
            case 'ArrowUp':
                if (orientation === 'vertical' || orientation === 'both') {
                    e.preventDefault();
                    newIndex = currentIndex - 1;
                    if (newIndex < 0) {
                        newIndex = wrap ? itemCount - 1 : 0;
                    }
                }
                break;
            case 'ArrowRight':
                if (orientation === 'horizontal' || orientation === 'both') {
                    e.preventDefault();
                    newIndex = currentIndex + 1;
                    if (newIndex >= itemCount) {
                        newIndex = wrap ? 0 : itemCount - 1;
                    }
                }
                break;
            case 'ArrowLeft':
                if (orientation === 'horizontal' || orientation === 'both') {
                    e.preventDefault();
                    newIndex = currentIndex - 1;
                    if (newIndex < 0) {
                        newIndex = wrap ? itemCount - 1 : 0;
                    }
                }
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = itemCount - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                onSelect?.(currentIndex);
                return;
        }

        if (newIndex !== currentIndex) {
            setFocusedIndex(newIndex);
        }
    }, [itemCount, wrap, orientation, onSelect, setFocusedIndex, focusedIndex]);

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
 * 
 * Usage:
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
 *   return isOpen ? <div ref={containerRef}>{children}</div> : null;
 * }
 * ```
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
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
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
        if (!ref.current) return;
        ref.current.setAttribute('id', id);
        ref.current.setAttribute('tabindex', '-1');
    }, [id]);

    return ref;
}
