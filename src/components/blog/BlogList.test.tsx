import { render, screen, fireEvent } from '@testing-library/react';
import { BlogList } from './BlogList';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Post } from '@/lib/posts';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} {...props}>{children}</div>
        ),
        article: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
            <article className={className} {...props}>{children}</article>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/link
jest.mock('next/link', () => {
    return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    };
});

const mockPosts: Post[] = [
    {
        slug: 'test-post-1',
        title: 'Test Post One',
        description: 'Description for test post one',
        date: '2024-01-15',
        tags: ['React', 'Testing'],
        category: 'Development',
        content: 'Post content here',
    },
    {
        slug: 'test-post-2',
        title: 'Test Post Two',
        description: 'Description for test post two',
        date: '2024-01-10',
        tags: ['JavaScript', 'Tutorial'],
        category: 'Tutorials',
        content: 'Post content here',
    },
];

const renderWithProviders = (posts: Post[] = mockPosts) => {
    return render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
            <LanguageProvider>
                <BlogList initialPosts={posts} />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('BlogList Component', () => {
    it('renders post titles', () => {
        renderWithProviders();
        expect(screen.getByText('Test Post One')).toBeInTheDocument();
        expect(screen.getByText('Test Post Two')).toBeInTheDocument();
    });

    it('renders post descriptions', () => {
        renderWithProviders();
        expect(screen.getByText('Description for test post one')).toBeInTheDocument();
    });

    it('renders search input', () => {
        renderWithProviders();
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('filters posts by search query', () => {
        renderWithProviders();
        const searchInput = screen.getByPlaceholderText(/search/i);

        fireEvent.change(searchInput, { target: { value: 'Test Post One' } });

        expect(screen.getByText('Test Post One')).toBeInTheDocument();
        expect(screen.queryByText('Test Post Two')).not.toBeInTheDocument();
    });

    it('shows no results message when no posts match', () => {
        renderWithProviders();
        const searchInput = screen.getByPlaceholderText(/search/i);

        fireEvent.change(searchInput, { target: { value: 'nonexistent post xyz' } });

        expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    });

    it('renders post tags', () => {
        renderWithProviders();
        expect(screen.getByText('#React')).toBeInTheDocument();
        expect(screen.getByText('#Testing')).toBeInTheDocument();
    });

    it('renders post dates', () => {
        renderWithProviders();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', () => {
        renderWithProviders();
        const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;

        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(searchInput.value).toBe('test');

        // Find and click the clear button (X icon)
        const clearButtons = screen.getAllByRole('button');
        const clearSearchButton = clearButtons.find(btn =>
            btn.querySelector('svg') && btn.className.includes('right')
        );

        if (clearSearchButton) {
            fireEvent.click(clearSearchButton);
            expect(searchInput.value).toBe('');
        }
    });
});
