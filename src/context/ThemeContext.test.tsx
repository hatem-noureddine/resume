import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, configurable: true });

// Test component to access all theme context features
function TestConsumer() {
    const {
        theme,
        setTheme,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize
    } = useTheme();

    return (
        <div>
            <span data-testid="current-theme">{theme}</span>
            <span data-testid="high-contrast">{highContrast ? 'enabled' : 'disabled'}</span>
            <span data-testid="font-size">{fontSize}</span>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('light')}>Set Light</button>
            <button onClick={() => setTheme('system')}>Set System</button>
            <button onClick={() => setHighContrast(true)}>Enable High Contrast</button>
            <button onClick={() => setHighContrast(false)}>Disable High Contrast</button>
            <button onClick={() => setFontSize('small')}>Set Small Font</button>
            <button onClick={() => setFontSize('medium')}>Set Medium Font</button>
            <button onClick={() => setFontSize('large')}>Set Large Font</button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.removeAttribute('data-font-size');
    });

    describe('theme management', () => {
        it('provides default theme value', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
        });

        it('applies custom default theme', () => {
            render(
                <ThemeProvider defaultTheme="dark">
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        });

        it('allows setting theme to dark', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set Dark'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
        });

        it('allows setting theme to light', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set Light'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
        });

        it('uses custom storage key', () => {
            render(
                <ThemeProvider storageKey="custom-theme-key">
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set Dark'));
            expect(localStorageMock.setItem).toHaveBeenCalledWith('custom-theme-key', 'dark');
        });

        it('restores theme from localStorage', () => {
            localStorageMock.getItem.mockReturnValueOnce('light');
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
        });

        it('applies system theme when set to system', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set System'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
        });
    });

    describe('high contrast mode', () => {
        it('high contrast is disabled by default', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(screen.getByTestId('high-contrast')).toHaveTextContent('disabled');
        });

        it('allows enabling high contrast', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Enable High Contrast'));
            expect(screen.getByTestId('high-contrast')).toHaveTextContent('enabled');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('high-contrast-enabled', 'true');
        });

        it('allows disabling high contrast', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Enable High Contrast'));
            fireEvent.click(screen.getByText('Disable High Contrast'));
            expect(screen.getByTestId('high-contrast')).toHaveTextContent('disabled');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('high-contrast-enabled', 'false');
        });

        it('restores high contrast from localStorage', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'high-contrast-enabled') return 'true';
                return null;
            });
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(localStorageMock.getItem).toHaveBeenCalledWith('high-contrast-enabled');
        });
    });

    describe('font size', () => {
        it('font size is medium by default', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(screen.getByTestId('font-size')).toHaveTextContent('medium');
        });

        it('allows setting font size to small', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set Small Font'));
            expect(screen.getByTestId('font-size')).toHaveTextContent('small');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('font-size-preference', 'small');
        });

        it('allows setting font size to large', () => {
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('Set Large Font'));
            expect(screen.getByTestId('font-size')).toHaveTextContent('large');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('font-size-preference', 'large');
        });

        it('restores font size from localStorage', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'font-size-preference') return 'large';
                return null;
            });
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(localStorageMock.getItem).toHaveBeenCalledWith('font-size-preference');
        });

        it('ignores invalid font size from localStorage', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'font-size-preference') return 'invalid-size';
                return null;
            });
            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );
            expect(screen.getByTestId('font-size')).toHaveTextContent('medium');
        });
    });

    describe('context usage', () => {
        it('returns initial state when used outside provider', () => {
            render(<TestConsumer />);
            expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
            expect(screen.getByTestId('high-contrast')).toHaveTextContent('disabled');
            expect(screen.getByTestId('font-size')).toHaveTextContent('medium');
        });
    });
});
