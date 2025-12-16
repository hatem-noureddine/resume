import { render, screen } from '@testing-library/react';
import { Services } from './Services';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} onClick={onClick} {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock SectionHeading
jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div data-testid="section-heading">
            <h2>{title}</h2>
            <span>{subtitle}</span>
        </div>
    )
}));

// Mock Button
jest.mock('@/components/ui/Button', () => ({
    Button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

const renderWithProviders = () => {
    return render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
            <LanguageProvider>
                <Services />
            </LanguageProvider>
        </ThemeProvider>
    );
};

describe('Services Component', () => {
    it('renders the section with correct id', () => {
        renderWithProviders();
        expect(document.getElementById('services')).toBeInTheDocument();
    });

    it('displays section heading with title', () => {
        renderWithProviders();
        expect(screen.getByTestId('section-heading')).toBeInTheDocument();
        expect(screen.getByText('My Services')).toBeInTheDocument();
    });

    it('renders service cards on desktop', () => {
        renderWithProviders();
        // Services render in both mobile and desktop views, so use getAllByText
        expect(screen.getAllByText('Web Design').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Development').length).toBeGreaterThan(0);
        expect(screen.getAllByText('UI/UX Design').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Graphics Design').length).toBeGreaterThan(0);
    });

    it('displays service descriptions', () => {
        renderWithProviders();
        expect(screen.getAllByText(/visually stunning/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/robust and scalable/i).length).toBeGreaterThan(0);
    });
});
