/**
 * @jest-environment node
 */
import { GET } from '@/app/feed.xml/route';
import sitemap from '@/app/sitemap';

// Mock getSortedPostsData
jest.mock('@/lib/posts', () => ({
    getSortedPostsData: jest.fn().mockResolvedValue([
        {
            slug: 'test-post',
            title: 'Test Post',
            date: '2024-01-01',
            description: 'Test Description',
            content: 'Content'
        }
    ]),
}));

describe('API Routes', () => {
    describe('RSS Feed (feed.xml)', () => {
        it('generates RSS feed', async () => {
            const response = await GET();

            expect(response.status).toBe(200);
            expect(response.headers.get('content-type')).toBe('application/xml');

            const text = await response.text();
            expect(text).toContain('<?xml version="1.0" encoding="UTF-8" ?>');
            expect(text).toContain('<title>Test Post</title>');
        });
    });

    describe('Sitemap', () => {
        it('generates sitemap entries', async () => {
            const entries = await sitemap();

            expect(Array.isArray(entries)).toBe(true);
            expect(entries.length).toBeGreaterThan(0);

            // Check for static entry
            expect(entries).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    url: 'https://resume-cb6ssf9ve-hatem-noureddines-projects.vercel.app',
                    priority: 1
                })
            ]));

            // Check for dynamic blog post entry
            expect(entries).toContainEqual(expect.objectContaining({
                url: 'https://resume-cb6ssf9ve-hatem-noureddines-projects.vercel.app/blog/test-post',
                changeFrequency: 'monthly'
            }));
        });
    });
});
