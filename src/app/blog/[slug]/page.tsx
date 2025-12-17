import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPostData, getPostSlugs, extractHeadings, getSortedPostsData } from "@/lib/posts";
import { SITE_CONFIG } from "@/config/site";
import { Calendar, Tag, Clock } from "lucide-react";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/JsonLd";

import { ShareButtons } from "@/components/ui/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { markdownComponents } from "./markdown-components";
import { StarRating } from "@/components/ui/StarRating";
import { Comments } from "@/components/blog/Comments";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import type { Metadata } from 'next';

// Generate unique metadata for each blog post
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    const ogImageUrl = `${SITE_CONFIG.url}api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;

    return {
        title: `${post.title} | ${SITE_CONFIG.name}`,
        description: post.description,
        keywords: post.tags,
        authors: [{ name: SITE_CONFIG.name }],
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: `${SITE_CONFIG.url}blog/${slug}`,
            siteName: SITE_CONFIG.name,
            publishedTime: post.date,
            authors: [SITE_CONFIG.name],
            tags: post.tags,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [ogImageUrl],
        },
        alternates: {
            canonical: `${SITE_CONFIG.url}blog/${slug}`,
        },
    };
}



export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return <div>Post not found</div>;
    }

    // Extract headings from markdown content for TOC
    const headings = extractHeadings(post.content);

    // Get all posts for related posts section
    const allPosts = await getSortedPostsData();

    return (
        <main className="min-h-screen bg-background pb-20">
            <ReadingProgress />

            {/* Scroll Progress Indicator - removed ad-hoc implementation in favor of component */}

            {/* Hero Section */}
            <Header />
            <article className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl flex flex-col xl:flex-row gap-12">
                    {/* Sticky TOC on Desktop */}
                    <aside className="hidden xl:block w-64 shrink-0 order-2">
                        <div className="sticky top-32">
                            <TableOfContents headings={headings} />
                        </div>
                    </aside>

                    <div className="flex-1 max-w-4xl order-1">
                        <div className="mb-8 text-center">
                            <Link href="/blog" className="inline-block text-sm text-muted-foreground hover:text-primary mb-8">
                                &larr; Back to Blog
                            </Link>
                            {/* Category badge */}
                            <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/20">
                                {post.category}
                            </span>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="w-1 h-1 bg-primary/50 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>{post.readingTime}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
                                {post.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                                {post.description}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {post.tags.map((tag, index) => {
                                    // Alternate tag colors for visual interest
                                    const colors = [
                                        'bg-primary/10 text-primary border-primary/20',
                                        'bg-purple-500/10 text-purple-400 border-purple-500/20',
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                    ];
                                    const colorClass = colors[index % colors.length];
                                    return (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                            <ShareButtons
                                url={`${SITE_CONFIG.url}/blog/${slug}`}
                                title={post.title}
                                description={post.description}
                                className="mt-6 justify-center"
                            />
                        </div>

                        {/* Mobile TOC - Collapsible or Inline */}
                        <div className="xl:hidden mb-8">
                            {/* <TableOfContents headings={headings} /> */}
                        </div>

                        <div className="bg-secondary/20 p-8 md:p-12 rounded-2xl border border-white/5">
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Did you find this helpful?
                                </h3>
                                <StarRating postSlug={slug} size="lg" />
                            </div>
                        </div>

                        <Comments />
                    </div>
                </div>
            </article>
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", item: SITE_CONFIG.url },
                    { name: "Blog", item: `${SITE_CONFIG.url}blog` },
                    { name: post.title, item: `${SITE_CONFIG.url}blog/${slug}` },
                ]}
            />
            <ArticleJsonLd
                url={`${SITE_CONFIG.url}blog/${slug}`}
                title={post.title}
                images={[`${SITE_CONFIG.url}og-image.png`]}
                datePublished={post.date}
                description={post.description}
                authorName={SITE_CONFIG.name}
            />
            <div className="container mx-auto max-w-6xl px-4 pb-16">
                <RelatedPosts posts={allPosts} currentSlug={slug} />
            </div>
            <Footer />
        </main >
    );
}

export async function generateStaticParams() {
    try {
        const slugs = await getPostSlugs();
        return slugs.map((slug) => ({
            slug: slug,
        }));
    } catch (error) {
        console.error("Error in generateStaticParams:", error);
        return [];
    }
}
