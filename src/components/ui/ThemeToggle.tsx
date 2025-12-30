"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const isDark = theme === "dark";

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9 opacity-50 cursor-default">
                <span className="sr-only">Toggle theme</span>
                <Sun className="h-[1.2rem] w-[1.2rem] opacity-0" />
            </Button>
        );
    }

    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="relative w-9 h-9 rounded-full border border-foreground/10 hover:bg-foreground/10 text-foreground overflow-hidden"
                aria-label="Toggle theme"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ y: -20, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute"
                        >
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: -20, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </motion.div>
    );
}
