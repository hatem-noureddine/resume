import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSortedPostsData, getPostData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Tag } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostData(slug);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <main className="min-h-screen">
            <Header />
            <article className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <Link href="/blog" className="inline-block text-sm text-muted-foreground hover:text-primary mb-8">
                            &larr; Back to Blog
                        </Link>
                        <div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
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

                    <div className="bg-secondary/20 p-8 md:p-12 rounded-2xl border border-white/5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom Image component
                                img: ({ node, ...props }) => {
                                    return (
                                        <span className="block my-8 relative w-full aspect-video rounded-xl overflow-hidden bg-secondary">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {props.src && (
                                                <Image
                                                    src={props.src as string}
                                                    alt={props.alt || ""}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 896px"
                                                />
                                            )}
                                        </span>
                                    );
                                },
                                // Custom Link
                                a: ({ node, ...props }) => (
                                    <a {...props} className="text-primary hover:underline transition-colors font-medium cursor-pointer" target="_blank" rel="noopener noreferrer" />
                                ),
                                // Custom Headings
                                h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-bold mt-12 mb-6 text-foreground" />,
                                h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-10 mb-5 text-foreground" />,
                                h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold mt-8 mb-4 text-foreground" />,
                                // Custom Paragraph
                                p: ({ node, ...props }) => <p {...props} className="mb-6 leading-relaxed text-muted-foreground text-lg" />,
                                // Custom Lists
                                ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-6 text-muted-foreground space-y-2" />,
                                ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-6 text-muted-foreground space-y-2" />,
                                li: ({ node, ...props }) => <li {...props} className="pl-2" />,
                                // Custom Blockquote
                                blockquote: ({ node, ...props }) => (
                                    <blockquote {...props} className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-white/80 bg-primary/5 rounded-r-lg" />
                                ),
                                // Custom Code Inline
                                code: ({ node, ...props }) => (
                                    <code {...props} className="px-1.5 py-0.5 rounded bg-secondary-foreground/20 text-primary font-mono text-sm" />
                                ),
                                // Custom Table
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-8 rounded-lg border border-white/10">
                                        <table {...props} className="w-full text-left border-collapse" />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => <thead {...props} className="bg-secondary/50" />,
                                tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-white/5" />,
                                tr: ({ node, ...props }) => <tr {...props} className="hover:bg-white/5 transition-colors" />,
                                th: ({ node, ...props }) => <th {...props} className="p-4 font-semibold text-foreground border-b border-white/10 whitespace-nowrap" />,
                                td: ({ node, ...props }) => <td {...props} className="p-4 text-muted-foreground border-b border-white/5" />,
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
            <Footer />
        </main>
    );
}
