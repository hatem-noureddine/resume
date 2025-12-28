import Link from "next/link";
import {
    Activity,
    MessageSquare,
    FileText,
    Rocket,
    Users,
    BarChart3,
    Palette,
    ExternalLink,
    Settings,
} from "lucide-react";

interface AdminToolCard {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
    badge?: string;
}

const adminTools: AdminToolCard[] = [
    {
        title: "Keystatic CMS",
        description: "Manage resume content, blog posts, projects, and site settings",
        href: "/keystatic",
        icon: <FileText className="w-6 h-6" />,
        badge: "Content",
    },
    {
        title: "Performance Dashboard",
        description: "Real-time Core Web Vitals monitoring (LCP, FCP, CLS, INP, TTFB)",
        href: "/admin/performance",
        icon: <Activity className="w-6 h-6" />,
        badge: "Metrics",
    },
    {
        title: "AI Resume Assistant",
        description: "Get AI-powered suggestions to improve your resume content",
        href: "/admin/assist",
        icon: <MessageSquare className="w-6 h-6" />,
        badge: "AI",
    },
    {
        title: "Bundle Analyzer",
        description: "Analyze and optimize bundle size and dependencies",
        href: "/.next/analyze/client.html",
        icon: <BarChart3 className="w-6 h-6" />,
        external: true,
        badge: "Dev",
    },
    {
        title: "Storybook",
        description: "Component documentation and visual testing playground",
        href: "http://localhost:6006",
        icon: <Palette className="w-6 h-6" />,
        external: true,
        badge: "Dev",
    },
];

export default function AdminPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Settings className="w-7 h-7 text-primary" />
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to your admin dashboard. Manage your portfolio from here.
                </p>
            </div>

            {/* Stats Overview */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Quick Stats
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Blog Posts" value="8" icon={<FileText className="w-4 h-4" />} />
                    <StatCard label="Projects" value="6" icon={<BarChart3 className="w-4 h-4" />} />
                    <StatCard label="Languages" value="4" icon={<Users className="w-4 h-4" />} />
                    <StatCard label="Themes" value="2" icon={<Palette className="w-4 h-4" />} />
                </div>
            </section>

            {/* Admin Tools Grid */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Admin Tools
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {adminTools.map((tool) => (
                        <ToolCard key={tool.href} {...tool} />
                    ))}
                </div>
            </section>

            {/* Help Section */}
            <section className="p-6 rounded-xl bg-secondary/30 border border-white/10">
                <h3 className="font-semibold mb-2">💡 Getting Started</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• <strong>Keystatic CMS</strong> - Edit your resume data, blog posts, and projects</li>
                    <li>• <strong>Performance Dashboard</strong> - Monitor Core Web Vitals in real-time</li>
                    <li>• <strong>AI Assistant</strong> - Get suggestions to improve your content</li>
                    <li>• <strong>Bundle Analyzer</strong> - Run <code className="bg-secondary px-1 rounded">npm run analyze</code> first</li>
                    <li>• <strong>Storybook</strong> - Run <code className="bg-secondary px-1 rounded">npm run storybook</code> first</li>
                </ul>
            </section>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="p-4 rounded-lg bg-secondary/30 border border-white/10">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

function ToolCard({ title, description, href, icon, external, badge }: AdminToolCard) {
    const CardWrapper = external ? 'a' : Link;
    const cardProps = external
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : { href };

    return (
        <CardWrapper
            {...cardProps}
            className="group block p-6 rounded-xl bg-secondary/30 border border-white/10 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <span className="text-primary">{icon}</span>
                </div>
                <div className="flex items-center gap-2">
                    {badge && (
                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                            {badge}
                        </span>
                    )}
                    {external && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardWrapper>
    );
}
