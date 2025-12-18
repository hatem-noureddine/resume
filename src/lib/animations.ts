/**
 * Centralized Animation Configuration
 * 
 * This file contains reusable animation variants and presets for Framer Motion.
 * Use these presets to maintain consistency across the application.
 * 
 * @example
 * ```tsx
 * import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';
 * 
 * <motion.div variants={fadeIn} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 * ```
 */

import type { Variants, Transition } from 'framer-motion';

// =============================================================================
// DURATION & TIMING PRESETS
// =============================================================================

export const durations = {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.8,
} as const;

export const easings = {
    /** Smooth ease in/out - default for most animations */
    default: [0.4, 0, 0.2, 1],
    /** Quick start, smooth end - for entrances */
    easeOut: [0, 0, 0.2, 1],
    /** Smooth start, quick end - for exits */
    easeIn: [0.4, 0, 1, 1],
    /** Bouncy spring-like feel */
    bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// =============================================================================
// BASE TRANSITIONS
// =============================================================================

export const transitions = {
    default: {
        duration: durations.normal,
        ease: easings.default,
    } satisfies Transition,

    fast: {
        duration: durations.fast,
        ease: easings.default,
    } satisfies Transition,

    slow: {
        duration: durations.slow,
        ease: easings.default,
    } satisfies Transition,

    spring: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    } satisfies Transition,

    springBouncy: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
    } satisfies Transition,
};

// =============================================================================
// FADE VARIANTS
// =============================================================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: transitions.default,
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitions.default,
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitions.default,
    },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: transitions.default,
    },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: transitions.default,
    },
};

// =============================================================================
// SCALE VARIANTS
// =============================================================================

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: transitions.spring,
    },
};

export const scaleInBounce: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: transitions.springBouncy,
    },
};

// =============================================================================
// SLIDE VARIANTS
// =============================================================================

export const slideUp: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: transitions.default,
    },
};

export const slideDown: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: transitions.default,
    },
};

export const slideLeft: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: transitions.default,
    },
};

export const slideRight: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: transitions.default,
    },
};

// =============================================================================
// CONTAINER VARIANTS (for staggered children)
// =============================================================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05,
        },
    },
};

export const staggerContainerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

// Alias for backward compatibility
export const container = staggerContainer;

// =============================================================================
// EXPAND/COLLAPSE VARIANTS
// =============================================================================

export const expandVertical: Variants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: 'auto',
        opacity: 1,
        transition: transitions.default,
    },
};

export const expandHorizontal: Variants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
        width: 'auto',
        opacity: 1,
        transition: transitions.default,
    },
};

// =============================================================================
// SPECIAL EFFECTS
// =============================================================================

export const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: transitions.springBouncy,
    },
};

export const rotateIn: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: transitions.spring,
    },
};

// =============================================================================
// HOVER & TAP STATES
// =============================================================================

export const hoverScale = {
    scale: 1.05,
    transition: transitions.fast,
};

export const tapScale = {
    scale: 0.95,
    transition: transitions.fast,
};

export const hoverLift = {
    y: -4,
    transition: transitions.fast,
};

// =============================================================================
// REDUCED MOTION HELPERS
// =============================================================================

/**
 * Enhances variants based on reduced motion preference
 */
export const getMotionVariants = <T extends Variants>(variants: T, prefersReducedMotion: boolean): T | Variants =>
    prefersReducedMotion ? {} : variants;

/**
 * Enhances animation object based on reduced motion preference
 */
export const getMotionAnimation = <T extends object>(animation: T, prefersReducedMotion: boolean): T | object =>
    prefersReducedMotion ? {} : animation;

/**
 * @deprecated Use getMotionVariants instead
 */
export function withReducedMotion<T extends object>(
    variants: T,
    prefersReducedMotion: boolean
): T | Record<string, never> {
    return prefersReducedMotion ? {} : (variants as T | Record<string, never>);
}

/**
 * @deprecated Use getMotionAnimation instead
 */
export function conditionalAnimation(
    animation: object,
    prefersReducedMotion: boolean
): object {
    return prefersReducedMotion ? {} : animation;
}
