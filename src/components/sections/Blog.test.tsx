import { render, screen } from '@testing-library/react';
import { Blog } from './Blog';

// Mock Language
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
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: any) => <a href="#">{children}</a>,
}));

// Mock blog data
const mockPosts = [
    {
        id: '1',
        title: 'Test Post',
        excerpt: 'Excerpt',
        description: 'Desc',
        date: '2023-01-01',
        readTime: '5 min',
        category: 'Tech',
        image: '/img.png',
        slug: 'test-post',
        tags: ['React'],
        content: 'Content'
    }
];

describe('Blog Component', () => {
    it('renders blog posts', () => {
        render(<Blog posts={mockPosts} />);
        expect(screen.getByText('Latest Posts')).toBeInTheDocument();
        expect(screen.getAllByText('Test Post')[0]).toBeInTheDocument();
    });
});
