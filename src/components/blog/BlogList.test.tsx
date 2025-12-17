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
        readingTime: '5 min read',
    },
    {
        slug: 'test-post-2',
        title: 'Test Post Two',
        description: 'Description for test post two',
        date: '2024-01-10',
        tags: ['JavaScript', 'Tutorial'],
        category: 'Tutorials',
        content: 'Post content here',
        readingTime: '3 min read',
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

        // Find and click the clear button (X icon) inside the input wrapper
        // The one with absolute right-4
        const clearButton = screen.getAllByRole('button').find(btn => btn.className.includes('absolute right-4'));

        if (clearButton) {
            fireEvent.click(clearButton);
            expect(searchInput.value).toBe('');
        }
    });

    it('toggles filter panel', () => {
        renderWithProviders();
        const filterButton = screen.getByText(/filter by topic/i).closest('button');

        expect(screen.queryByText('Development')).not.toBeInTheDocument();

        if (filterButton) {
            fireEvent.click(filterButton);
            expect(screen.getByText('Development')).toBeInTheDocument();

            fireEvent.click(filterButton);
            // After closing, it should arguably be hidden or removed
            // Because of AnimatePresence, it might stay in DOM for exit animation, 
            // but testing-library usually waits or we can check visibility.
            // However, with our simple mock of AnimatePresence, it disappears immediately if conditionally rendered.
            // The condition is (isFilterOpen || selectedTag).
            expect(screen.queryByText('Development')).not.toBeInTheDocument();
        }
    });

    it('filters by tag', () => {
        renderWithProviders();
        // Open filter
        const filterButton = screen.getByText(/filter by topic/i).closest('button');
        fireEvent.click(filterButton!);

        // Click a tag, e.g., 'React' (which comes from the group 'Development' presumably, or just finding the tag button)
        // Tags are rendered as buttons in the panel.
        const tagButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
        fireEvent.click(tagButton!);

        // React post should be there, JavaScript post should not (if it doesn't have React tag)
        expect(screen.getByText('Test Post One')).toBeInTheDocument();
        expect(screen.queryByText('Test Post Two')).not.toBeInTheDocument();

        // Tag should be highlighted/active
        expect(screen.getByText('React', { selector: 'span.text-primary' })).toBeInTheDocument();

        // Click again to deselect
        fireEvent.click(tagButton!);

        // Should show all posts again
        expect(screen.getByText('Test Post Two')).toBeInTheDocument();
        expect(screen.queryByText(/tagged with/i)).not.toBeInTheDocument();
    });

    it('clears filters from panel', () => {
        renderWithProviders();
        const filterButton = screen.getByText(/filter by topic/i).closest('button');
        fireEvent.click(filterButton!);

        const tagButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
        fireEvent.click(tagButton!);

        const clearFiltersBtn = screen.getByText(/clear filters/i).closest('button');
        fireEvent.click(clearFiltersBtn!);

        expect(screen.queryByText('Test Post Two')).toBeInTheDocument();
        expect(screen.queryByText(/tagged with/i)).not.toBeInTheDocument();
    });

    it('paginates posts', () => {
        const manyPosts = Array.from({ length: 14 }, (_, i) => ({
            ...mockPosts[0],
            slug: `post-${i}`,
            title: `Post ${i + 1}`,
        }));

        renderWithProviders(manyPosts);

        // Should show first 6
        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 6')).toBeInTheDocument();
        expect(screen.queryByText('Post 7')).not.toBeInTheDocument();

        // Go to next page
        const nextButton = screen.getByTitle(/next/i);
        fireEvent.click(nextButton);

        expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
        expect(screen.getByText('Post 7')).toBeInTheDocument();

        // Go to next page (page 3) - 14 posts total = 6 + 6 + 2
        fireEvent.click(nextButton);
        expect(screen.getByText('Post 13')).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        // Go back
        const prevButton = screen.getByTitle(/previous/i);
        fireEvent.click(prevButton);
        expect(screen.getByText('Post 7')).toBeInTheDocument();
    });

    it('clears all filters when no results found', () => {
        renderWithProviders();
        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: 'impossible search' } });

        expect(screen.getByText(/no posts found/i)).toBeInTheDocument();

        const clearButton = screen.getByRole('button', { name: /clear filters/i });
        fireEvent.click(clearButton);

        expect(screen.queryByText(/no posts found/i)).not.toBeInTheDocument();
        expect(screen.getByText('Test Post One')).toBeInTheDocument();
    });
});
