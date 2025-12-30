import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { Experience } from '@/components/sections/Experience';
import { Certifications, Certification } from '@/components/sections/Certifications';

// --- Mocks ---

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @next/next/no-img-element
    default: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

// Mock framer-motion (simplified to render children)
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }: any) => <div className={className} onClick={onClick} {...props}>{children}</div>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        li: ({ children, className }: any) => <li className={className}>{children}</li>,
        button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
        section: ({ children, className, id }: any) => <section className={className} id={id}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollYProgress: { current: 0, onChange: jest.fn() } }),
    useSpring: () => 0,
    useTransform: () => 0,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Briefcase: () => <span data-testid="icon-briefcase" />,
    Calendar: () => <span data-testid="icon-calendar" />,
    Clock: () => <span data-testid="icon-clock" />,
    ChevronDown: () => <span data-testid="icon-chevron-down" />,
    ChevronUp: () => <span data-testid="icon-chevron-up" />,
    Filter: () => <span data-testid="icon-filter" />,
    X: () => <span data-testid="icon-x" />,
    Quote: () => <span data-testid="icon-quote" />,
    ChevronLeft: () => <span data-testid="icon-chevron-left" />,
    ChevronRight: () => <span data-testid="icon-chevron-right" />,
    Star: () => <span data-testid="icon-star" />,
    ExternalLink: () => <span data-testid="icon-external-link" />,
    Award: () => <span data-testid="icon-award" />,
    ShieldCheck: () => <span data-testid="icon-shield-check" />,
}));

// Mock specific components to reduce noise but keep structure if needed
jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: any) => (
        <div data-testid="section-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </div>
    )
}));

// Mock usePrefersReducedMotion
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => false
}));

// --- Test Data ---

const mockCertifications: Certification[] = [
    {
        name: 'Cert English',
        issuer: 'Issuer A',
        date: '2023-01-01',
        category: 'cloud',
        language: 'en'
    },
    {
        name: 'Cert French',
        issuer: 'Issuer B',
        date: '2023-01-01',
        category: 'cloud',
        language: 'fr'
    }
];


// Helper to set specific language
function LanguageSetter({ lang }: { lang: 'en' | 'fr' }) {
    const { setLanguage } = useLanguage();
    return (
        <button onClick={() => setLanguage(lang)} data-testid={`set-lang-${lang}`}>
            Set {lang}
        </button>
    );
}

describe('Context Integration Tests', () => {
    // Basic local storage mock
    const localStorageMock = (function () {
        let store: Record<string, string> = {};
        return {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value.toString();
            },
            clear: () => {
                store = {};
            },
            removeItem: (key: string) => {
                delete store[key];
            }
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
    });

    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    it('propagates language changes to Certifications component', async () => {
        render(
            <LanguageProvider>
                <LanguageSetter lang="en" />
                <LanguageSetter lang="fr" />
                <Certifications items={mockCertifications} />
            </LanguageProvider>
        );

        // Should show English cert
        expect(screen.getByText('Cert English')).toBeInTheDocument();
        expect(screen.queryByText('Cert French')).not.toBeInTheDocument();

        // Switch to French
        const setFrBtn = screen.getByTestId('set-lang-fr');
        fireEvent.click(setFrBtn);

        // Should now show French cert
        // Using findByText to allow for any async updates
        expect(await screen.findByText('Cert French')).toBeInTheDocument();
        expect(screen.queryByText('Cert English')).not.toBeInTheDocument();
    });

    it('propagates language changes to Experience component', async () => {
        render(
            <LanguageProvider>
                <LanguageSetter lang="en" />
                <LanguageSetter lang="fr" />
                <Experience />
            </LanguageProvider>
        );

        // Check for English text (default from dictionary)
        // Note: The dictionary is imported in context, we assume standard dict has 'Work History'
        expect(screen.getAllByText(/Work History/i)[0]).toBeInTheDocument();

        // Switch to French
        fireEvent.click(screen.getByTestId('set-lang-fr'));

        // Check for French text explicitly
        expect(await screen.findByText("Parcours Professionnel")).toBeInTheDocument();
        expect(screen.queryByText('Work History')).not.toBeInTheDocument();
    });


    it('updates HTML dir attribute when switching to Arabic', () => {
        // Create a specific component for this test to use the hook
        const TestComponent = () => {
            const { setLanguage } = useLanguage();
            return <button onClick={() => setLanguage('ar')} data-testid="set-ar">Arabic</button>;
        }

        render(
            <LanguageProvider>
                <TestComponent />
            </LanguageProvider>
        );

        const btn = screen.getByTestId('set-ar');
        fireEvent.click(btn);

        expect(document.documentElement.dir).toBe('rtl');
        expect(document.documentElement.lang).toBe('ar');
    });
});
