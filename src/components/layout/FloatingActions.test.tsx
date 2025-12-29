"use client";

import { render, screen, fireEvent, act } from '@testing-library/react';
import { FloatingActions } from './FloatingActions';
import { useLanguage } from '@/context/LanguageContext';

// Mock useLanguage
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: jest.fn(() => ({
        t: { hero: { downloadCV: 'Download CV' } },
        language: 'en',
        direction: 'ltr',
    })),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
        a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <a {...props}>{children}</a>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('FloatingActions', () => {
    beforeEach(() => {
        // Reset scroll position
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        (useLanguage as jest.Mock).mockReturnValue({
            t: { hero: { downloadCV: 'Download CV' } },
            language: 'en',
            direction: 'ltr',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<FloatingActions />);
    });

    it('is hidden when scrollY is 0', () => {
        const { container } = render(<FloatingActions />);
        // The motion.div wrapper should not render children when not visible
        expect(container.querySelector('a[href*="mailto"]')).not.toBeInTheDocument();
    });

    it('becomes visible when scrolling past 300px', () => {
        const { container } = render(<FloatingActions />);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
            fireEvent.scroll(window);
        });

        // After scrolling, social links should be visible
        expect(container.querySelector('a[href*="github"]')).toBeInTheDocument();
    });

    it('hides when scrolling back to top', () => {
        const { container } = render(<FloatingActions />);

        // Scroll down first
        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
            fireEvent.scroll(window);
        });

        // Scroll back up
        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
            fireEvent.scroll(window);
        });

        expect(container.querySelector('a[href*="github"]')).not.toBeInTheDocument();
    });

    it('handles RTL direction correctly', () => {
        (useLanguage as jest.Mock).mockReturnValue({
            t: { hero: { downloadCV: 'تحميل السيرة' } },
            language: 'ar',
            direction: 'rtl',
        });

        const { container } = render(<FloatingActions />);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
            fireEvent.scroll(window);
        });

        expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('cleans up scroll listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = render(<FloatingActions />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('handles missing hero translation gracefully', () => {
        (useLanguage as jest.Mock).mockReturnValue({
            t: {},
            language: 'en',
            direction: 'ltr',
        });

        render(<FloatingActions />);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
            fireEvent.scroll(window);
        });

        // Should still render with fallback text
        expect(screen.getByText('CV')).toBeInTheDocument();
    });
});
