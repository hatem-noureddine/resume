import Link from "next/link";
import {
    Activity,
    MessageSquare,
    FileText,
    Rocket,
    BarChart3,
    Settings,
    Briefcase,
    Award,
    Languages,
} from "lucide-react";
import { getBlogPosts, getProjects, getExperience, getSkills, getLanguages, getCertifications } from "@/lib/keystatic";
import { DevToolsSection } from "@/components/admin/DevToolsSection";

interface AdminToolCard {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
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
];

interface StatCardProps {
    readonly label: string;
    readonly value: number;
    readonly icon: React.ReactNode;
    readonly href?: string;
}

function StatCard({ label, value, icon, href }: StatCardProps) {
    const content = (
        <div className="p-4 rounded-lg bg-secondary/30 border border-white/10 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

interface ToolCardProps {
    readonly title: string;
    readonly description: string;
    readonly href: string;
    readonly icon: React.ReactNode;
    readonly badge?: string;
}

function ToolCard({ title, description, href, icon, badge }: ToolCardProps) {
    return (
        <Link
            href={href}
            className="group block p-6 rounded-xl bg-secondary/30 border border-white/10 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <span className="text-primary">{icon}</span>
                </div>
                {badge && (
                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </Link>
    );
}

export default async function AdminPage() {
    // Fetch real counts from Keystatic
    const [blogPosts, projects, experience, skills, languages, certifications] = await Promise.all([
        getBlogPosts(),
        getProjects(),
        getExperience(),
        getSkills(),
        getLanguages(),
        getCertifications(),
    ]);

    const stats = [
        { label: "Blog Posts", value: blogPosts.length, icon: <FileText className="w-4 h-4" />, href: "/keystatic/collection/blog" },
        { label: "Projects", value: projects.length, icon: <BarChart3 className="w-4 h-4" />, href: "/keystatic/collection/projects" },
        { label: "Experience", value: experience.length, icon: <Briefcase className="w-4 h-4" />, href: "/keystatic/collection/experience" },
        { label: "Skills", value: skills.length, icon: <Award className="w-4 h-4" />, href: "/keystatic/collection/skills" },
        { label: "Languages", value: languages.length, icon: <Languages className="w-4 h-4" />, href: "/keystatic/collection/languages" },
        { label: "Certifications", value: certifications.length, icon: <Award className="w-4 h-4" />, href: "/keystatic/collection/certifications" },
    ];

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

            {/* Stats Overview - Now with real data! */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Content Overview
                    <span className="text-xs font-normal text-muted-foreground ml-2">(live from Keystatic)</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            href={stat.href}
                        />
                    ))}
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

            {/* Dev Tools Section (Client Component) */}
            <DevToolsSection />

            {/* Quick Actions */}
            <section className="p-6 rounded-xl bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/keystatic/collection/blog/create"
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium text-primary transition-colors"
                    >
                        + New Blog Post
                    </Link>
                    <Link
                        href="/keystatic/collection/projects/create"
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium text-primary transition-colors"
                    >
                        + New Project
                    </Link>
                    <Link
                        href="/keystatic/collection/experience/create"
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium text-primary transition-colors"
                    >
                        + New Experience
                    </Link>
                </div>
            </section>
        </div>
    );
}
