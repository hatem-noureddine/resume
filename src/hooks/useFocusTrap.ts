"use client";

import { useEffect, useRef, RefObject } from "react";

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Hook to trap focus within a container element.
 * Useful for modals and dialogs to ensure keyboard users stay within the component.
 * 
 * @param containerRef - Ref to the container element that should trap focus
 * @param isActive - Whether the focus trap is currently active
 * @param options - Configuration options
 */
export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    isActive: boolean,
    options: {
        initialFocusRef?: RefObject<HTMLElement | null>;
        returnFocusOnDeactivate?: boolean;
    } = {}
) {
    const { initialFocusRef, returnFocusOnDeactivate = true } = options;
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Save the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus the initial element or the first focusable element
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        if (initialFocusRef?.current) {
            initialFocusRef.current.focus();
        } else if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            // If no focusable elements, focus the container itself
            containerRef.current.focus();
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab' || !containerRef.current) return;

            const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Shift + Tab: if on first element, go to last
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
            // Tab: if on last element, go to first
            else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Restore focus to the previously focused element
            if (returnFocusOnDeactivate && previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isActive, containerRef, initialFocusRef, returnFocusOnDeactivate]);
}
