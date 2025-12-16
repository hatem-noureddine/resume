import { render, screen } from '@testing-library/react';
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
});
