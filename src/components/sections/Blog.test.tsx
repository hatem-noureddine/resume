import { render, screen, fireEvent, act } from '@testing-library/react';
import { Blog } from './Blog';

jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            blog: {
                title: 'My Blog',
                readMore: 'Read More',
                viewAll: 'View All Posts',
                notFound: 'No posts found'
            }
        },
        language: 'en',
    }),
}));
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            blog: {
                title: 'Latest Posts',
                description: 'Blog posts',
                readMore: 'Read More',
                searchPlaceholder: 'Search',
                filterByTopic: 'Filter',
                clearFilters: 'Clear',
                notFound: 'Not Found',
                previous: 'Prev',
                next: 'Next'
            },
            header: {
                nav: [{ name: 'Blog', href: '/blog' }]
            }
        },
        language: 'en'
    }),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: any) => <div><h1>{title}</h1><h2>{subtitle}</h2></div>
}));

jest.mock('@/components/ui/Button', () => ({
    Button: ({ children }: any) => <button>{children}</button>
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        article: ({ children, className }: any) => <article className={className}>{children}</article>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    Search: () => <div />,
    Filter: () => <div />,
    X: () => <div />,
    ChevronLeft: () => <div />,
    ChevronRight: () => <div />,
    Calendar: () => <div />,
    Clock: () => <div />,
    ArrowRight: () => <div />,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @next/next/no-img-element
    default: ({ fill, ...props }: any) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('next/link', () => ({
    __esModule: true,

    default: ({ children, href }: any) => <a href={href || '/'}>{children}</a>,
}));

// Mock blog data
const mockPosts = [
    {
        id: '1',
        title: 'Tech Post',
        excerpt: 'Excerpt',
        description: 'Desc',
        date: '2023-01-01',
        readingTime: '5 min',
        category: 'Tech',
        image: '/img.png',
        slug: 'tech-post',
        tags: ['React'],
        content: 'Content'
    },
    {
        id: '2',
        title: 'Design Post',
        excerpt: 'Excerpt',
        description: 'Desc',
        date: '2023-01-02',
        readingTime: '5 min',
        category: 'Design',
        image: '/img.png',
        slug: 'design-post',
        tags: ['Figma'],
        content: 'Content'
    }
];

describe('Blog Component', () => {
    it('renders blog posts', async () => {
        render(<Blog posts={mockPosts} />);
        expect(screen.getByText('Latest Posts')).toBeInTheDocument();
        const techPosts = await screen.findAllByText('Tech Post');
        expect(techPosts.length).toBeGreaterThan(0);
        const designPosts = await screen.findAllByText('Design Post');
        expect(designPosts.length).toBeGreaterThan(0);
    });

    it('filters posts by category', async () => {
        render(<Blog posts={mockPosts} />);

        // Use findByText to handle potential async rendering from AnimatePresence/motion
        const techPosts = await screen.findAllByText('Tech Post');
        expect(techPosts.length).toBeGreaterThan(0);

        const designPosts = await screen.findAllByText('Design Post');
        expect(designPosts.length).toBeGreaterThan(0);

        // Click 'Tech' filter
        const techFilterButton = screen.getByRole('button', { name: 'Tech' });
        techFilterButton.click();

        // Should show Tech Post (might be multiple: grid + carousel)
        const techPostsAfterFilter = await screen.findAllByText('Tech Post');
        expect(techPostsAfterFilter.length).toBeGreaterThan(0);

        // Verify Design Post is gone
        expect(screen.queryByText('Design Post')).not.toBeInTheDocument();

        // Click 'All' filter
        const allFilterButton = screen.getByRole('button', { name: 'All' });
        allFilterButton.click();

        // Should show both again
        const techPostsAfterAll = await screen.findAllByText('Tech Post');
        expect(techPostsAfterAll.length).toBeGreaterThan(0);

        const designPostsAfterAll = await screen.findAllByText('Design Post');
        expect(designPostsAfterAll.length).toBeGreaterThan(0);
    });

    it('handles carousel navigation - next slide', async () => {
        render(<Blog posts={mockPosts} />);

        // Find next button (ChevronRight icon button)
        const nextButtons = screen.getAllByRole('button');
        const nextButton = nextButtons.find(btn =>
            btn.hasAttribute('aria-label') &&
            btn.getAttribute('aria-label')?.includes('Next')
        );

        if (nextButton) {
            nextButton.click();
        }
    });

    it('handles carousel navigation - prev slide', async () => {
        render(<Blog posts={mockPosts} />);

        // Find prev button (ChevronLeft icon button)
        const prevButtons = screen.getAllByRole('button');
        const prevButton = prevButtons.find(btn =>
            btn.hasAttribute('aria-label') &&
            btn.getAttribute('aria-label')?.includes('Previous')
        );

        if (prevButton) {
            await act(async () => {
                fireEvent.click(prevButton);
            });
        }
    });
});
