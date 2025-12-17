'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: ReactNode;
    mode?: 'fade' | 'slide' | 'scale' | 'slideUp';
}

const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slide: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
};

/**
 * Page transition wrapper for smooth route changes.
 * 
 * Usage:
 * ```tsx
 * // In layout.tsx
 * <PageTransition mode="fade">
 *   {children}
 * </PageTransition>
 * ```
 */
export function PageTransition({
    children,
    mode = 'fade',
}: Readonly<PageTransitionProps>) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants[mode]}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

/**
 * Simple fade-in animation wrapper.
 * 
 * Usage:
 * ```tsx
 * <FadeIn delay={0.2}>
 *   <h1>Title</h1>
 * </FadeIn>
 * ```
 */
export function FadeIn({
    children,
    delay = 0,
    duration = 0.3,
    className = '',
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}

/**
 * Container that staggers child animations.
 * 
 * Usage:
 * ```tsx
 * <StaggerContainer staggerDelay={0.1}>
 *   <StaggerItem>Item 1</StaggerItem>
 *   <StaggerItem>Item 2</StaggerItem>
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className = '',
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

/**
 * Item to be used within StaggerContainer.
 */
export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
