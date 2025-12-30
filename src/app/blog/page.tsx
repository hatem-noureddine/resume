import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSortedPostsData } from "@/lib/posts";
import { BlogList } from "@/components/blog/BlogList";

export default async function BlogPage() {
    const posts = await getSortedPostsData();

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            <Header />
            <section className="pt-28 pb-20 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <BlogList initialPosts={posts} />
                </div>
            </section>
            <Footer />
        </main>
    );
}
