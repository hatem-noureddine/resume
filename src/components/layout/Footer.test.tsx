import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Footer } from './Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock next/link
jest.mock('next/link', () => {
    return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    };
});

// Mock next/image
jest.mock('next/image', () => {
    return function MockImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />;
    };
});

// Mock Logo component
jest.mock('@/components/ui/Logo', () => ({
    Logo: ({ className }: { className?: string }) => <div data-testid="logo" className={className}>Logo</div>
}));

// Mock usePrefersReducedMotion
const mockPrefersReducedMotion = jest.fn().mockReturnValue(false);
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => mockPrefersReducedMotion()
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, className, 'aria-label': ariaLabel }: any) => (
            <button onClick={onClick} className={className} aria-label={ariaLabel}>
                {children}
            </button>
        ),
        div: ({ children, className }: any) => (
            <div className={className}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProviders = (hasBlogPosts = true) => {
    return render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
            <LanguageProvider>
                <Footer hasBlogPosts={hasBlogPosts} />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('Footer Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPrefersReducedMotion.mockReturnValue(false);
        // Reset scroll position
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    it('renders the footer element', () => {
        renderWithProviders();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('displays the logo', () => {
        renderWithProviders();
        expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('displays copyright text with current year', () => {
        renderWithProviders();
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        renderWithProviders();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Experience')).toBeInTheDocument();
    });

    it('hides blog link when hasBlogPosts is false', () => {
        renderWithProviders(false);
        expect(screen.queryByText('Blog')).not.toBeInTheDocument();
    });

    it('renders social media links', () => {
        renderWithProviders();
        const socialLinks = screen.getAllByRole('link').filter(link =>
            link.getAttribute('target') === '_blank'
        );
        expect(socialLinks.length).toBeGreaterThan(0);
    });

    describe('Back to Top button', () => {
        it('shows back-to-top button when scrolled down', async () => {
            renderWithProviders();

            // Simulate scroll past threshold
            Object.defineProperty(window, 'scrollY', { value: 600, writable: true });

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                expect(screen.getByLabelText(/back to top/i)).toBeInTheDocument();
            });
        });

        it('scrolls to top with smooth behavior by default', async () => {
            const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => { });

            renderWithProviders();

            // Show the back-to-top button
            Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                const button = screen.getByLabelText(/back to top/i);
                fireEvent.click(button);
            });

            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });

            scrollToSpy.mockRestore();
        });

        it('scrolls to top with auto behavior when reduced motion preferred', async () => {
            mockPrefersReducedMotion.mockReturnValue(true);
            const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => { });

            renderWithProviders();

            // Show the back-to-top button
            Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                const button = screen.getByLabelText(/back to top/i);
                fireEvent.click(button);
            });

            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 0,
                behavior: 'auto'
            });

            scrollToSpy.mockRestore();
        });

        it('hides back-to-top button when at top of page', async () => {
            renderWithProviders();

            // First scroll down to show button
            Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Then scroll back to top
            Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            await waitFor(() => {
                expect(screen.queryByLabelText(/back to top/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('scroll event handling', () => {
        it('adds scroll listener on mount', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            renderWithProviders();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'scroll',
                expect.any(Function),
                { passive: true }
            );

            addEventListenerSpy.mockRestore();
        });

        it('removes scroll listener on unmount', () => {
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
            const { unmount } = renderWithProviders();

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'scroll',
                expect.any(Function)
            );

            removeEventListenerSpy.mockRestore();
        });
    });

    describe('Newsletter Integration', () => {
        it('renders the newsletter form', () => {
            renderWithProviders();
            expect(screen.getByText('Subscribe to my newsletter')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
        });

        it('calls newsletter API on subscription', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Success' }),
                })
            ) as jest.Mock;

            renderWithProviders();

            const emailInput = screen.getByPlaceholderText(/enter your email/i);
            const submitButton = screen.getByRole('button', { name: /subscribe/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'test@example.com' }),
                }));
            });
        });
    });
});

