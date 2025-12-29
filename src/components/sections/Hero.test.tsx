/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { Hero } from './Hero';
import { LanguageProvider } from '@/context/LanguageContext';
import { track } from '@vercel/analytics';

// Mock Vercel Analytics
jest.mock('@vercel/analytics', () => ({
    track: jest.fn(),
}));

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
    BlurImage: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('@/components/sections/TechCarousel', () => ({
    TechCarousel: () => <div data-testid="tech-carousel" />
}));

jest.mock('@/components/ui/QRCodeModal', () => ({
    QRCodeModal: ({ isOpen }: any) => isOpen ? <div data-testid="qr-code-modal" /> : null
}));

const mockUsePrefersReducedMotion = jest.fn().mockReturnValue(false);
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => mockUsePrefersReducedMotion()
}));

const mockUseLanguage = jest.fn();
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => mockUseLanguage(),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

describe('Hero Component', () => {
    const defaultHero = {
        greeting: 'Hi there',
        name: 'Hatem Noureddine',
        roles: ['Developer', 'Designer'],
        description: 'A very long description that should exceed the limit for the read more button to appear. '.repeat(10),
        stats: [{ value: '10+', label: 'Years' }],
        image: '/test.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockUseLanguage.mockReturnValue({
            t: {
                hero: defaultHero,
            },
            language: 'en',
            direction: 'ltr'
        });
        mockUsePrefersReducedMotion.mockReturnValue(false);
        // Default to desktop
        globalThis.innerWidth = 1024;
        fireEvent(globalThis.window, new Event('resize'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const renderWithContext = (props = {}) => {
        return render(
            <LanguageProvider>
                <Hero {...props} />
            </LanguageProvider>
        );
    };

    it('renders basic info', () => {
        renderWithContext();
        expect(screen.getByText(/Hatem/)).toBeInTheDocument();
        expect(screen.getByText(/Noureddine/)).toBeInTheDocument();
        expect(screen.getByText('10+')).toBeInTheDocument();
    });

    it('animates typing text', () => {
        renderWithContext();

        // Loop to advance timers and allow re-renders
        for (let i = 0; i < 30; i++) {
            act(() => {
                jest.advanceTimersByTime(100);
            });
        }

        expect(screen.getByText(/Dev/)).toBeInTheDocument();
    });

    it('handles mobile description expansion', () => {
        globalThis.innerWidth = 500;
        fireEvent(globalThis.window, new Event('resize'));
        renderWithContext();

        const readMoreBtn = screen.getByRole('button', { name: /Read more/i });
        fireEvent.click(readMoreBtn);
        expect(screen.getByRole('button', { name: /Read less/i })).toBeInTheDocument();
    });

    it('has hidden class on desktop', () => {
        globalThis.innerWidth = 1024;
        fireEvent(globalThis.window, new Event('resize'));
        renderWithContext();

        // Button exists but should be hidden via CSS class
        const readMoreBtn = screen.getByRole('button', { name: /Read more/i });
        expect(readMoreBtn).toHaveClass('md:hidden');
    });

    it('downloads single resume and tracks analytics', () => {
        const resumes = [{ label: 'Resume EN', language: 'en', file: '/resume.pdf' }];
        renderWithContext({ resumes });

        const downloadLink = screen.getByText('Download CV').closest('a');
        expect(downloadLink).toHaveAttribute('href', '/resume.pdf');

        fireEvent.click(downloadLink!);
        expect(track).toHaveBeenCalledWith('Resume Download', { resume: 'Resume EN', language: 'en' });
    });

    it('opens dropdown for multiple resumes', () => {
        const resumes = [
            { label: 'Resume EN', language: 'en', file: '/resume-en.pdf' },
            { label: 'Resume FR', language: 'en', file: '/resume-fr.pdf' }
        ];
        renderWithContext({ resumes });

        const menuBtn = screen.getByText('Download CV').closest('button');
        fireEvent.click(menuBtn!);

        const option = screen.getByText('Resume FR');
        expect(option).toBeInTheDocument();

        fireEvent.click(option);
        expect(track).toHaveBeenCalledWith('Resume Download', { resume: 'Resume FR', language: 'en' });

        // Menu should close
        expect(screen.queryByText('Resume FR')).not.toBeInTheDocument();
    });

    it('closes resume menu when clicking outside', () => {
        const resumes = [
            { label: 'Resume EN', language: 'en', file: '/resume-en.pdf' },
            { label: 'Resume FR', language: 'en', file: '/resume-fr.pdf' }
        ];
        renderWithContext({ resumes });

        const menuBtn = screen.getByText('Download CV').closest('button');
        fireEvent.click(menuBtn!);
        expect(screen.getByText('Resume FR')).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Resume FR')).not.toBeInTheDocument();
    });

    it('opens QR modal and tracks analytics', () => {
        renderWithContext();
        const shareBtn = screen.getByLabelText('Share profile');
        fireEvent.click(shareBtn);

        expect(screen.getByTestId('qr-code-modal')).toBeInTheDocument();
        expect(track).toHaveBeenCalledWith('Share Profile QR Code Opened');
    });

    it('handles reduced motion for scroll indicator', () => {
        mockUsePrefersReducedMotion.mockReturnValue(true);
        renderWithContext();

        expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
        // Find the scroll button and check for the chevron icon inside it
        const scrollBtn = screen.getByLabelText(/Scroll to explore/i);
        // Using strict selector within the button
        expect(within(scrollBtn).getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('scrolls to content on click', () => {
        const scrollIntoViewMock = jest.fn();
        jest.spyOn(document, 'getElementById').mockReturnValue({
            scrollIntoView: scrollIntoViewMock,
        } as unknown as HTMLElement);

        renderWithContext();
        const scrollBtn = screen.getByLabelText(/scroll/i);
        fireEvent.click(scrollBtn);

        expect(document.getElementById).toHaveBeenCalledWith('services');
        expect(scrollIntoViewMock).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('renders desktop image carousel logic (implied coverage)', () => {
        renderWithContext();
        expect(screen.getByTestId('client-carousel')).toBeInTheDocument();
        expect(screen.getByTestId('tech-carousel')).toBeInTheDocument();
    });

    it('uses default values when hero data is missing', () => {
        mockUseLanguage.mockReturnValue({
            t: { hero: { name: 'Test Name' } },
            language: 'en',
            direction: 'ltr'
        });
        renderWithContext();

        // Timer advancement for typing animation default 'Developer'
        for (let i = 0; i < 30; i++) {
            act(() => {
                jest.advanceTimersByTime(100);
            });
        }

        // Should use defaults for roles
        expect(screen.getByText(/Developer/)).toBeInTheDocument();
    });

    it('renders with no resumes', () => {
        renderWithContext({ resumes: [] });
        expect(screen.getByText('Download CV')).toBeInTheDocument();
    });

    it('scroll to content handles missing section gracefully', () => {
        jest.spyOn(document, 'getElementById').mockReturnValue(null);
        renderWithContext();

        const scrollBtn = screen.getByLabelText(/scroll/i);
        fireEvent.click(scrollBtn);
    });

    it('cleans up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(globalThis, 'removeEventListener');
        const { unmount } = renderWithContext();
        unmount();
        // Check for resize listener
        // Filter calls to find resize
        const resizeCall = removeEventListenerSpy.mock.calls.find(call => call[0] === 'resize');
        expect(resizeCall).toBeTruthy();
    });
});
