import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechCarousel } from './TechCarousel';

// Mock the carousel data
jest.mock('@/data/carousels.json', () => ({
    techs: [
        { name: 'Android', icon: '/icons/techs/android.svg' },
        { name: 'Kotlin', icon: '/icons/techs/kotlin.svg' },
        { name: 'Java', icon: '/icons/techs/java.svg' },
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
        const androidItems = screen.getAllByText('Android');
        expect(androidItems.length).toBeGreaterThan(0);

        const kotlinItems = screen.getAllByText('Kotlin');
        expect(kotlinItems.length).toBeGreaterThan(0);

        const javaItems = screen.getAllByText('Java');
        expect(javaItems.length).toBeGreaterThan(0);
    });

    it('renders gradient overlays for fade effect', () => {
        render(<TechCarousel />);

        // Check for left and right gradient divs
        const gradients = document.querySelectorAll('.absolute.inset-y-0');
        expect(gradients.length).toBe(2);
    });

    it('renders icon images', () => {
        render(<TechCarousel />);

        // Check for img elements
        const images = document.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);
    });

    it('renders animation container for infinite scroll', () => {
        render(<TechCarousel />);

        // Check for the animated container
        const animatedContainer = document.querySelector('.animate-infinite-scroll-half');
        expect(animatedContainer).toBeInTheDocument();
    });
});
