'use client';

import { useEffect, useRef, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

/**
 * Accessible modal component with animation and keyboard support.
 * 
 * Usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
 *   <p>Modal content here</p>
 * </Modal>
 * ```
 */
export function Modal({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
    className = '',
}: Readonly<ModalProps>) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const sizeClasses: Record<string, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
    };

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // Focus trap and restoration
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previousActiveElement.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleOverlayClick}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby={title ? 'modal-title' : undefined}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        aria-hidden="true"
                    />

                    {/* Modal content */}
                    <motion.div
                        ref={modalRef}
                        className={`relative w-full ${sizeClasses[size]} bg-background rounded-2xl shadow-2xl border border-foreground/10 ${className}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        tabIndex={-1}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-4 border-b border-foreground/10">
                                {title && (
                                    <h2 id="modal-title" className="text-xl font-semibold font-outfit">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-secondary/30 transition-colors ml-auto"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-4">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use portal to render modal at document root
    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(modalContent, document.body);
}
