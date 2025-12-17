'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    border?: boolean;
    hover?: boolean;
}

/**
 * Glassmorphism card component with frosted glass effect.
 * 
 * Usage:
 * ```tsx
 * <GlassCard blur="md" hover>
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */
export function GlassCard({
    children,
    className = '',
    blur = 'md',
    border = true,
    hover = false,
}: Readonly<GlassCardProps>) {
    const blurClasses = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
    };

    return (
        <div
            className={cn(
                'bg-background/60',
                blurClasses[blur],
                'rounded-2xl p-6',
                border && 'border border-foreground/10',
                hover && 'transition-all duration-300 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/5',
                className
            )}
        >
            {children}
        </div>
    );
}

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'dark' | 'light' | 'primary';
}

/**
 * Glass panel with color variants.
 * 
 * Usage:
 * ```tsx
 * <GlassPanel variant="primary">
 *   <p>Primary tinted glass</p>
 * </GlassPanel>
 * ```
 */
export function GlassPanel({
    children,
    className = '',
    variant = 'default',
}: Readonly<GlassPanelProps>) {
    const variantClasses = {
        default: 'bg-background/50',
        dark: 'bg-black/30',
        light: 'bg-white/30',
        primary: 'bg-primary/10',
    };

    return (
        <div
            className={cn(
                variantClasses[variant],
                'backdrop-blur-md rounded-xl',
                'border border-foreground/5',
                className
            )}
        >
            {children}
        </div>
    );
}

interface GlassButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Glassmorphism styled button.
 * 
 * Usage:
 * ```tsx
 * <GlassButton onClick={handleClick}>
 *   Click me
 * </GlassButton>
 * ```
 */
export function GlassButton({
    children,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}: GlassButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'px-6 py-3 rounded-xl',
                'bg-background/50 backdrop-blur-md',
                'border border-foreground/10',
                'font-medium transition-all duration-200',
                'hover:bg-background/70 hover:border-foreground/20',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
        >
            {children}
        </button>
    );
}

interface GlassInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    type?: string;
}

/**
 * Glassmorphism styled input.
 * 
 * Usage:
 * ```tsx
 * <GlassInput placeholder="Enter text..." onChange={setValue} />
 * ```
 */
export function GlassInput({
    placeholder,
    value,
    onChange,
    className = '',
    type = 'text',
}: GlassInputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
                'w-full px-4 py-3 rounded-xl',
                'bg-background/30 backdrop-blur-md',
                'border border-foreground/10',
                'text-foreground placeholder:text-foreground/40',
                'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
                'transition-all duration-200',
                className
            )}
        />
    );
}
