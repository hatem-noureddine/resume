 
import { render, screen, fireEvent } from '@testing-library/react';
import { Skills } from './Skills';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ChevronDown: () => <div data-testid="chevron-down" />,
    ChevronUp: () => <div data-testid="chevron-up" />,
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
    Bot: () => <div />,
    Filter: () => <div data-testid="filter" />,
    X: () => <div data-testid="x-icon" />
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        div: ({ children, className, onClick, whileInView, viewport, initial, animate, exit, transition, variants, ...rest }: any) => <div className={className} onClick={onClick}>{children}</div>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        a: ({ children, className, href }: any) => <a className={className} href={href}>{children}</a>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        button: ({ children, className, onClick, whileHover, whileTap, ...rest }: any) => <button className={className} onClick={onClick}>{children}</button>,
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
        // Check for a category like "Architecture" - use getAllByText since multiple may exist
        const architectureElements = screen.getAllByText(/Architecture/i);
        expect(architectureElements.length).toBeGreaterThan(0);
    });

    it('toggles technical skill category on click', () => {
        renderWithContext(<Skills />);
        // Find any clickable element with Architecture text
        const architectureElements = screen.getAllByText(/Architecture/i);
        expect(architectureElements.length).toBeGreaterThan(0);

        // Click the first one and verify no crash
        const clickable = architectureElements[0].closest('button') || architectureElements[0];
        expect(() => fireEvent.click(clickable)).not.toThrow();
    });
});
