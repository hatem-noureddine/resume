import { render, screen, fireEvent } from '@/test/utils';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { haptic } from '@/lib/haptic';

// Mock haptic utility
jest.mock('@/lib/haptic', () => ({
    haptic: {
        subtle: jest.fn(),
    },
}));

describe('Persistence & UX Integration Flows', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        document.documentElement.className = '';
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
    });

    describe('Theme Persistence', () => {
        const ThemePicker = () => {
            const { theme, setTheme } = useTheme();
            return (
                <div>
                    <span data-testid="current-theme">{theme}</span>
                    <button onClick={() => setTheme('dark')} data-testid="set-dark">Dark</button>
                    <button onClick={() => setTheme('light')} data-testid="set-light">Light</button>
                </div>
            );
        };

        it('updates localStorage and document class when changing theme', () => {
            render(
                <ThemeProvider>
                    <ThemePicker />
                </ThemeProvider>
            );

            const setDarkBtn = screen.getByTestId('set-dark');
            fireEvent.click(setDarkBtn);

            expect(localStorage.getItem('theme')).toBe('dark');
            expect(document.documentElement.classList.contains('dark')).toBe(true);
            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        });

        it('restores theme from localStorage on mount', () => {
            localStorage.setItem('theme', 'dark');

            render(
                <ThemeProvider>
                    <ThemePicker />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });
    });

    describe('Language Persistence', () => {
        const LanguagePicker = () => {
            const { language, setLanguage } = useLanguage();
            return (
                <div>
                    <span data-testid="current-lang">{language}</span>
                    <button onClick={() => setLanguage('fr')} data-testid="set-fr">French</button>
                </div>
            );
        };

        it('restores language from localStorage on mount', () => {
            localStorage.setItem('language', 'fr');

            render(
                <LanguageProvider>
                    <LanguagePicker />
                </LanguageProvider>
            );

            // Context uses useEffect to load from storage, so we might need a tick
            expect(screen.getByTestId('current-lang')).toHaveTextContent('fr');
            expect(document.documentElement.lang).toBe('fr');
        });
    });

    describe('Haptic Feedback Integration', () => {
        it('calls haptic feedback when withHaptic is true', () => {
            render(<Button withHaptic onClick={() => { }}>Click Me</Button>);

            fireEvent.click(screen.getByText('Click Me'));

            expect(haptic.subtle).toHaveBeenCalledTimes(1);
        });

        it('does not call haptic feedback when withHaptic is false', () => {
            render(<Button onClick={() => { }}>Click Me</Button>);

            fireEvent.click(screen.getByText('Click Me'));

            expect(haptic.subtle).not.toHaveBeenCalled();
        });
    });
});
