'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    position?: TooltipPosition;
    delay?: number;
    className?: string;
}

/**
 * Accessible tooltip component with animation support.
 * 
 * Usage:
 * ```tsx
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 200,
    className = ''
}: Readonly<TooltipProps>) {
    const [isVisible, setIsVisible] = useState(false);
    const [actualPosition, setActualPosition] = useState(position);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Check if tooltip would overflow viewport and adjust position
    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let newPosition = position;

            // Check overflow and adjust
            if (position === 'top' && triggerRect.top - tooltipRect.height < 10) {
                newPosition = 'bottom';
            } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > globalThis.innerHeight - 10) {
                newPosition = 'top';
            } else if (position === 'left' && triggerRect.left - tooltipRect.width < 10) {
                newPosition = 'right';
            } else if (position === 'right' && triggerRect.right + tooltipRect.width > globalThis.innerWidth - 10) {
                newPosition = 'left';
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect -- Computing position based on DOM measurements
            setActualPosition(newPosition);
        }
    }, [isVisible, position]);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const positionClasses: Record<TooltipPosition, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses: Record<TooltipPosition, string> = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-foreground/90 border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-foreground/90 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-foreground/90 border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-foreground/90 border-y-transparent border-l-transparent',
    };

    const getAnimationProps = (pos: TooltipPosition) => {
        switch (pos) {
            case 'top':
                return {
                    initial: { opacity: 0, y: 5 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 5 },
                };
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -5 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -5 },
                };
            case 'left':
                return {
                    initial: { opacity: 0, x: 5 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 5 },
                };
            case 'right':
                return {
                    initial: { opacity: 0, x: -5 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -5 },
                };
        }
    };

    return (
        <div
            ref={triggerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        ref={tooltipRef}
                        role="tooltip"
                        className={`absolute z-50 px-3 py-2 text-sm font-medium text-background bg-foreground/90 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[actualPosition]}`}
                        {...getAnimationProps(actualPosition)}
                        transition={{ duration: 0.15 }}
                    >
                        {content}
                        <div
                            className={`absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`}
                            aria-hidden="true"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
