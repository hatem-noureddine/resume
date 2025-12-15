import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Test component to access language context
function TestConsumer() {
    const { language, setLanguage, t, toggleLanguage, availableLanguages } = useLanguage();
    return (
        <div>
            <span data-testid="current-language">{language}</span>
            <span data-testid="available-languages">{availableLanguages.join(',')}</span>
            <span data-testid="translation-test">{t.hero?.title || 'No title'}</span>
            <button onClick={() => setLanguage('fr')}>Set French</button>
            <button onClick={() => setLanguage('en')}>Set English</button>
            <button onClick={toggleLanguage}>Toggle Language</button>
        </div>
    );
}

describe('LanguageContext', () => {
    it('provides default language (en)', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });

    it('provides list of available languages', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        const availableLanguages = screen.getByTestId('available-languages').textContent;
        expect(availableLanguages).toContain('en');
        expect(availableLanguages).toContain('fr');
    });

    it('allows setting language to French', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        fireEvent.click(screen.getByText('Set French'));

        expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    });

    it('allows setting language to English', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        // First switch to French
        fireEvent.click(screen.getByText('Set French'));
        expect(screen.getByTestId('current-language')).toHaveTextContent('fr');

        // Then switch back to English
        fireEvent.click(screen.getByText('Set English'));
        expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });

    it('toggleLanguage cycles through available languages', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        const initialLanguage = screen.getByTestId('current-language').textContent;

        fireEvent.click(screen.getByText('Toggle Language'));

        const newLanguage = screen.getByTestId('current-language').textContent;
        expect(newLanguage).not.toBe(initialLanguage);
    });

    it('provides translation object', () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        // Should have some translation text
        const translationText = screen.getByTestId('translation-test').textContent;
        expect(translationText).toBeTruthy();
        expect(translationText).not.toBe('No title');
    });

    it('throws error when useLanguage is used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => render(<TestConsumer />)).toThrow(
            'useLanguage must be used within a LanguageProvider'
        );

        consoleSpy.mockRestore();
    });
});
