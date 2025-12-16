import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';

// Mock getSortedPostsData and getPostData
jest.mock('@/lib/posts', () => ({
    getSortedPostsData: jest.fn().mockResolvedValue([
        {
            slug: 'test-post',
            title: 'Test Post',
            date: '2024-01-01',
            description: 'Test Description',
            readingTime: '5 min',
            tags: ['test'],
            category: 'General'
        }
    ]),
    getPostData: jest.fn().mockImplementation((slug) => {
        if (slug === 'test-post') {
            return Promise.resolve({
                slug: 'test-post',
                title: 'Test Post',
                date: '2024-01-01',
                contentHtml: '<p>Content</p>',
                readingTime: '5 min'
            });
        }
        return Promise.reject(new Error('Post not found'));
    }),
    getPostSlugs: jest.fn().mockResolvedValue(['test-post'])
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

// Mock children components
jest.mock('@/components/layout/Header', () => ({ Header: () => <div data-testid="header" /> }));
jest.mock('@/components/layout/Footer', () => ({ Footer: () => <div data-testid="footer" /> }));

// Mock providers
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

describe('Blog Sections', () => {
    describe('Blog Page', () => {
        it('renders blog list', async () => {
            const page = await BlogPage();
            render(
                <ThemeProvider>
                    <LanguageProvider>
                        {page}
                    </LanguageProvider>
                </ThemeProvider>
            );
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByText(/Blog/i)).toBeInTheDocument();
        });
    });
});
