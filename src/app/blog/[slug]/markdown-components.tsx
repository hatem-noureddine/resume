import { BlurImage } from "@/components/ui/BlurImage";
import { CodeBlockLegacy } from "@/components/ui/CodeBlock";

interface MarkdownProps {
    children?: React.ReactNode;
    src?: string;
    alt?: string;
    href?: string;
    className?: string;
}

export const markdownComponents: Record<string, React.FC<MarkdownProps>> = {
    img: ({ src, alt }: MarkdownProps) => (
        <span className="block my-8 relative w-full aspect-video rounded-xl overflow-hidden bg-secondary">
            <BlurImage
                src={src || ''}
                alt={alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 896px"
            />
        </span>
    ),
    blockquote: ({ children }: MarkdownProps) => (
        <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 italic text-lg text-white/90 bg-linear-to-r from-primary/10 to-purple-500/10 rounded-r-xl">
            {children}
        </blockquote>
    ),
    h1: ({ children }: MarkdownProps) => {
        const id = String(children).toLowerCase().replaceAll(/[^a-z0-9\s-]/g, '').replaceAll(/\s+/g, '-').replaceAll(/-+/g, '-');
        return <h1 id={id} className="text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-32">{children}</h1>;
    },
    h2: ({ children }: MarkdownProps) => {
        const id = String(children).toLowerCase().replaceAll(/[^a-z0-9\s-]/g, '').replaceAll(/\s+/g, '-').replaceAll(/-+/g, '-');
        return <h2 id={id} className="text-2xl font-bold mt-10 mb-5 text-foreground scroll-mt-32">{children}</h2>;
    },
    h3: ({ children }: MarkdownProps) => {
        const id = String(children).toLowerCase().replaceAll(/[^a-z0-9\s-]/g, '').replaceAll(/\s+/g, '-').replaceAll(/-+/g, '-');
        return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-foreground scroll-mt-32">{children}</h3>;
    },
    h4: ({ children }: MarkdownProps) => {
        const id = String(children).toLowerCase().replaceAll(/[^a-z0-9\s-]/g, '').replaceAll(/\s+/g, '-').replaceAll(/-+/g, '-');
        return <h4 id={id} className="text-lg font-bold mt-6 mb-3 text-foreground scroll-mt-32">{children}</h4>;
    },
    a: ({ href, children }: MarkdownProps) => (
        <a href={href} className="text-primary hover:underline transition-colors font-medium cursor-pointer" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
    code: ({ children, className }: MarkdownProps) => {
        // Check if this is a block code (inside pre) or inline
        const isInline = !className;
        if (isInline) {
            return (
                <code className="px-1.5 py-0.5 rounded bg-secondary-foreground/20 text-primary font-mono text-sm">
                    {children}
                </code>
            );
        }
        return (
            <CodeBlockLegacy className={className}>
                {children}
            </CodeBlockLegacy>
        );
    },
    pre: ({ children }: MarkdownProps) => <>{children}</>,
};
