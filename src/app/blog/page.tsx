import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSortedPostsData } from "@/lib/posts";
import { BlogList } from "@/components/blog/BlogList";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function BlogPage() {
    const posts = getSortedPostsData();

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            <Header />
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            My <span className="text-primary">Blog</span>
                        </h1>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <SectionHeading
                            title="Blog"
                            subtitle="Detailed Insights"
                            className="mb-12"
                        />
                        <BlogList initialPosts={posts} />
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
