"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 h-5 px-1">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut"
                    }}
                    className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                />
            ))}
        </div>
    );
}
