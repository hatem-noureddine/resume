import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from './useBookmarks';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useBookmarks', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    it('initializes with empty bookmarks', () => {
        const { result } = renderHook(() => useBookmarks());
        expect(result.current.bookmarks).toEqual([]);
    });

    it('adds a bookmark', () => {
        const { result } = renderHook(() => useBookmarks());

        act(() => {
            result.current.addBookmark({
                slug: 'test-post',
                title: 'Test Post',
                description: 'Test Description'
            });
        });

        expect(result.current.bookmarks).toHaveLength(1);
        expect(result.current.bookmarks[0].slug).toBe('test-post');
    });

    it('removes a bookmark', () => {
        const { result } = renderHook(() => useBookmarks());

        act(() => {
            result.current.addBookmark({
                slug: 'test-post',
                title: 'Test Post',
                description: 'Test Description'
            });
        });

        expect(result.current.bookmarks).toHaveLength(1);

        act(() => {
            result.current.removeBookmark('test-post');
        });

        expect(result.current.bookmarks).toHaveLength(0);
    });

    it('toggles bookmark on and off', () => {
        const { result } = renderHook(() => useBookmarks());
        const post = {
            slug: 'toggle-post',
            title: 'Toggle Post',
            description: 'Description'
        };

        // Add
        act(() => {
            result.current.toggleBookmark(post);
        });
        expect(result.current.isBookmarked('toggle-post')).toBe(true);

        // Remove
        act(() => {
            result.current.toggleBookmark(post);
        });
        expect(result.current.isBookmarked('toggle-post')).toBe(false);
    });

    it('checks if post is bookmarked', () => {
        const { result } = renderHook(() => useBookmarks());

        expect(result.current.isBookmarked('non-existent')).toBe(false);

        act(() => {
            result.current.addBookmark({
                slug: 'test',
                title: 'Test',
                description: 'Desc'
            });
        });

        expect(result.current.isBookmarked('test')).toBe(true);
    });

    it('clears all bookmarks', () => {
        const { result } = renderHook(() => useBookmarks());

        act(() => {
            result.current.addBookmark({ slug: 'post1', title: 'Post 1', description: '' });
            result.current.addBookmark({ slug: 'post2', title: 'Post 2', description: '' });
        });

        expect(result.current.bookmarks).toHaveLength(2);

        act(() => {
            result.current.clearBookmarks();
        });

        expect(result.current.bookmarks).toHaveLength(0);
    });

    it('does not add duplicate bookmarks', () => {
        const { result } = renderHook(() => useBookmarks());
        const post = { slug: 'dup', title: 'Dup', description: '' };

        act(() => {
            result.current.addBookmark(post);
            result.current.addBookmark(post);
        });

        expect(result.current.bookmarks).toHaveLength(1);
    });
});
