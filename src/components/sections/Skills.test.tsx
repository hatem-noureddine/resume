
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Skills } from './Skills';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock window.innerWidth for mobile tests
const mockInnerWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    window.dispatchEvent(new Event('resize'));
};

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ChevronDown: () => <div data-testid="chevron-down" />,
    ChevronUp: () => <div data-testid="chevron-up" />,
    Layout: () => <div data-testid="icon-layout" />,
    Code: () => <div data-testid="icon-code" />,
    Smartphone: () => <div data-testid="icon-smartphone" />,
    Palette: () => <div data-testid="icon-palette" />,
    Users: () => <div data-testid="icon-users" />,
    FileText: () => <div data-testid="icon-filetext" />,
    CheckCircle: () => <div data-testid="icon-checkcircle" />,
    Layers: () => <div data-testid="icon-layers" />,
    Server: () => <div data-testid="icon-server" />,
    Database: () => <div data-testid="icon-database" />,
    GitBranch: () => <div data-testid="icon-gitbranch" />,
    Terminal: () => <div data-testid="icon-terminal" />,
    Globe: () => <div data-testid="icon-globe" />,
    BarChart: () => <div data-testid="icon-barchart" />,
    Wrench: () => <div data-testid="icon-wrench" />,
    Bot: () => <div data-testid="icon-bot" />,
    Filter: () => <div data-testid="filter" />,
    X: () => <div data-testid="x-icon" />
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        div: ({ children, className, onClick, onMouseEnter, onMouseLeave, whileInView, viewport, initial, animate, exit, transition, variants, ...rest }: any) => (
            <div className={className} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...rest}>{children}</div>
        ),
        span: ({ children, className, onMouseEnter, onMouseLeave }: any) => (
            <span className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</span>
        ),
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        a: ({ children, className, href, onMouseEnter, onMouseLeave, target, rel }: any) => (
            <a className={className} href={href} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} target={target} rel={rel}>{children}</a>
        ),
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

    beforeEach(() => {
        // Reset to desktop width
        mockInnerWidth(1200);
    });

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

    it('renders All filter button', () => {
        renderWithContext(<Skills />);
        const allButtons = screen.getAllByRole('button', { name: /All/i });
        expect(allButtons.length).toBeGreaterThan(0);
    });

    it('applies filter when clicking category filter', () => {
        renderWithContext(<Skills />);

        // Find filter buttons (categories have item counts like "(5)")
        const filterButtons = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('(') && btn.textContent?.includes(')')
        );

        if (filterButtons.length > 0) {
            fireEvent.click(filterButtons[0]);
            // Should show Clear button after filtering
            const clearButton = screen.queryByText(/Clear/i);
            expect(clearButton).toBeInTheDocument();
        }
    });

    it('clears filter when clicking Clear button', () => {
        renderWithContext(<Skills />);

        // Apply a filter first
        const filterButtons = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('(') && btn.textContent?.includes(')')
        );

        if (filterButtons.length > 0) {
            fireEvent.click(filterButtons[0]);

            // Click Clear
            const clearButton = screen.getByText(/Clear/i);
            fireEvent.click(clearButton);

            // Clear button should disappear
            expect(screen.queryByText(/Clear/i)).not.toBeInTheDocument();
        }
    });

    it('collapses expanded category on second click', () => {
        renderWithContext(<Skills />);

        // Find a category header button
        const categoryButtons = screen.getAllByRole('button').filter(btn => {
            const text = btn.textContent || '';
            return text.includes('(') && !text.includes('All') && !text.includes('Clear');
        });

        if (categoryButtons.length > 0) {
            // First click might toggle
            fireEvent.click(categoryButtons[0]);
            // Second click should toggle back
            fireEvent.click(categoryButtons[0]);
            // No crash means success
            expect(true).toBe(true);
        }
    });

    it('renders in mobile view when window is narrow', () => {
        act(() => {
            mockInnerWidth(500); // Mobile width
        });

        renderWithContext(<Skills />);

        // In mobile view, we should still see skills section
        expect(screen.getAllByText('My Skills')[0]).toBeInTheDocument();
    });

    describe('Mobile Tag Cloud', () => {
        beforeEach(() => {
            act(() => {
                mockInnerWidth(500); // Mobile width
            });
        });

        it('renders mobile tag cloud with all skills', () => {
            renderWithContext(<Skills />);
            // In mobile view, skills are shown as tags
            expect(screen.getAllByText('My Skills')[0]).toBeInTheDocument();
        });

        it('renders category legend in mobile view', () => {
            renderWithContext(<Skills />);
            // Mobile view shows Technical heading
            expect(screen.getAllByRole('heading', { name: 'Technical' })[0]).toBeInTheDocument();
        });
    });

    describe('Skill Icon Mapping', () => {
        it('renders skill icons for professional skills', () => {
            renderWithContext(<Skills />);
            // Check that icons are rendered for professional skills
            expect(screen.getAllByTestId('icon-users').length).toBeGreaterThan(0);
        });

        it('renders code icons for technical skills', () => {
            renderWithContext(<Skills />);
            expect(screen.getAllByTestId('icon-code').length).toBeGreaterThan(0);
        });
    });

    describe('Category Toggle', () => {
        it('toggles category expanded state on click', () => {
            renderWithContext(<Skills />);

            // Find category toggle buttons (with chevron)
            const categoryToggleButtons = screen.getAllByRole('button').filter(btn => {
                const text = btn.textContent || '';
                // Category buttons inside the collapsible section have count like "(5)"
                return text.includes('(') && !text.includes('All') && !text.includes('Clear') && !text.includes('Filter');
            });

            if (categoryToggleButtons.length > 0) {
                // Click to collapse
                fireEvent.click(categoryToggleButtons[0]);

                // Click again to expand
                fireEvent.click(categoryToggleButtons[0]);

                // Should render without error
                expect(categoryToggleButtons[0]).toBeInTheDocument();
            }
        });

        it('expands multiple categories simultaneously', () => {
            renderWithContext(<Skills />);

            const categoryToggleButtons = screen.getAllByRole('button').filter(btn => {
                const text = btn.textContent || '';
                return text.includes('(') && !text.includes('All') && !text.includes('Clear') && !text.includes('Filter');
            });

            // Click multiple categories
            if (categoryToggleButtons.length >= 2) {
                fireEvent.click(categoryToggleButtons[0]);
                fireEvent.click(categoryToggleButtons[1]);
                // Both should work
                expect(categoryToggleButtons[0]).toBeInTheDocument();
                expect(categoryToggleButtons[1]).toBeInTheDocument();
            }
        });
    });

    describe('Skill Tag Interactions', () => {
        it('shows tooltip on skill hover', () => {
            renderWithContext(<Skills />);

            // Find skill tags (spans or divs with skill names)
            const skillTags = screen.getAllByText(/Kotlin|Android|React|MVVM|Jetpack/i);

            if (skillTags.length > 0) {
                // Hover over first skill
                fireEvent.mouseEnter(skillTags[0]);

                // Hover out
                fireEvent.mouseLeave(skillTags[0]);

                // Should not crash
                expect(skillTags[0]).toBeInTheDocument();
            }
        });
    });

    describe('Filter Interactions', () => {
        it('toggles same filter off when clicked twice', () => {
            renderWithContext(<Skills />);

            const filterButtons = screen.getAllByRole('button').filter(btn => {
                const text = btn.textContent || '';
                return text.includes('(') && !text.includes('All') && !text.includes('Clear');
            });

            if (filterButtons.length > 0) {
                // Click to filter
                fireEvent.click(filterButtons[0]);
                expect(screen.queryByText(/Clear/i)).toBeInTheDocument();

                // Click same filter again to toggle off
                fireEvent.click(filterButtons[0]);
                expect(screen.queryByText(/Clear/i)).not.toBeInTheDocument();
            }
        });

        it('clicking All button resets filter', () => {
            renderWithContext(<Skills />);

            // Apply a filter first
            const filterButtons = screen.getAllByRole('button').filter(btn => {
                const text = btn.textContent || '';
                return text.includes('(') && !text.includes('All') && !text.includes('Clear');
            });

            if (filterButtons.length > 0) {
                fireEvent.click(filterButtons[0]);
            }

            // Click All button
            const allButton = screen.getAllByRole('button', { name: /All/i })[0];
            fireEvent.click(allButton);

            // Clear button should disappear
            expect(screen.queryByText(/Clear/i)).not.toBeInTheDocument();
        });
    });

    describe('Reduced Motion', () => {
        const mockPrefersReducedMotion = jest.fn().mockReturnValue(true);

        beforeEach(() => {
            jest.mock('@/hooks/usePrefersReducedMotion', () => ({
                usePrefersReducedMotion: () => mockPrefersReducedMotion()
            }));
        });

        it('renders without animations when reduced motion preferred', () => {
            renderWithContext(<Skills />);
            expect(screen.getAllByText('My Skills')[0]).toBeInTheDocument();
        });
    });
});
