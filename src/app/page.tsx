import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { getSortedPostsData } from "@/lib/posts";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { FloatingAccessibility } from "@/components/layout/FloatingAccessibility";
import { VoiceNavigation } from "@/components/accessibility/VoiceNavigation";
import { SectionSkeleton, PortfolioSkeleton, ExperienceSkeleton, SkillsSkeleton } from "@/components/ui/SectionSkeleton";
import { Feature } from "@/context/FeatureFlags";
import { SectionTracker } from "@/components/ui/SectionTracker";

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
const Skills = dynamic(() => import("@/components/sections/Skills").then((mod) => mod.Skills), {
  loading: () => <SkillsSkeleton />
});
const Blog = dynamic(() => import("@/components/sections/Blog").then((mod) => mod.Blog), {
  loading: () => <SectionSkeleton />
});
const TestimonialsSection = dynamic(() => import("@/components/sections/Testimonials").then((mod) => mod.Testimonials), { // Added dynamic import for Testimonials
  loading: () => <SectionSkeleton />
});
const CertificationsSection = dynamic(() => import("@/components/sections/Certifications").then((mod) => mod.Certifications), {
  loading: () => <SectionSkeleton />
});

import {
  getBlogPosts,
  getProjects,
  getExperience,
  getSkills,
  getResumes,
  getTestimonials,
  getCertifications
} from "@/lib/keystatic";
interface KeystaticEntry<T> {
  slug: string;
  entry: T;
}

interface BlogPostEntry {
  title: string;
  date: string;
  description: string;
  tags: readonly string[];
  category: string;
  content: string | (() => Promise<unknown>);
  language: string;
}

interface ProjectEntry {
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  technologies: readonly string[];
  gallery: readonly string[];
  content: () => Promise<unknown>;
  language: string;
}

interface ExperienceEntry {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: readonly string[];
  isProfessional: boolean;
  skills: readonly string[];
  language: string;
}

interface SkillEntry {
  name: string;
  category: "frontend" | "backend" | "devops" | "mobile" | "other";
  isProfessional: boolean;
  proficiency: number | null;
  language: string;
}

interface ResumeEntry {
  label: string;
  language: string;
  file: string;
}

interface TestimonialEntry {
  author: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  language: string;
}

interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  badge: string | null;
  category: "cloud" | "frontend" | "backend" | "ai" | "other";
  language: string;
}

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default async function Home() {
  const posts = await getSortedPostsData();

  // Fetch from Keystatic
  const results = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getExperience(),
    getSkills(),
    getResumes(),
    getTestimonials(),
    getCertifications()
  ]);

  const ksPosts = results[0] as KeystaticEntry<BlogPostEntry>[];
  const ksProjects = results[1] as KeystaticEntry<ProjectEntry>[];
  const ksExperience = results[2] as KeystaticEntry<ExperienceEntry>[];
  const ksSkills = results[3] as KeystaticEntry<SkillEntry>[];
  const ksResumes = results[4] as KeystaticEntry<ResumeEntry>[];
  const ksTestimonials = results[5] as KeystaticEntry<TestimonialEntry>[];
  const ksCertifications = results[6] as KeystaticEntry<CertificationEntry>[];

  // Map Keystatic data to components' prop formats
  const mappedBlogPosts = ksPosts.map(p => ({
    slug: p.slug,
    title: p.entry.title,
    date: p.entry.date || "",
    description: p.entry.description || "",
    tags: p.entry.tags as string[] || [],
    category: p.entry.category || "General",
    content: "", // Content not needed for list view
    readingTime: "5 min read", // Placeholder for now
  }));

  const mappedProjects = ksProjects.map((p, index) => ({
    id: `project-${p.slug || index}`,
    title: p.entry.title,
    category: p.entry.category || "Project",
    image: p.entry.image || "/images/placeholder.jpg",
    link: p.entry.link || "#",
    slug: p.slug,
    language: p.entry.language || "en",
  }));

  const mappedExperience = ksExperience.map((p, index) => ({
    id: `exp-${p.entry.company}-${p.entry.role}-${index}`,
    role: p.entry.role,
    company: p.entry.company,
    period: `${p.entry.startDate} - ${p.entry.endDate || "Present"}`,
    description: p.entry.description || "",
    startDate: p.entry.startDate,
    endDate: p.entry.endDate,
    highlights: p.entry.highlights as string[] || [],
    language: p.entry.language || "en",
  }));

  // Separate skills by professional flag
  const professionalSkills = ksSkills
    .filter(s => s.entry.isProfessional)
    .map(s => ({ name: s.entry.name, language: s.entry.language || "en" }));

  const techCategories = Array.from(new Set(ksSkills.map(s => s.entry.category)))
    .filter(Boolean)
    .map(cat => ({
      name: cat as string,
      items: ksSkills
        .filter(s => s.entry.category === cat && !s.entry.isProfessional)
        .map(s => ({ name: s.entry.name, language: s.entry.language || "en" }))
    }));

  const mappedCertifications = ksCertifications.map(p => ({
    name: p.entry.name,
    issuer: p.entry.issuer,
    date: p.entry.date,
    expiryDate: p.entry.expiryDate ?? undefined,
    credentialId: p.entry.credentialId ?? undefined,
    credentialUrl: p.entry.credentialUrl ?? undefined,
    badge: p.entry.badge ?? undefined,
    category: p.entry.category,
    language: p.entry.language || "en",
  }));

  const mappedResumes = ksResumes.map(r => ({
    label: r.entry.label,
    language: r.entry.language,
    file: r.entry.file
  }));

  const mappedTestimonials = ksTestimonials.map(t => ({
    author: t.entry.author,
    role: t.entry.role || "",
    company: t.entry.company || "",
    content: t.entry.content || "",
    avatar: t.entry.avatar || "",
    rating: typeof t.entry.rating === 'number' ? t.entry.rating : 5,
    language: t.entry.language || "en"
  }));

  const finalPosts = mappedBlogPosts.length > 0 ? mappedBlogPosts : posts;
  const hasBlogPosts = finalPosts.length > 0;

  return (
    <main id="main-content" className="min-h-screen">
      <ErrorBoundary name="Header">
        <Header hasBlogPosts={hasBlogPosts} />
      </ErrorBoundary>

      <ErrorBoundary name="Hero">
        <Hero resumes={mappedResumes} />
      </ErrorBoundary>

      {/* Wave divider after Hero */}
      <div className="bg-secondary/10">
        <WaveDivider className="-mt-1" color="background" flip />
      </div>

      <ErrorBoundary name="Services">
        <ScrollReveal>
          <SectionTracker sectionId="services">
            <Services />
          </SectionTracker>
        </ScrollReveal>
      </ErrorBoundary>

      {/* Wave divider after Services */}
      <WaveDivider color="secondary" />

      <ErrorBoundary name="Certifications">
        <ScrollReveal>
          <SectionTracker sectionId="certifications">
            <CertificationsSection items={mappedCertifications} />
          </SectionTracker>
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary name="Experience">
        <ScrollReveal>
          <SectionTracker sectionId="experience">
            <Experience items={mappedExperience} />
          </SectionTracker>
        </ScrollReveal>
      </ErrorBoundary>

      <ErrorBoundary name="Skills">
        <ScrollReveal>
          <SectionTracker sectionId="skills">
            <Skills
              professionalItems={professionalSkills}
              technicalCategories={techCategories}
            />
          </SectionTracker>
        </ScrollReveal>
      </ErrorBoundary>

      {/* Wave divider before Portfolio */}
      <Feature flag="projects">
        <WaveDivider color="background" flip />
      </Feature>

      <Feature flag="projects">
        <ErrorBoundary name="Portfolio">
          <ScrollReveal>
            <SectionTracker sectionId="portfolio">
              <Portfolio items={mappedProjects} />
            </SectionTracker>
          </ScrollReveal>
        </ErrorBoundary>
      </Feature>

      {/* Testimonials section */}
      {mappedTestimonials.length > 0 && (
        <ErrorBoundary name="Testimonials">
          <ScrollReveal>
            <SectionTracker sectionId="testimonials">
              <TestimonialsSection items={mappedTestimonials} />
            </SectionTracker>
          </ScrollReveal>
        </ErrorBoundary>
      )}

      <ErrorBoundary name="Blog">
        <ScrollReveal>
          <SectionTracker sectionId="blog">
            <Blog posts={finalPosts} />
          </SectionTracker>
        </ScrollReveal>
      </ErrorBoundary>

      {/* Contact is now handled by the ChatWidget in layout.tsx */}
      <Footer hasBlogPosts={hasBlogPosts} />
      <FloatingActions />
      <ErrorBoundary name="AccessibilityControls">
        <FloatingAccessibility />
        <VoiceNavigation />
      </ErrorBoundary>
    </main>
  );
}
