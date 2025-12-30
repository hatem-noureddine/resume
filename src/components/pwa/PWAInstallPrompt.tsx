"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt component - shows an install banner when the app is installable.
 * Automatically detects when the browser's beforeinstallprompt event fires.
 */
export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const checkStandalone = () => {
            const standalone = globalThis.matchMedia('(display-mode: standalone)').matches
                || ('standalone' in globalThis.navigator && (globalThis.navigator as Navigator & { standalone?: boolean }).standalone)
                || document.referrer.includes('android-app://');
            setIsStandalone(standalone);
        };
        checkStandalone();

        // Check if iOS
        const checkIOS = () => {
            const ua = globalThis.navigator.userAgent;
            const isIOSDevice = /iPhone|iPad|iPod/.test(ua);
            setIsIOS(isIOSDevice);
        };
        checkIOS();

        // Listen for the install prompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after a delay (don't interrupt immediately)
            setTimeout(() => {
                // Check if user hasn't dismissed before
                const dismissed = localStorage.getItem('pwa-prompt-dismissed');
                if (!dismissed) {
                    setShowPrompt(true);
                }
            }, 5000);
        };

        globalThis.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            globalThis.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setShowPrompt(false);
                setDeferredPrompt(null);
            }
        } catch (error) {
            console.error('Install prompt error:', error);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    // Show iOS-specific instructions
    const handleIOSInstructions = () => {
        setShowPrompt(true);
    };

    // Don't show if already installed
    if (isStandalone) {
        return null;
    }

    // For iOS, show a manual install hint
    if (isIOS && !showPrompt) {
        return (
            <button
                onClick={handleIOSInstructions}
                className="hidden" // Hidden by default, can be triggered elsewhere
                aria-label="Install App"
            >
                Install App
            </button>
        );
    }

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
                >
                    <div className="bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl p-5 overflow-hidden">
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-purple-500 to-pink-500" />

                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Smartphone size={24} className="text-primary" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold mb-1">
                                    Install App
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {isIOS
                                        ? 'Tap the share button and select "Add to Home Screen"'
                                        : 'Install for quick access and offline viewing'
                                    }
                                </p>

                                <div className="flex items-center gap-2">
                                    {!isIOS && (
                                        <motion.button
                                            onClick={handleInstall}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Download size={16} />
                                            Install
                                        </motion.button>
                                    )}
                                    <button
                                        onClick={handleDismiss}
                                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {isIOS ? 'Got it' : 'Not now'}
                                    </button>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Dismiss"
                            >
                                <X size={18} className="text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
