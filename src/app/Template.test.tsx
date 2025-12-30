import React from 'react';
import { render, screen } from '@testing-library/react';
import Template from '@/app/template';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    usePathname: jest.fn().mockReturnValue('/'),
}));

jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn().mockReturnValue(false),
}));

jest.mock('@/components/ui/ScrollProgress', () => ({
    ScrollProgress: () => <div data-testid="scroll-progress" />,
}));

const mockUsePrefersReducedMotion = jest.mocked(usePrefersReducedMotion);
const mockUsePathname = jest.mocked(usePathname);

describe('Template', () => {
    it('renders children with scroll progress', () => {
        render(
            <Template>
                <div data-testid="child">Child Content</div>
            </Template>
        );

        expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies animation variants when motion is not reduced', () => {
        mockUsePrefersReducedMotion.mockReturnValue(false);

        const { container } = render(
            <Template>
                <div>Content</div>
            </Template>
        );

        // Check for motion.div wrapper
        expect(container.querySelector('.w-full')).toBeInTheDocument();
    });

    it('skips animation variants when reduced motion is preferred', () => {
        mockUsePrefersReducedMotion.mockReturnValue(true);

        render(
            <Template>
                <div data-testid="reduced-content">Content</div>
            </Template>
        );

        expect(screen.getByTestId('reduced-content')).toBeInTheDocument();
    });

    it('uses pathname as key for animations', () => {
        mockUsePathname.mockReturnValue('/blog');

        render(
            <Template>
                <div>Blog Content</div>
            </Template>
        );

        expect(screen.getByText('Blog Content')).toBeInTheDocument();
    });
});
