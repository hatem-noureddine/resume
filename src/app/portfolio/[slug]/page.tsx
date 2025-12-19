import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getProjectBySlug, getProjectSlugs } from "@/lib/keystatic";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Tag, Sparkles } from "lucide-react";
import { DocumentRenderer } from '@keystatic/core/renderer';
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from 'next';

interface Project {
    title: string;
    category: string;
    description: string;
    image: string;
    link?: string;
    technologies?: string[];
    gallery?: string[];
    content: () => Promise<unknown>;
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug) as unknown as Project;

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    const ogImageUrl = `${SITE_CONFIG.url}api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.description)}&category=${encodeURIComponent(project.category)}`;

    return {
        title: `${project.title} | ${SITE_CONFIG.name}`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            url: `${SITE_CONFIG.url}portfolio/${slug}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: [ogImageUrl],
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug) as unknown as Project;

    if (!project) return notFound();

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <article className="pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
                <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-purple-500/5 blur-3xl rounded-full" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    {/* Back Link */}
                    <div className="mb-12">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-secondary-foreground hover:text-primary transition-colors group"
                        >
                            <span className="p-2 rounded-full bg-secondary/30 group-hover:bg-primary/10 transition-colors">
                                <ArrowLeft size={20} />
                            </span>
                            <span className="font-medium">Back to Portfolio</span>
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-6 uppercase tracking-wider">
                                <Sparkles size={14} />
                                {project.category}
                            </span>

                            <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-8 leading-[1.1]">
                                <span className="text-gradient">{project.title}</span>
                            </h1>


                            <p className="text-xl text-secondary-foreground mb-10 leading-relaxed md:text-justify max-w-2xl">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
                                    >
                                        View Live Project
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/5 group">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <div className="bg-secondary/10 p-8 md:p-12 rounded-4xl border border-white/5 shadow-xl">
                                <h2 className="text-3xl font-bold font-outfit mb-8 pb-4 border-b border-foreground/10 flex items-center gap-3">
                                    Project Story
                                </h2>
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-outfit prose-primary">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    <DocumentRenderer document={await project.content() as any} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Tech Stack */}
                            {project.technologies && project.technologies.length > 0 && (
                                <section className="p-8 rounded-3xl bg-secondary/10 border border-white/5">
                                    <h3 className="text-2xl font-bold font-outfit mb-6 flex items-center gap-3 text-foreground">
                                        <Tag size={20} className="text-primary" />
                                        Core Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {(project.technologies as string[]).map(tech => (
                                            <span
                                                key={tech}
                                                className="px-4 py-2 bg-background border border-foreground/10 rounded-xl text-sm font-medium hover:border-primary/50 transition-colors shadow-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Gallery */}
                            {project.gallery && project.gallery.length > 0 && (
                                <section className="p-8 rounded-3xl bg-secondary/10 border border-white/5">
                                    <h3 className="text-2xl font-bold font-outfit mb-6 text-foreground">Snapshot Gallery</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(project.gallery as string[]).map((img, i) => (
                                            <div key={img} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg">
                                                <Image
                                                    src={img}
                                                    alt={`Gallery ${project.title} - snapshot ${i + 1}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 100vw, 320px"
                                                />
                                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}

export async function generateStaticParams() {
    try {
        const slugs = await getProjectSlugs();
        return slugs.map(slug => ({ slug }));
    } catch (e) {
        console.error("Error generating project static params:", e);
        return [];
    }
}
