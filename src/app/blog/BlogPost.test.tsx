/**
 * @jest-environment node
 */
import { generateStaticParams } from '@/app/blog/[slug]/page';
import { getPostSlugs } from '@/lib/posts';

// Mock react-markdown (ESM module that Jest can't transform)
jest.mock('react-markdown', () => {
    return function ReactMarkdown({ children }: { children: string }) {
        return children;
    };
});

jest.mock('remark-gfm', () => () => { });

// Mock data fetching
jest.mock('@/lib/posts', () => ({
    getSortedPostsData: jest.fn().mockResolvedValue([]),
    getPostData: jest.fn().mockImplementation((slug: string) => {
        if (slug === 'test-post') {
            return Promise.resolve({
                slug: 'test-post',
                title: 'Test Post Title',
                date: '2024-01-15',
                description: 'Test description',
                tags: ['react', 'testing'],
                category: 'Development',
                content: '# Hello World\n\nThis is **bold** text.',
                readingTime: '5 min read',
            });
        }
        return Promise.resolve(null);
    }),
    getPostSlugs: jest.fn().mockResolvedValue(['test-post', 'another-post']),
}));

const mockGetPostSlugs = jest.mocked(getPostSlugs);

describe('BlogPost Page', () => {
    describe('generateStaticParams', () => {
        it('returns array of slug params', async () => {
            const params = await generateStaticParams();

            expect(params).toEqual([
                { slug: 'test-post' },
                { slug: 'another-post' },
            ]);
        });

        it('returns empty array on error', async () => {
            mockGetPostSlugs.mockRejectedValueOnce(new Error('Failed'));

            const params = await generateStaticParams();
            expect(params).toEqual([]);
        });
    });
});
