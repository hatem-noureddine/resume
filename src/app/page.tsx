import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { getSortedPostsData } from "@/lib/posts";

// Lazy load below-the-fold sections to improve initial load performance
const Services = dynamic(() => import("@/components/sections/Services").then((mod) => mod.Services));
const Experience = dynamic(() => import("@/components/sections/Experience").then((mod) => mod.Experience));
const Portfolio = dynamic(() => import("@/components/sections/Portfolio").then((mod) => mod.Portfolio));
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact));
const Skills = dynamic(() => import("@/components/sections/Skills").then((mod) => mod.Skills));
const Blog = dynamic(() => import("@/components/sections/Blog").then((mod) => mod.Blog));

export default function Home() {
  const posts = getSortedPostsData();
  const hasBlogPosts = posts.length > 0;

  return (
    <main id="main-content" className="min-h-screen">
      <Header hasBlogPosts={hasBlogPosts} />
      <Hero />
      <Services />
      <Experience />
      <Skills />
      <Portfolio />

      <Blog posts={posts} />
      <Contact />
      <Footer hasBlogPosts={hasBlogPosts} />
    </main>
  );
}
