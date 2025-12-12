import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Portfolio } from "@/components/sections/Portfolio";
import { Contact } from "@/components/sections/Contact";
import { Skills } from "@/components/sections/Skills";
import { Cooperation } from "@/components/sections/Cooperation";
import { Blog } from "@/components/sections/Blog";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const posts = getSortedPostsData();
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Experience />
      <Skills />
      <Portfolio />
      <Cooperation />
      <Blog posts={posts} />
      <Contact />
      <Footer />
    </main>
  );
}
