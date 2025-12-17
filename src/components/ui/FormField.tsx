'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Reusable Input component with label, error, and helper text support.
 * 
 * Usage:
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   error={errors.email}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        const baseClasses = "w-full px-4 py-3 bg-secondary/30 border rounded-xl transition-all text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2";
        const normalClasses = "border-foreground/10 focus:ring-primary/50 focus:border-primary";
        const errorClasses = "border-red-500 focus:ring-red-500/50 focus:border-red-500";

        return (
            <div className="space-y-1">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${inputId}-helper`} className="text-sm text-foreground/60">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Reusable Textarea component with label, error, and helper text support.
 * 
 * Usage:
 * ```tsx
 * <Textarea
 *   label="Message"
 *   placeholder="Your message..."
 *   rows={5}
 *   error={errors.message}
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', id, ...props }, ref) => {
        const textareaId = id || props.name;

        const baseClasses = "w-full px-4 py-3 bg-secondary/30 border rounded-xl transition-all text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 resize-none";
        const normalClasses = "border-foreground/10 focus:ring-primary/50 focus:border-primary";
        const errorClasses = "border-red-500 focus:ring-red-500/50 focus:border-red-500";

        return (
            <div className="space-y-1">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${textareaId}-helper`} className="text-sm text-foreground/60">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';
