import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock components
jest.mock('./TechCarousel', () => ({
    TechCarousel: () => <div data-testid="tech-carousel" />
}));
jest.mock('./ClientCarousel', () => ({
    ClientCarousel: () => <div data-testid="client-carousel" />
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
    }
}));

describe('Hero Component', () => {
    const renderWithContext = (component: React.ReactNode) => {
        return render(
            <LanguageProvider>
                {component}
            </LanguageProvider>
        );
    };

    it('renders hero content', () => {
        renderWithContext(<Hero />);
        // Assuming default content from en.ts
        expect(screen.getByText(/Creative Designer/i)).toBeInTheDocument();
        expect(screen.getByText(/Years of Experience/i)).toBeInTheDocument();
    });

    it('renders specialized carousels', () => {
        renderWithContext(<Hero />);
        expect(screen.getByTestId('tech-carousel')).toBeInTheDocument();
        expect(screen.getByTestId('client-carousel')).toBeInTheDocument();
    });
});
