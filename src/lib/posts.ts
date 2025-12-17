import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    category: string;
    content: string;
    readingTime: string;
}

export async function getSortedPostsData(): Promise<Post[]> {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const matterResult = matter(fileContents);

            return {
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date,
                description: matterResult.data.description,
                tags: matterResult.data.tags || [],
                category: matterResult.data.category || 'General',
                content: matterResult.content,
                readingTime: readingTime(matterResult.content).text,
            };
        });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getPostSlugs(): Promise<string[]> {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getPostData(slug: string): Promise<Post | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        description: matterResult.data.description,
        tags: matterResult.data.tags || [],
        category: matterResult.data.category || 'General',
        content: matterResult.content,
        readingTime: readingTime(matterResult.content).text,
    };
}

export interface TocHeading {
    id: string;
    text: string;
    level: number;
}

export function extractHeadings(content: string, maxLevel: number = 2): TocHeading[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocHeading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        // Only include headings up to maxLevel (default: h1 and h2 only)
        if (level > maxLevel) continue;

        const text = match[2].trim();
        // Create a URL-friendly ID from the heading text
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        headings.push({ id, text, level });
    }

    return headings;
}
