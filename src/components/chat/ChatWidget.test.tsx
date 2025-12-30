import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatWidget } from './ChatWidget';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock framer-motion - filter out motion-specific props
const filterMotionProps = (props: Record<string, unknown>) => {
    const motionProps = ['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'variants', 'layout', 'layoutId'];
    return Object.fromEntries(
        Object.entries(props).filter(([key]) => !motionProps.includes(key))
    );
};

jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
            <button {...filterMotionProps(props) as React.ButtonHTMLAttributes<HTMLButtonElement>}>{children}</button>
        ),
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
            <div {...filterMotionProps(props) as React.HTMLAttributes<HTMLDivElement>}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock fetch for chat API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock resume context
jest.mock('@/config/resume', () => ({
    RESUME_CONTEXT: {
        name: 'Test User',
        email: 'test@example.com',
        portfolio: {
            linkedin: 'https://linkedin.com/test',
            website: 'https://test.com',
        },
    },
}));

import { ChatUIProvider } from '@/context/ChatUIContext';

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <LanguageProvider>
            <ChatUIProvider>
                {ui}
            </ChatUIProvider>
        </LanguageProvider>
    );
};

describe('ChatWidget', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn()
                        .mockResolvedValueOnce({
                            done: false,
                            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n'),
                        })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        });
    });

    it('renders the floating chat button', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        expect(button).toBeInTheDocument();
    });

    it('shows unread badge on initial load', () => {
        renderWithProviders(<ChatWidget />);

        // Should show unread count badge
        const badge = screen.getByText('1');
        expect(badge).toBeInTheDocument();
    });

    it('opens chat window when button is clicked', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(button);

        // Chat header should be visible
        expect(screen.getByText(/Let's Connect/i)).toBeInTheDocument();
    });

    it('shows quick action buttons in header when open', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(button);

        // Quick action buttons
        expect(screen.getByText(/Contact Me/i)).toBeInTheDocument();
        expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    });

    it('shows input field when chat is open', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(button);

        const input = screen.getByPlaceholderText(/Ask about experience/i);
        expect(input).toBeInTheDocument();
    });

    it('allows typing in the input field', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(button);

        const input = screen.getByPlaceholderText(/Ask about experience/i);
        fireEvent.change(input, { target: { value: 'Hello' } });

        expect(input).toHaveValue('Hello');
    });

    it('has accessible aria-label on chat button', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        expect(button).toHaveAttribute('aria-label');
    });

    it('email quick action link has correct href', () => {
        renderWithProviders(<ChatWidget />);

        const button = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(button);

        const emailLink = screen.getByText(/Contact Me/i).closest('a');
        expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    });
});
