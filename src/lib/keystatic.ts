import { createReader } from '@keystatic/core/reader';
import { cache } from 'react';
import config from '../../keystatic.config';

export const reader = createReader(process.cwd(), config);

export const getBlogPosts = cache(async function () {
    const posts = await reader.collections.blog.all();
    return posts.sort((a, b) => {
        const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
        const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
        return dateB - dateA;
    });
});

export const getProjects = cache(async function () {
    return await reader.collections.projects.all();
});

export const getProjectBySlug = cache(async function (slug: string) {
    return await reader.collections.projects.read(slug);
});

export const getProjectSlugs = cache(async function () {
    return await reader.collections.projects.list();
});

export const getExperience = cache(async function () {
    return await reader.collections.experience.all();
});

export const getSkills = cache(async function () {
    return await reader.collections.skills.all();
});

export const getResumes = cache(async function () {
    return await reader.collections.resumes.all();
});

export const getTestimonials = cache(async function () {
    return await reader.collections.testimonials.all();
});

export const getCertifications = cache(async function () {
    return await reader.collections.certifications.all();
});

export const getLanguages = cache(async function () {
    return await reader.collections.languages.all();
});

export const getThemeSettings = cache(async function () {
    return await reader.singletons.theme.read();
});
