/**
 * Test Utilities
 * 
 * Shared testing utilities, custom render functions, and mock factories.
 * Use these to write more consistent and maintainable tests.
 * 
 * @example
 * ```tsx
 * import { render, screen, createMockPost } from '@/test/utils';
 * 
 * test('renders blog post', () => {
 *     const post = createMockPost({ title: 'My Post' });
 *     render(<BlogCard post={post} />, { withLanguage: true });
 *     expect(screen.getByText('My Post')).toBeInTheDocument();
 * });
 * ```
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import type { Post } from '@/lib/posts';

// =============================================================================
// TYPES
// =============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    /** Wrap with LanguageProvider */
    withLanguage?: boolean;
    /** Wrap with ThemeProvider */
    withTheme?: boolean;
    /** Initial language for LanguageProvider */
    initialLanguage?: 'en' | 'fr';
}

// =============================================================================
// CUSTOM RENDER
// =============================================================================

/**
 * Custom render function that wraps components with providers
 */
function customRender(
    ui: ReactElement,
    options: CustomRenderOptions = {}
): RenderResult {
    const {
        withLanguage = false,
        withTheme = false,
        initialLanguage = 'en',
        ...renderOptions
    } = options;

    const Wrapper = ({ children }: { children: ReactNode }) => {
        let wrapped = <>{children}</>;

        if (withLanguage) {
            wrapped = <LanguageProvider>{wrapped}</LanguageProvider>;
        }

        if (withTheme) {
            wrapped = <ThemeProvider>{wrapped}</ThemeProvider>;
        }

        return wrapped;
    };

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// =============================================================================
// MOCK FACTORIES
// =============================================================================

/**
 * Create a mock blog post
 */
export function createMockPost(overrides: Partial<Post> = {}): Post {
    return {
        slug: 'test-post',
        title: 'Test Post Title',
        date: '2024-01-15',
        description: 'A test post description for testing purposes.',
        tags: ['test', 'mock'],
        category: 'Testing',
        content: 'This is the test post content.',
        readingTime: '3 min read',
        ...overrides,
    };
}

/**
 * Create multiple mock posts
 */
export function createMockPosts(count: number, baseOverrides: Partial<Post> = {}): Post[] {
    return Array.from({ length: count }, (_, i) =>
        createMockPost({
            slug: `test-post-${i + 1}`,
            title: `Test Post ${i + 1}`,
            date: `2024-01-${String(15 - i).padStart(2, '0')}`,
            ...baseOverrides,
        })
    );
}

/**
 * Create a mock experience item
 */
export function createMockExperience(overrides: Record<string, unknown> = {}) {
    return {
        id: 1,
        period: '2022 - Present',
        role: 'Senior Developer',
        company: 'Test Company',
        logo: '/logos/test.svg',
        description: 'A test company description.',
        duration: '2 years',
        startDate: '2022-01-01',
        highlights: ['Built things', 'Led teams', 'Shipped products'],
        skills: ['React', 'TypeScript', 'Node.js'],
        ...overrides,
    };
}

/**
 * Create a mock skill category
 */
export function createMockSkillCategory(overrides: Record<string, unknown> = {}) {
    return {
        name: 'Frontend',
        items: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
        ...overrides,
    };
}

// =============================================================================
// ASYNC UTILITIES
// =============================================================================

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises and timers
 */
export async function flushPromises(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

// =============================================================================
// MOCK HELPERS
// =============================================================================

/**
 * Create a mock fetch response
 */
export function createMockFetchResponse<T>(
    data: T,
    options: { status?: number; ok?: boolean } = {}
): Response {
    const { status = 200, ok = true } = options;
    return {
        ok,
        status,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
        headers: new Headers(),
        redirected: false,
        statusText: ok ? 'OK' : 'Error',
        type: 'basic',
        url: '',
        clone: () => createMockFetchResponse(data, options),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        bytes: () => Promise.resolve(new Uint8Array()),
    } as Response;
}

/**
 * Create a mock localStorage
 */
export function createMockLocalStorage(): Storage {
    const store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((key) => delete store[key]);
        },
        key: (index: number) => Object.keys(store)[index] || null,
        get length() {
            return Object.keys(store).length;
        },
    };
}

/**
 * Mock the reduced motion preference
 */
export function mockReducedMotion(prefersReducedMotion: boolean): void {
    Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
            matches: query.includes('reduced-motion') ? prefersReducedMotion : false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}

// =============================================================================
// CUSTOM MATCHERS HELPERS
// =============================================================================

/**
 * Check if an element has a specific CSS class pattern
 */
export function hasClassPattern(element: Element, pattern: RegExp): boolean {
    return pattern.test(element.className);
}

/**
 * Get all elements with a specific test ID pattern
 */
export function getAllByTestIdPattern(
    container: Element,
    pattern: RegExp
): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>('[data-testid]')).filter(
        (el) => pattern.test(el.dataset.testid || '')
    );
}
