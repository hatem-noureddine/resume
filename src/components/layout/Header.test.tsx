import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from './Header';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock dependencies
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, onClick, className }: any) => (
        <a href={href} onClick={onClick} className={className} data-testid={`link-${href}`}>
            {children}
        </a>
    ),
}));

jest.mock('lucide-react', () => ({
    Menu: () => <div data-testid="icon-menu" />,
    X: () => <div data-testid="icon-x" />,
    ChevronDown: () => <div data-testid="icon-chevron-down" />,
    Check: () => <div data-testid="icon-check" />,
    Sparkles: () => <div data-testid="icon-sparkles" />,
}));

jest.mock('@/components/ui/ThemeToggle', () => ({
    ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

jest.mock('@/components/ui/Logo', () => ({
    Logo: () => <div data-testid="logo" />,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onDragEnd, ...props }: any) => (
            <div {...props}>
                {children}
                {onDragEnd && (
                    <>
                        <button
                            data-testid="swipe-close"
                            onClick={() => onDragEnd(null, { offset: { x: 100 }, velocity: { x: 0 } })}
                        />
                        <button
                            data-testid="swipe-close-rtl"
                            onClick={() => onDragEnd(null, { offset: { x: -100 }, velocity: { x: 0 } })}
                        />
                        <button
                            data-testid="swipe-stay"
                            onClick={() => onDragEnd(null, { offset: { x: 0 }, velocity: { x: 0 } })}
                        />
                    </>
                )}
            </div>
        ),
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockUseLanguage = jest.fn();
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => mockUseLanguage(),
    LanguageProvider: ({ children }: any) => <div>{children}</div>,
}));

const mockIsEnabled = jest.fn();
jest.mock('@/context/FeatureFlags', () => ({
    useFeatureFlags: () => ({ isEnabled: mockIsEnabled }),
}));

jest.mock('@/locales', () => ({
    localeMetadata: {
        en: { flag: '🇺🇸', name: 'English' },
        fr: { flag: '🇫🇷', name: 'Français' },
        ar: { flag: '🇸🇦', name: 'Arabic' },
    },
}));

describe('Header Component', () => {
    const defaultNav = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Blog', href: '/blog' },
    ];

    const defaultT = {
        header: { nav: defaultNav },
        portfolio: { items: [{ id: 1 }] },
        contact: { title: 'Contact Me' },
    };

    const setLanguageMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockIsEnabled.mockReturnValue(true);
        mockUseLanguage.mockReturnValue({
            t: defaultT,
            language: 'en',
            setLanguage: setLanguageMock,
            availableLanguages: ['en', 'fr'],
            direction: 'ltr',
        });
        // Reset scroll
        globalThis.scrollY = 0;
        fireEvent.scroll(globalThis as unknown as Window);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const renderHeader = (props = {}) => {
        return render(
            <LanguageProvider>
                <Header {...props} />
            </LanguageProvider>
        );
    };

    it('renders navigation links', () => {
        renderHeader();
        // Use getAllByText for 'Home' since it appears in Logo sr-only and Nav
        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);

        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Contact Me')).toBeInTheDocument();
    });

    it('toggles mobile menu', () => {
        renderHeader();
        // Open
        const menuBtn = screen.getByLabelText('Open menu');
        fireEvent.click(menuBtn);
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

        // Close
        const closeBtn = screen.getByLabelText('Close menu');
        fireEvent.click(closeBtn);
        expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
    });

    it('changes language', () => {
        renderHeader();
        // Open dropdown
        const langBtn = screen.getByLabelText('Select language');
        fireEvent.click(langBtn);

        // Select French
        const frOption = screen.getByText('Français').closest('button');
        fireEvent.click(frOption!);

        expect(setLanguageMock).toHaveBeenCalledWith('fr');
    });

    it('closes language menu when clicking outside', () => {
        renderHeader();
        const langBtn = screen.getByLabelText('Select language');
        fireEvent.click(langBtn);
        expect(screen.getByText('Français')).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Français')).not.toBeInTheDocument();
    });

    it('updates appearance on scroll', () => {
        const { container } = renderHeader();
        const header = container.querySelector('header');
        expect(header).toHaveClass('bg-transparent');

        // Scroll down
        act(() => {
            globalThis.scrollY = 100;
            fireEvent.scroll(globalThis as unknown as Window);
        });

        expect(header).toHaveClass('bg-background/80');
    });

    it('detects active section', () => {
        const mockSection = {
            getBoundingClientRect: jest.fn().mockReturnValue({ top: 50, height: 500 }),
        };
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'services') return mockSection as any;
            return null;
        });

        renderHeader();

        act(() => {
            globalThis.scrollY = 200;
            fireEvent.scroll(globalThis as unknown as Window);
        });

        const servicesLink = screen.getByTestId('link-#services');
        expect(servicesLink).toHaveClass('text-primary');
    });

    it('hides portfolio link if disabled or empty', () => {
        // Case 1: Empty items
        mockUseLanguage.mockReturnValue({
            t: { ...defaultT, portfolio: { items: [] } },
            language: 'en',
            setLanguage: setLanguageMock,
            availableLanguages: ['en', 'fr'],
            direction: 'ltr'
        });

        const { unmount } = renderHeader();
        expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
        unmount();

        // Case 2: Feature disabled
        mockUseLanguage.mockReturnValue({
            t: defaultT,
            language: 'en',
            setLanguage: setLanguageMock,
            availableLanguages: ['en', 'fr'],
            direction: 'ltr'
        });
        mockIsEnabled.mockReturnValue(false);

        const { unmount: unmount2 } = renderHeader();
        expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
        unmount2();
    });

    it('swipes to close mobile menu', () => {
        renderHeader();
        fireEvent.click(screen.getByLabelText('Open menu'));

        // Swipe to close
        const swipeCloseBtn = screen.getByTestId('swipe-close');
        fireEvent.click(swipeCloseBtn);

        expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();

        // Test Swipe Stay (failed swipe)
        // Click open again
        fireEvent.click(screen.getByLabelText('Open menu'));
        const swipeStayBtn = screen.getByTestId('swipe-stay');
        fireEvent.click(swipeStayBtn);
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('swipes to close in RTL', () => {
        mockUseLanguage.mockReturnValue({
            t: defaultT,
            language: 'ar',
            setLanguage: setLanguageMock,
            availableLanguages: ['en', 'ar'],
            direction: 'rtl',
        });

        renderHeader();
        fireEvent.click(screen.getByLabelText('Open menu'));

        // Swipe left (-100) should close in RTL
        const swipeRtlBtn = screen.getByTestId('swipe-close-rtl');
        fireEvent.click(swipeRtlBtn);

        expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
    });

    it('locks body scroll when menu open', () => {
        renderHeader();
        fireEvent.click(screen.getByLabelText('Open menu'));
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(screen.getByLabelText('Close menu'));
        expect(document.body.style.overflow).toBe('unset');
    });

    it('scrolls to contact section', () => {
        const scrollIntoViewMock = jest.fn();
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'contact') return { scrollIntoView: scrollIntoViewMock } as any;
            return null;
        });

        const { unmount } = renderHeader();
        const contactBtn = screen.getByText('Contact Me').closest('a');
        fireEvent.click(contactBtn!);

        expect(document.getElementById).toHaveBeenCalledWith('contact');
        expect(scrollIntoViewMock).toHaveBeenCalled();
        unmount();

        // Test missing contact section (branch coverage)
        jest.clearAllMocks();
        jest.spyOn(document, 'getElementById').mockReturnValue(null);

        const { unmount: unmount2 } = renderHeader();
        const contactBtn2 = screen.getByText('Contact Me').closest('a');
        fireEvent.click(contactBtn2!);

        expect(document.getElementById).toHaveBeenCalledWith('contact');
        expect(scrollIntoViewMock).not.toHaveBeenCalled();
        unmount2();
    });

    it('hides blog link if hasBlogPosts is false', () => {
        const { unmount } = renderHeader({ hasBlogPosts: false });
        expect(screen.queryByText('Blog')).not.toBeInTheDocument();
        unmount();
    });

    it('does not render language dropdown if only one language available', () => {
        mockUseLanguage.mockReturnValue({
            t: defaultT,
            language: 'en',
            setLanguage: setLanguageMock,
            availableLanguages: ['en'],
            direction: 'ltr',
        });
        const { unmount } = renderHeader();
        // The dropdown button shouldn't exist
        expect(screen.queryByLabelText('Select language')).not.toBeInTheDocument();
        unmount();
    });

    it('clears active section when scrolled to top', () => {
        renderHeader();
        act(() => {
            globalThis.scrollY = 0;
            fireEvent.scroll(globalThis as unknown as Window);
        });
        // No link should be active (nav links have "text-foreground/70")
        const homeLink = screen.getAllByText('Home')[1]; // Nav link
        // Hard to assert class removal without querying style, but checking it doesn't have active class works
        expect(homeLink).not.toHaveClass('text-primary');
    });

    it('clears body scroll lock on unmount', () => {
        const { unmount } = renderHeader();
        fireEvent.click(screen.getByLabelText('Open menu'));
        expect(document.body.style.overflow).toBe('hidden');
        unmount();
        expect(document.body.style.overflow).toBe('unset');
    });

    it('toggles language from mobile menu', () => {
        renderHeader();
        fireEvent.click(screen.getByLabelText('Open menu'));

        // Find mobile language toggle (it has flag and text inside button)
        // There are two flags (desktop and mobile). Mobile is rendered in Portal (last).
        const flags = screen.getAllByText('🇺🇸');
        const mobileLangBtn = flags.at(-1)?.closest('button');
        fireEvent.click(mobileLangBtn!);

        expect(setLanguageMock).toHaveBeenCalledWith('fr');
    });

    it('does not active section if below offset', () => {
        const mockServices = {
            getBoundingClientRect: jest.fn().mockReturnValue({ top: 300, height: 500 }),
        };
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'services') return mockServices as any;
            return null;
        });

        renderHeader();
        act(() => {
            globalThis.scrollY = 101;
            fireEvent.scroll(globalThis as unknown as Window);
        });

        const servicesLink = screen.getByTestId('link-#services');
        expect(servicesLink).not.toHaveClass('text-primary');
    });
});
