import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getProjects } from "@/lib/keystatic";
import { PortfolioClient } from "./PortfolioClient";

export default async function PortfolioPage() {
    const ksProjects = await getProjects();

    const mappedProjects = ksProjects.map((p, index) => ({
        id: `project-${p.slug || index}`,
        title: p.entry.title,
        category: p.entry.category || "Project",
        image: p.entry.image || "/images/placeholder.jpg",
        link: p.entry.link || "#",
        slug: p.slug,
        language: p.entry.language || "en",
    }));

    return (
        <main className="min-h-screen pb-20 bg-background">
            <Header />

            <section className="pt-28 pb-12 container mx-auto px-4">
                <PortfolioClient items={mappedProjects} />
            </section>

            <Footer />
        </main>
    );
}
