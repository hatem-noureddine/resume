import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { getSortedPostsData } from "@/lib/posts";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { SectionSkeleton, PortfolioSkeleton, ExperienceSkeleton, SkillsSkeleton } from "@/components/ui/SectionSkeleton";

// Lazy load below-the-fold sections to improve initial load performance
const Services = dynamic(() => import("@/components/sections/Services").then((mod) => mod.Services), {
  loading: () => <SectionSkeleton />
});
const Experience = dynamic(() => import("@/components/sections/Experience").then((mod) => mod.Experience), {
  loading: () => <ExperienceSkeleton />
});
const Portfolio = dynamic(() => import("@/components/sections/Portfolio").then((mod) => mod.Portfolio), {
  loading: () => <PortfolioSkeleton />
});
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact), {
  loading: () => <SectionSkeleton />
});
const Skills = dynamic(() => import("@/components/sections/Skills").then((mod) => mod.Skills), {
  loading: () => <SkillsSkeleton />
});
const Blog = dynamic(() => import("@/components/sections/Blog").then((mod) => mod.Blog), {
  loading: () => <SectionSkeleton />
});

export default async function Home() {
  const posts = await getSortedPostsData();
  const hasBlogPosts = posts.length > 0;

  return (
    <main id="main-content" className="min-h-screen">
      <Header hasBlogPosts={hasBlogPosts} />
      <Hero />

      {/* Wave divider after Hero */}
      <div className="bg-secondary/10">
        <WaveDivider className="-mt-1" color="background" flip />
      </div>

      <ScrollReveal>
        <Services />
      </ScrollReveal>

      {/* Wave divider after Services */}
      <WaveDivider color="secondary" />

      <ScrollReveal>
        <Experience />
      </ScrollReveal>

      <ScrollReveal>
        <Skills />
      </ScrollReveal>

      {/* Wave divider before Portfolio */}
      <WaveDivider color="background" flip />

      <ScrollReveal>
        <Portfolio />
      </ScrollReveal>

      <ScrollReveal>
        <Blog posts={posts} />
      </ScrollReveal>

      {/* Wave divider before Contact */}
      <WaveDivider color="secondary" />

      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <Footer hasBlogPosts={hasBlogPosts} />
      <FloatingActions />
    </main>
  );
}
