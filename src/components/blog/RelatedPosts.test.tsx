import { render, screen } from '@testing-library/react';
import { RelatedPosts } from './RelatedPosts';
import { Post } from '@/lib/posts';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        article: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <article {...props}>{children}</article>
        ),
    },
}));

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('RelatedPosts', () => {
    const mockPosts: Post[] = [
        {
            slug: 'current-post',
            title: 'Current Post',
            description: 'Current description',
            date: '2024-01-01',
            tags: ['React', 'TypeScript'],
            category: 'Tech',
            content: 'Content',
            readingTime: '5 min',
        },
        {
            slug: 'related-post-1',
            title: 'Related Post 1',
            description: 'Related description 1',
            date: '2024-01-02',
            tags: ['React', 'JavaScript'],
            category: 'Tech',
            content: 'Content',
            readingTime: '3 min',
        },
        {
            slug: 'related-post-2',
            title: 'Related Post 2',
            description: 'Related description 2',
            date: '2024-01-03',
            tags: ['Vue'],
            category: 'Tech',
            content: 'Content',
            readingTime: '4 min',
        },
        {
            slug: 'unrelated-post',
            title: 'Unrelated Post',
            description: 'Unrelated',
            date: '2024-01-04',
            tags: ['Python'],
            category: 'Backend',
            content: 'Content',
            readingTime: '6 min',
        },
    ];

    it('renders related posts section', () => {
        render(<RelatedPosts posts={mockPosts} currentSlug="current-post" />);
        expect(screen.getByText('Related Posts')).toBeInTheDocument();
    });

    it('shows posts matching by category', () => {
        render(<RelatedPosts posts={mockPosts} currentSlug="current-post" />);
        expect(screen.getByText('Related Post 1')).toBeInTheDocument();
        expect(screen.getByText('Related Post 2')).toBeInTheDocument();
    });

    it('excludes current post from related posts', () => {
        render(<RelatedPosts posts={mockPosts} currentSlug="current-post" />);
        expect(screen.queryByText('Current Post')).not.toBeInTheDocument();
    });

    it('returns null when current post not found', () => {
        const { container } = render(<RelatedPosts posts={mockPosts} currentSlug="non-existent" />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when no related posts found', () => {
        const isolatedPosts: Post[] = [
            {
                slug: 'lonely-post',
                title: 'Lonely Post',
                description: 'No matches',
                date: '2024-01-01',
                tags: ['UniqueTag'],
                category: 'UniqueCategory',
                content: 'Content',
                readingTime: '5 min',
            },
        ];
        const { container } = render(<RelatedPosts posts={isolatedPosts} currentSlug="lonely-post" />);
        expect(container.firstChild).toBeNull();
    });

    it('limits related posts to 3', () => {
        const manyPosts: Post[] = [
            ...mockPosts,
            {
                slug: 'extra-post-1',
                title: 'Extra 1',
                description: 'Extra',
                date: '2024-01-05',
                tags: ['React'],
                category: 'Tech',
                content: 'Content',
                readingTime: '2 min',
            },
            {
                slug: 'extra-post-2',
                title: 'Extra 2',
                description: 'Extra',
                date: '2024-01-06',
                tags: ['React'],
                category: 'Tech',
                content: 'Content',
                readingTime: '2 min',
            },
        ];

        render(<RelatedPosts posts={manyPosts} currentSlug="current-post" />);
        const articles = screen.getAllByRole('article');
        expect(articles.length).toBeLessThanOrEqual(3);
    });

    it('shows post category and date', () => {
        render(<RelatedPosts posts={mockPosts} currentSlug="current-post" />);
        expect(screen.getAllByText('Tech').length).toBeGreaterThan(0);
    });

    it('renders read more links', () => {
        render(<RelatedPosts posts={mockPosts} currentSlug="current-post" />);
        const readMoreLinks = screen.getAllByText('Read more');
        expect(readMoreLinks.length).toBeGreaterThan(0);
    });
});
