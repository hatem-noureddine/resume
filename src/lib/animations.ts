/**
 * Fade in from bottom with opacity.
 * Used for general content reveal.
 */
export const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    },
    exit: { opacity: 0, y: 20 }
};

/**
 * Fade in from bottom (shorter distance).
 * Good for text lines or small elements.
 */
export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

/**
 * Fade in from left.
 * Used for timeline items or sidebar content.
 */
export const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 }
    }
};

/**
 * Stagger container.
 * wraps children animations with 0.1s stagger.
 */
export const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};
