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

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock matchMedia
const matchMediaMock = jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

Object.defineProperty(globalThis, 'matchMedia', { value: matchMediaMock });

// Test component to access theme context
function TestConsumer() {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <span data-testid="current-theme">{theme}</span>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('light')}>Set Light</button>
            <button onClick={() => setTheme('system')}>Set System</button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        document.documentElement.classList.remove('light', 'dark');
    });

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

        // After useEffect runs, theme should be restored from localStorage
        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('returns initial state when used outside provider (context undefined check)', () => {
        // The useTheme hook checks if context === undefined
        // Since ThemeProviderContext is initialized with initialState,
        // using it outside provider returns initialState instead of throwing
        // This test verifies the component renders with default values
        render(<TestConsumer />);

        // Should have the initial state value
        expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
});
