import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechCarousel } from './TechCarousel';

// Mock the carousel data
jest.mock('@/data/carousels.json', () => ({
    techs: [
        { name: 'React', icon: '/resume/icons/react.svg' },
        { name: 'Next.js', icon: '/resume/icons/nextjs.svg' },
        { name: 'TypeScript', icon: '/resume/icons/typescript.svg' },
    ],
}));

describe('TechCarousel', () => {
    it('renders the carousel container', () => {
        render(<TechCarousel />);

        // Check for the main container with overflow hidden
        const container = document.querySelector('.overflow-hidden');
        expect(container).toBeInTheDocument();
    });

    it('renders tech items with their names', () => {
        render(<TechCarousel />);

        // Multiple instances due to infinite scroll duplication
        const reactItems = screen.getAllByText('React');
        expect(reactItems.length).toBeGreaterThan(0);

        const nextjsItems = screen.getAllByText('Next.js');
        expect(nextjsItems.length).toBeGreaterThan(0);

        const typescriptItems = screen.getAllByText('TypeScript');
        expect(typescriptItems.length).toBeGreaterThan(0);
    });

    it('renders gradient overlays for fade effect', () => {
        render(<TechCarousel />);

        // Check for left and right gradient divs
        const gradients = document.querySelectorAll('.absolute.inset-y-0');
        expect(gradients.length).toBe(2);
    });

    it('renders icon elements with mask styles', () => {
        render(<TechCarousel />);

        // Check for icon elements with background-mask styling
        const icons = document.querySelectorAll('.w-8.h-8.bg-current');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('renders animation container for infinite scroll', () => {
        render(<TechCarousel />);

        // Check for the animated container
        const animatedContainer = document.querySelector('.animate-infinite-scroll');
        expect(animatedContainer).toBeInTheDocument();
    });
});
