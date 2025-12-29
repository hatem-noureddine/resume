import { render, screen, fireEvent } from '@testing-library/react';
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
    Share2: () => <div data-testid="icon-share2" />,
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @next/next/no-img-element
    default: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useSpring: (value: any) => ({ get: () => (typeof value === 'number' ? value : 0), set: () => { } }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/components/ui/MagneticButton', () => ({
    MagneticButton: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));


jest.mock('@/components/sections/ClientCarousel', () => ({
    ClientCarousel: () => <div data-testid="client-carousel" />
}));

jest.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-animation" />,
}));

jest.mock('@/components/ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background" />,
}));

jest.mock('@/components/ui/BlurImage', () => ({
    // eslint-disable-next-line @next/next/no-img-element
    BlurImage: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('@/components/sections/TechCarousel', () => ({
    TechCarousel: () => <div data-testid="tech-carousel" />
}));

jest.mock('@/components/ui/QRCodeModal', () => ({
    QRCodeModal: () => <div data-testid="qr-code-modal" />
}));

// Mock usePrefersReducedMotion
const mockUsePrefersReducedMotion = jest.fn().mockReturnValue(false);
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => mockUsePrefersReducedMotion()
}));

// Define mock function outside
const mockUseLanguage = jest.fn();

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => mockUseLanguage(),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

describe('Hero Component', () => {
    const defaultHero = {
        greeting: 'Hi there',
        name: 'Hatem Noureddine',
        roles: ['Full Stack Developer'],
        description: 'A very long description that should exceed the limit for the read more button to appear. '.repeat(10),
        actions: { contact: 'Contact', download: 'Download' },
        stats: [{ value: '10+', label: 'Years' }],
        image: '/test.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseLanguage.mockReturnValue({
            t: {
                hero: defaultHero,
                contact: { title: 'Contact', subtitle: 'Get in touch' }
            },
            language: 'en',
            direction: 'ltr'
        });
        mockUsePrefersReducedMotion.mockReturnValue(false);
    });

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
        expect(screen.getByText(/Hatem/)).toBeInTheDocument();
        expect(screen.getByText(/Noureddine/)).toBeInTheDocument();
    });

    it('renders social links', () => {
        renderWithContext();
        const links = screen.getAllByRole('link');
        const githubLink = links.find(link => link.getAttribute('href')?.includes('github.com'));
        expect(githubLink).toBeInTheDocument();
    });

    it('renders call to action buttons', () => {
        renderWithContext();
        expect(screen.getByTestId('icon-mail')).toBeInTheDocument();
        expect(screen.getByTestId('icon-share2')).toBeInTheDocument();
    });

    it('handles mobile view interactions', () => {
        // Mock mobile width
        globalThis.innerWidth = 500;
        fireEvent(globalThis.window, new Event('resize'));

        renderWithContext();

        // Check for read more button
        const readMoreBtn = screen.getByRole('button', { name: /Read more/i });
        expect(readMoreBtn).toBeInTheDocument();

        // Expand
        fireEvent.click(readMoreBtn);
        expect(screen.getByRole('button', { name: /Read less/i })).toBeInTheDocument();
    });

    it('handles scroll down click', () => {
        const scrollIntoViewMock = jest.fn();
        jest.spyOn(document, 'getElementById').mockReturnValue({
            scrollIntoView: scrollIntoViewMock,
        } as unknown as HTMLElement);

        const { getByLabelText } = renderWithContext();
        fireEvent.click(getByLabelText('Scroll to explore'));

        expect(document.getElementById).toHaveBeenCalledWith('services');
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

        jest.restoreAllMocks();
    });

    it('renders multiple resumes in a dropdown menu', () => {
        const multipleResumes = [
            { label: 'Resume EN', language: 'en', file: '/resume-en.pdf' },
            { label: 'Resume FR', language: 'en', file: '/resume-en-v2.pdf' },
        ];

        render(
            <LanguageProvider>
                <Hero resumes={multipleResumes} />
            </LanguageProvider>
        );

        const downloadCVBtn = screen.getByText(/Download CV/i);
        fireEvent.click(downloadCVBtn);

        expect(screen.getByText('Resume EN')).toBeInTheDocument();
        expect(screen.getByText('Resume FR')).toBeInTheDocument();

        // Click outside to close
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Resume EN')).not.toBeInTheDocument();
    });

    it('handles QR code modal toggle', () => {
        renderWithContext();
        const shareBtn = screen.getByLabelText('Share profile');
        fireEvent.click(shareBtn);
        expect(screen.getByTestId('qr-code-modal')).toBeInTheDocument();
    });

    it('uses fallbacks for missing hero data', () => {
        mockUseLanguage.mockReturnValue({
            t: {
                hero: {
                    name: 'First Last',
                    description: 'Short desc',
                    image: '/test.jpg'
                }
            },
            language: 'en',
            direction: 'ltr'
        });

        renderWithContext();
        expect(screen.getByText(/First/)).toBeInTheDocument();
        expect(screen.getByText(/Last/)).toBeInTheDocument();
        // Check for cursor
        expect(screen.getByText('|')).toBeInTheDocument();
    });

    it('renders correctly in RTL mode', () => {
        mockUseLanguage.mockReturnValue({
            t: { hero: defaultHero },
            language: 'ar',
            direction: 'rtl'
        });

        renderWithContext();
        expect(screen.getByText(/Hatem/)).toBeInTheDocument();
    });

    it('renders fallback when 3D elements are disabled via reduced motion', () => {
        mockUsePrefersReducedMotion.mockReturnValue(true);

        renderWithContext();
        // and scroll indicator should use fallback div instead of Lottie
        expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
    });
});
