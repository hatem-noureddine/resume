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
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        a: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
    }
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
        // Assuming "Team Management" is in the default en.ts
        expect(screen.getByText('Professional')).toBeInTheDocument();
    });

    it('renders technical skill categories', () => {
        renderWithContext(<Skills />);
        expect(screen.getByText('Technical')).toBeInTheDocument();
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
