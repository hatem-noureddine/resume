import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Header } from './Header';
import { useLanguage } from '@/context/LanguageContext';
import { useFeatureFlags } from '@/context/FeatureFlags';

jest.mock('@/context/LanguageContext', () => ({ useLanguage: jest.fn() }));
jest.mock('@/context/FeatureFlags', () => ({ useFeatureFlags: jest.fn() }));
jest.mock('@/components/ui/ThemeToggle', () => ({ ThemeToggle: () => <div data-testid="theme-toggle" /> }));
jest.mock('@/components/ui/Logo', () => ({ Logo: () => <div data-testid="logo" /> }));
// FIX: Pass className to anchor
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a> }));
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Header', () => {
    const mockSetLanguage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        (useLanguage as jest.Mock).mockReturnValue({
            t: {
                header: { nav: [{ name: 'Home', href: '/' }, { name: 'Services', href: '#services' }] },
                contact: { title: 'Contact' },
                portfolio: { items: ['proj1'] },
            },
            language: 'en', setLanguage: mockSetLanguage, availableLanguages: ['en', 'fr'], direction: 'ltr'
        });
        (useFeatureFlags as jest.Mock).mockReturnValue({ isEnabled: jest.fn().mockReturnValue(true) });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('updates scroll progress and active section', async () => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => { cb(Date.now()); return 1; });

        render(<Header />);

        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'services') {
                const el = document.createElement('div');
                jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 50, bottom: 150, left: 0, right: 0, width: 100, height: 100 } as DOMRect);
                return el;
            }
            return null;
        });

        act(() => {
            fireEvent.scroll(window, { target: { scrollY: 200 } });
            jest.runAllTimers();
        });

        await waitFor(() => {
            const servicesLink = screen.getAllByText('Services')[0];
            expect(servicesLink.closest('a')).toHaveClass('text-primary');
        });
    });

    it('renders logo', () => {
        render(<Header />);
        expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('switches language', () => {
        render(<Header />);
        const langBtn = screen.getByLabelText('Select language');
        fireEvent.click(langBtn);
        const frOption = screen.getByText('Français');
        fireEvent.click(frOption.closest('button')!);
        expect(mockSetLanguage).toHaveBeenCalledWith('fr');
    });

    it('closes language menu on outside click', () => {
        render(<Header />);
        const langBtn = screen.getByLabelText('Select language');
        fireEvent.click(langBtn);
        expect(screen.getByText('Français')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Français')).not.toBeInTheDocument();
    });
});
