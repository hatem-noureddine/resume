"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Settings,
    Activity,
    MessageSquare,
    FileText,
    ChevronRight,
    Menu,
    X,
    Home,
    BarChart3,
    Palette,
    ExternalLink,
    ChevronLeft,
    Moon,
    Sun,
} from "lucide-react";
import { CommandPalette, CommandTrigger, useCommandPalette } from "./CommandPalette";
import { useTheme } from "@/context/ThemeContext";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
    badge?: string;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: <Home className="w-5 h-5" />,
    },
    {
        label: "Keystatic CMS",
        href: "/keystatic",
        icon: <FileText className="w-5 h-5" />,
        badge: "Content",
    },
    {
        label: "Performance",
        href: "/admin/performance",
        icon: <Activity className="w-5 h-5" />,
        badge: "Metrics",
    },
    {
        label: "AI Assistant",
        href: "/admin/assist",
        icon: <MessageSquare className="w-5 h-5" />,
        badge: "AI",
    },
    {
        label: "Bundle Analyzer",
        href: "/.next/analyze/client.html",
        icon: <BarChart3 className="w-5 h-5" />,
        external: true,
        badge: "Dev",
    },
    {
        label: "Storybook",
        href: "http://localhost:6006",
        icon: <Palette className="w-5 h-5" />,
        external: true,
        badge: "Dev",
    },
];

// Breadcrumb mapping for known routes
const breadcrumbLabels: Record<string, string> = {
    admin: "Admin",
    performance: "Performance",
    assist: "AI Assistant",
    keystatic: "Keystatic CMS",
};

interface AdminLayoutProps {
    readonly children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const commandPalette = useCommandPalette();

    // Generate breadcrumbs from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const label = breadcrumbLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        return { label, href };
    });

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Command Palette */}
            <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-secondary/80 backdrop-blur-sm border border-white/10 md:hidden"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-default"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-secondary/95 backdrop-blur-md border-r border-white/10 z-40
                    transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-sm">Admin Dashboard</h1>
                            <p className="text-xs text-muted-foreground">Manage Portfolio</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const LinkComponent = item.external ? "a" : Link;
                        const linkProps = item.external
                            ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                            : { href: item.href };

                        return (
                            <LinkComponent
                                key={item.href}
                                {...linkProps}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                                    ${isActive
                                        ? "bg-primary/20 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    }
                                `}
                            >
                                <span className={isActive ? "text-primary" : ""}>{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary/80 rounded">
                                        {item.badge}
                                    </span>
                                )}
                                {item.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                            </LinkComponent>
                        );
                    })}
                </nav>

                {/* Theme Toggle & Back to Site */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                        {theme === "dark" ? (
                            <>
                                <Sun className="w-4 h-4" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="w-4 h-4" />
                                Dark Mode
                            </>
                        )}
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64">
                {/* Breadcrumbs Header */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10">
                    <div className="px-4 md:px-6 py-3 flex items-center justify-between">
                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
                            <Link
                                href="/"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Home className="w-4 h-4" />
                            </Link>
                            {breadcrumbs.map((crumb, index) => (
                                <span key={crumb.href} className="flex items-center gap-1">
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                    {index === breadcrumbs.length - 1 ? (
                                        <span className="font-medium text-foreground">
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link
                                            href={crumb.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </span>
                            ))}
                        </nav>

                        {/* Command Palette Trigger */}
                        <CommandTrigger onClick={commandPalette.open} />
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
