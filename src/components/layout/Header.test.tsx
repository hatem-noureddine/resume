import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

// Mock Dependencies
const mockSetLanguage = jest.fn();
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            header: {
                nav: [
                    { name: 'Home', href: '/' },
                    { name: 'Blog', href: '/blog' }
                ],
                hireMe: 'Hire Me'
            },
            portfolio: {
                items: [{ title: 'P1' }] // Enable portfolio link
            },
            hero: {
                availableForHire: 'Available for Hire'
            }
        },
        language: 'en',
        setLanguage: mockSetLanguage,
        availableLanguages: ['en', 'fr']
    })
}));

jest.mock('@/components/ui/ThemeToggle', () => ({
    ThemeToggle: () => <button>ThemeToggle</button>
}));

jest.mock('@/components/ui/Logo', () => ({
    Logo: () => <div>Logo</div>
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, onClick }: any) => <a href={href} onClick={onClick}>{children}</a>,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    Menu: ({ onClick }: any) => <div onClick={onClick} role="button">Menu</div>,
    X: ({ onClick }: any) => <div onClick={onClick} role="button">Close</div>,
    ChevronDown: () => <div>Chevron</div>,
    Check: () => <div>Check</div>,
    Sparkles: () => <div>Sparkles</div>,
}));

describe('Header Component', () => {
    it('renders navigation links', () => {
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Available for Hire')).toBeInTheDocument();
    });

    it('toggles language menu', () => {
        render(<Header />);
        // Use getAllByText because mobile/desktop or other text might match. Limit to the button trigger.
        // The language button is visible.
        const langButton = screen.getAllByText(/en/i)[0];
        fireEvent.click(langButton);
        // Should show 'FR' option
        expect(screen.getAllByText(/fr/i)[0]).toBeInTheDocument();
    });

    it('changes language on click', () => {
        render(<Header />);
        const langButton = screen.getAllByText(/en/i)[0];
        fireEvent.click(langButton);
        const frOption = screen.getAllByText(/fr/i)[0];
        fireEvent.click(frOption);
        expect(mockSetLanguage).toHaveBeenCalledWith('fr');
    });
});
