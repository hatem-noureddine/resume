import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

export const reader = createReader(process.cwd(), config);

export async function getBlogPosts() {
    const posts = await reader.collections.blog.all();
    return posts.sort((a, b) => {
        const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
        const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
        return dateB - dateA;
    });
}

export async function getProjects() {
    return await reader.collections.projects.all();
}

export async function getProjectBySlug(slug: string) {
    return await reader.collections.projects.read(slug);
}

export async function getProjectSlugs() {
    return await reader.collections.projects.list();
}

export async function getExperience() {
    return await reader.collections.experience.all();
}

export async function getSkills() {
    return await reader.collections.skills.all();
}

export async function getResumes() {
    return await reader.collections.resumes.all();
}

export async function getTestimonials() {
    return await reader.collections.testimonials.all();
}

export async function getCertifications() {
    return await reader.collections.certifications.all();
}

export async function getLanguages() {
    return await reader.collections.languages.all();
}
