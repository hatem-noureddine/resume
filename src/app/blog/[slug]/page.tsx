import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPostData, getPostSlugs } from "@/lib/posts";
import { SITE_CONFIG } from "@/config/site";
import { Calendar, Tag, Clock } from "lucide-react";
import Link from 'next/link';
import { BlurImage } from "@/components/ui/BlurImage";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";



export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return <div>Post not found</div>;
    }

    // TOC generation might need adjustment for AST.
    // For now, let's skip automatic TOC generation from AST or implement a simple one if possible.
    // Keystatic doesn't expose raw text easily for regex.
    // We will provide an empty array or try to traverse the AST if critical.
    // Let's use empty headings for now to avoid build break, and mark as TODO.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const headings: { id: string; text: string; level: number }[] = []; // TOC disabled pending markdown parsing

    return (
        <main className="min-h-screen">
            <Header />
            <article className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl flex flex-col xl:flex-row gap-12">
                    {/* Sticky TOC on Desktop */}
                    <aside className="hidden xl:block w-64 shrink-0 order-2">
                        <div className="sticky top-32">
                            {/* TOC disabled temporarily due to AST change */}
                            {/* <TableOfContents headings={headings} /> */}
                        </div>
                    </aside>

                    <div className="flex-1 max-w-4xl order-1">
                        <div className="mb-8 text-center">
                            <Link href="/blog" className="inline-block text-sm text-muted-foreground hover:text-primary mb-8">
                                &larr; Back to Blog
                            </Link>
                            <div className="flex items-center justify-center gap-4 text-sm text-primary mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readingTime}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
                            <div className="flex flex-wrap justify-center gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mobile TOC - Collapsible or Inline */}
                        <div className="xl:hidden mb-8">
                            {/* <TableOfContents headings={headings} /> */}
                        </div>

                        <div className="bg-secondary/20 p-8 md:p-12 rounded-2xl border border-white/5">
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ src, alt }) => (
                                            <span className="block my-8 relative w-full aspect-video rounded-xl overflow-hidden bg-secondary">
                                                <BlurImage
                                                    src={(src as string) || ''}
                                                    alt={alt || ''}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 896px"
                                                />
                                            </span>
                                        ),
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-white/80 bg-primary/5 rounded-r-lg">
                                                {children}
                                            </blockquote>
                                        ),
                                        h1: ({ children }) => <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-5 text-foreground scroll-mt-32">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4 text-foreground scroll-mt-32">{children}</h3>,
                                        h4: ({ children }) => <h4 className="text-lg font-bold mt-6 mb-3 text-foreground">{children}</h4>,
                                        a: ({ href, children }) => (
                                            <a href={href} className="text-primary hover:underline transition-colors font-medium cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                {children}
                                            </a>
                                        ),
                                        code: ({ children, className }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return (
                                                <code className={`px-1.5 py-0.5 rounded bg-secondary-foreground/20 text-primary font-mono text-sm ${className || ''}`}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>
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
            <Footer />
        </main>
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
