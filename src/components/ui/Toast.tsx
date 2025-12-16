"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: "success" | "error" | "info";
    duration?: number;
}

export function Toast({
    message,
    isVisible,
    onClose,
    type = "success",
    duration = 4000
}: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    const variants = {
        success: "bg-emerald-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white"
    };

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info
    };

    const Icon = icons[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className={cn(
                        "fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3",
                        variants[type]
                    )}
                >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
