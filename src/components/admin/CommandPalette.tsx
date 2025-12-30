"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Home,
    FileText,
    Activity,
    MessageSquare,
    BarChart3,
    Palette,
    X,
    ArrowRight,
    Command,
} from "lucide-react";

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
    keywords?: string[];
}

interface CommandPaletteProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const navigate = useCallback((path: string) => {
        router.push(path);
        onClose();
    }, [router, onClose]);

    const openExternal = useCallback((url: string) => {
        window.open(url, "_blank");
        onClose();
    }, [onClose]);

    const commands: CommandItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            description: "Go to admin dashboard",
            icon: <Home className="w-4 h-4" />,
            action: () => navigate("/admin"),
            keywords: ["home", "main"],
        },
        {
            id: "keystatic",
            label: "Keystatic CMS",
            description: "Manage content",
            icon: <FileText className="w-4 h-4" />,
            action: () => navigate("/keystatic"),
            keywords: ["content", "cms", "edit", "blog", "projects"],
        },
        {
            id: "performance",
            label: "Performance Dashboard",
            description: "Core Web Vitals",
            icon: <Activity className="w-4 h-4" />,
            action: () => navigate("/admin/performance"),
            keywords: ["vitals", "speed", "metrics", "lcp", "fcp"],
        },
        {
            id: "assist",
            label: "AI Assistant",
            description: "Content suggestions",
            icon: <MessageSquare className="w-4 h-4" />,
            action: () => navigate("/admin/assist"),
            keywords: ["ai", "suggestions", "help", "improve"],
        },
        {
            id: "site",
            label: "View Site",
            description: "Open main website",
            icon: <ArrowRight className="w-4 h-4" />,
            action: () => navigate("/"),
            keywords: ["website", "frontend", "public"],
        },
        {
            id: "blog",
            label: "Blog",
            description: "View blog posts",
            icon: <FileText className="w-4 h-4" />,
            action: () => navigate("/blog"),
            keywords: ["posts", "articles"],
        },
        {
            id: "portfolio",
            label: "Portfolio",
            description: "View projects",
            icon: <BarChart3 className="w-4 h-4" />,
            action: () => navigate("/portfolio"),
            keywords: ["projects", "work"],
        },
        {
            id: "storybook",
            label: "Storybook",
            description: "Component playground",
            icon: <Palette className="w-4 h-4" />,
            action: () => openExternal("http://localhost:6006"),
            keywords: ["components", "ui", "design"],
        },
    ];

    const filteredCommands = commands.filter((cmd) => {
        const searchLower = search.toLowerCase();
        return (
            cmd.label.toLowerCase().includes(searchLower) ||
            cmd.description?.toLowerCase().includes(searchLower) ||
            cmd.keywords?.some((k) => k.includes(searchLower))
        );
    });

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    // Reset search when closed
    // Search is reset in onClose handler instead of effect to avoid cascading renders

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <button
                type="button"
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-default"
                onClick={onClose}
                aria-label="Close command palette"
            />

            {/* Command Palette */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
                <div className="mx-4 bg-secondary/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-80 overflow-y-auto p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="px-4 py-8 text-center text-muted-foreground">
                                No commands found for &ldquo;{search}&rdquo;
                            </div>
                        ) : (
                            filteredCommands.map((cmd) => (
                                <button
                                    key={cmd.id}
                                    onClick={cmd.action}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                                >
                                    <span className="text-muted-foreground">{cmd.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{cmd.label}</div>
                                        {cmd.description && (
                                            <div className="text-xs text-muted-foreground truncate">
                                                {cmd.description}
                                            </div>
                                        )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                            <span>to select</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                            <span>to close</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface CommandTriggerProps {
    readonly onClick: () => void;
}

export function CommandTrigger({ onClick }: CommandTriggerProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-white/10"
        >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/10 rounded text-[10px]">
                <Command className="w-2.5 h-2.5" />K
            </kbd>
        </button>
    );
}

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
    };
}
