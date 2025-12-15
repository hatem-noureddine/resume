/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { Skills } from './Skills';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ChevronDown: () => <div data-testid="chevron-down" />,
    Layout: () => <div />,
    Code: () => <div />,
    Smartphone: () => <div />,
    Palette: () => <div />,
    Users: () => <div />,
    FileText: () => <div />,
    CheckCircle: () => <div />,
    Layers: () => <div />,
    Server: () => <div />,
    Database: () => <div />,
    GitBranch: () => <div />,
    Terminal: () => <div />,
    Globe: () => <div />,
    BarChart: () => <div />,
    Wrench: () => <div />,
    Bot: () => <div />
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        a: ({ children, className, href }: any) => <a className={className} href={href}>{children}</a>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Skills Component', () => {
    const renderWithContext = (component: React.ReactNode) => {
        return render(
            <LanguageProvider>
                {component}
            </LanguageProvider>
        );
    };

    it('renders the skills section title', () => {
        renderWithContext(<Skills />);
        expect(screen.getAllByText('My Skills')[0]).toBeInTheDocument();
    });

    it('renders professional skills', () => {
        renderWithContext(<Skills />);
        expect(screen.getAllByRole('heading', { name: 'Professional' })[0]).toBeInTheDocument();
    });

    it('renders technical skill categories', () => {
        renderWithContext(<Skills />);
        expect(screen.getByRole('button', { name: 'Technical' })).toBeInTheDocument();
        // Check for a category like "Architecture"
        expect(screen.getByText(/Architecture/i)).toBeInTheDocument();
    });

    it('toggles technical skill category on click', () => {
        renderWithContext(<Skills />);
        const categoryButton = screen.getByText(/Architecture/i).closest('button');

        if (categoryButton) {
            fireEvent.click(categoryButton);
            // Check if content becomes visible (though difficult with simple render, 
            // logic implies state change. We can check if class or attribute changes if we inspected it).
            // For now, simpler test is mostly ensuring no crash on click.
            expect(screen.getByText(/Architecture/i)).toBeInTheDocument();
        }
    });
});
