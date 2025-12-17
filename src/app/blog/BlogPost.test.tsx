import { getPostSlugs } from '@/lib/posts';
import { generateStaticParams } from '@/app/blog/[slug]/page';
const mockGetPostSlugs = jest.mocked(getPostSlugs);

// Mock child components
jest.mock('@/components/layout/Header', () => ({
    Header: () => <div data-testid="header">Header</div>
}));
jest.mock('@/components/layout/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>
}));
jest.mock('@/components/blog/TableOfContents', () => ({
    TableOfContents: () => <div data-testid="toc">TOC</div>
}));
jest.mock('@/components/blog/RelatedPosts', () => ({
    RelatedPosts: () => <div data-testid="related-posts">Related Posts</div>
}));
jest.mock('@/components/ui/ShareButtons', () => ({
    ShareButtons: () => <div data-testid="share-buttons">Share Buttons</div>
}));
jest.mock('@/components/ui/StarRating', () => ({
    StarRating: () => <div data-testid="star-rating">Star Rating</div>
}));
jest.mock('@/components/blog/Comments', () => ({
    Comments: () => <div data-testid="comments">Comments</div>
}));
jest.mock('@/components/blog/ReadingProgress', () => ({
    ReadingProgress: () => <div data-testid="reading-progress">Reading Progress</div>
}));
jest.mock('@/components/ui/CodeBlock', () => ({
    CodeBlockLegacy: ({ children }: { children: React.ReactNode }) => <pre>{children}</pre>
}));

// Mock extractHeadings
jest.mock('@/lib/posts', () => ({
    ...jest.requireActual('@/lib/posts'),
    extractHeadings: jest.fn().mockReturnValue([]),
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

// Import BlogPost and render utilities
import BlogPost from './[slug]/page';
import { render, screen } from '@testing-library/react';

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

    describe('BlogPost Component', () => {
        it('renders post content successfully', async () => {
            const jsx = await BlogPost({ params: Promise.resolve({ slug: 'test-post' }) });
            render(jsx);

            expect(screen.getByText('Test Post Title')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
            expect(screen.getByText('2024-01-15')).toBeInTheDocument();
            expect(screen.getByText('5 min read')).toBeInTheDocument();
            expect(screen.getByText('react')).toBeInTheDocument();
            expect(screen.getByTestId('toc')).toBeInTheDocument();
            expect(screen.getByTestId('comments')).toBeInTheDocument();
        });

        it('renders not found when post does not exist', async () => {
            const jsx = await BlogPost({ params: Promise.resolve({ slug: 'non-existent' }) });
            render(jsx);

            expect(screen.getByText('Post not found')).toBeInTheDocument();
        });
    });
});
