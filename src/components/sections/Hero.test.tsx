import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Github: () => <div data-testid="icon-github" />,
    Linkedin: () => <div data-testid="icon-linkedin" />,
    Mail: () => <div data-testid="icon-mail" />,
    FileText: () => <div data-testid="icon-file-text" />,
    Download: () => <div data-testid="icon-download" />,
    ChevronDown: () => <div data-testid="icon-chevron-down" />,
    ChevronUp: () => <div data-testid="icon-chevron-up" />,
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style }: any) => <div className={className} style={style}>{children}</div>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
        a: ({ children, className, href }: any) => <a className={className} href={href}>{children}</a>,
        button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
}));

jest.mock('@/components/sections/ClientCarousel', () => ({
    ClientCarousel: () => <div data-testid="client-carousel" />
}));

jest.mock('@/components/sections/TechCarousel', () => ({
    TechCarousel: () => <div data-testid="tech-carousel" />
}));

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            hero: {
                greeting: 'Hi there',
                name: 'Hatem Noureddine',
                role: 'Full Stack Developer',
                description: 'Description',
                actions: {
                    contact: 'Contact',
                    download: 'Download'
                },
                stats: []
            },
            contact: {
                title: 'Contact',
                subtitle: 'Get in touch'
            }
        },
        language: 'en'
    }),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

describe('Hero Component', () => {
    const renderWithContext = () => {
        return render(
            <LanguageProvider>
                <Hero />
            </LanguageProvider>
        );
    };

    it('renders the main heading', () => {
        renderWithContext();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        // Text is split into spans, so we check for parts or use a flexible matcher
        expect(screen.getByText('Hatem')).toBeInTheDocument();
        expect(screen.getByText('Noureddine')).toBeInTheDocument();
    });

    // Role is no longer rendered in Hero
    // it('renders the role/title', () => {
    //     renderWithContext();
    //     expect(screen.getAllByText(/Full Stack Developer/i)[0]).toBeInTheDocument();
    // });

    it('renders social links', () => {
        renderWithContext();
        const links = screen.getAllByRole('link');
        console.log('Found Links:', links.map(l => l.getAttribute('href')));
        const githubLink = links.find(link => link.getAttribute('href')?.includes('github.com'));
        const linkedinLink = links.find(link => link.getAttribute('href')?.includes('linkedin.com'));
        expect(githubLink).toBeInTheDocument();
        expect(linkedinLink).toBeInTheDocument();
    });

    it('renders call to action buttons', () => {
        renderWithContext();
        // Assuming localized text, looking for buttons generally or by icon
        expect(screen.getByTestId('icon-mail')).toBeInTheDocument(); // Contact
        expect(screen.getByTestId('icon-download')).toBeInTheDocument(); // Download CV
    });
});
