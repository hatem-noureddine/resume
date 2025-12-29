"use client";

import Link from "next/link";
import {
    ChevronLeft,
    Activity,
    MessageSquare,
    Moon,
    Sun,
    Search,
    Command,
    Settings,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { CommandPalette, useCommandPalette } from "./CommandPalette";

interface AdminBarProps {
    readonly currentPage?: string;
}

export function AdminBar({ currentPage = "Keystatic CMS" }: AdminBarProps) {
    const { theme, setTheme } = useTheme();
    const commandPalette = useCommandPalette();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <>
            {/* Command Palette (global) */}
            <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />

            {/* Admin Bar */}
            <div className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-white/10 px-4 py-2">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    {/* Left: Back to Admin */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin</span>
                        </Link>

                        <div className="h-4 w-px bg-white/10" />

                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{currentPage}</span>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex items-center gap-2">
                        {/* Quick Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/admin/performance"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                                title="Performance Dashboard"
                            >
                                <Activity className="w-3.5 h-3.5" />
                                <span>Performance</span>
                            </Link>
                            <Link
                                href="/admin/assist"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                                title="AI Assistant"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>AI Assist</span>
                            </Link>
                        </div>

                        <div className="h-4 w-px bg-white/10 hidden md:block" />

                        {/* Command Palette Trigger */}
                        <button
                            onClick={commandPalette.open}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                            title="Command Palette (⌘K)"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px]">
                                <Command className="w-2.5 h-2.5" />K
                            </kbd>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            suppressHydrationWarning
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
