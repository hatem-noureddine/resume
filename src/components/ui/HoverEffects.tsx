'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HoverCardProps {
    children: ReactNode;
    className?: string;
    scale?: number;
    lift?: number;
    glow?: boolean;
}

/**
 * Card wrapper that adds hover effects with scale, lift, and optional glow.
 * 
 * Usage:
 * ```tsx
 * <HoverCard glow>
 *   <div className="p-4">Card content</div>
 * </HoverCard>
 * ```
 */
export function HoverCard({
    children,
    className = '',
    scale = 1.02,
    lift = -4,
    glow = false,
}: Readonly<HoverCardProps>) {
    return (
        <motion.div
            className={`relative ${className}`}
            whileHover={{
                scale,
                y: lift,
                transition: { duration: 0.2, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.98 }}
        >
            {glow && (
                <motion.div
                    className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                />
            )}
            <div className="relative">{children}</div>
        </motion.div>
    );
}

interface HoverButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Button with hover effects including scale and color transitions.
 * 
 * Usage:
 * ```tsx
 * <HoverButton variant="primary">Click me</HoverButton>
 * ```
 */
export function HoverButton({
    children,
    variant = 'primary',
    className = '',
    onClick,
    disabled,
    type = 'button',
}: HoverButtonProps) {
    const baseClasses = "relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50";

    const variantClasses = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent hover:bg-foreground/5",
    };

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                whileHover={{ translateX: '200%' }}
                transition={{ duration: 0.5 }}
                aria-hidden="true"
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}

interface HoverLinkProps {
    children: ReactNode;
    href?: string;
    className?: string;
    underline?: boolean;
    onClick?: () => void;
}

/**
 * Link with hover underline animation.
 * 
 * Usage:
 * ```tsx
 * <HoverLink href="/about" underline>About Us</HoverLink>
 * ```
 */
export function HoverLink({
    children,
    href,
    className = '',
    underline = true,
    onClick,
}: HoverLinkProps) {
    const Component = href ? 'a' : 'span';

    return (
        <motion.span
            className={`relative inline-block cursor-pointer ${className}`}
            whileHover="hover"
        >
            <Component href={href} onClick={onClick} className="relative">
                {children}
                {underline && (
                    <motion.span
                        className="absolute bottom-0 left-0 h-0.5 bg-primary"
                        initial={{ width: 0 }}
                        variants={{
                            hover: { width: '100%' },
                        }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </Component>
        </motion.span>
    );
}

interface HoverIconProps {
    children: ReactNode;
    className?: string;
    rotate?: number;
    scale?: number;
}

/**
 * Icon wrapper with hover rotation and scale effects.
 * 
 * Usage:
 * ```tsx
 * <HoverIcon rotate={15}>
 *   <Settings className="w-5 h-5" />
 * </HoverIcon>
 * ```
 */
export function HoverIcon({
    children,
    className = '',
    rotate = 0,
    scale = 1.1,
}: HoverIconProps) {
    return (
        <motion.span
            className={`inline-flex ${className}`}
            whileHover={{
                rotate,
                scale,
                transition: { duration: 0.2 },
            }}
        >
            {children}
        </motion.span>
    );
}
