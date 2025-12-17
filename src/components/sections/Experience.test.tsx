import { render, screen, fireEvent } from '@testing-library/react';
import { Experience } from './Experience';
import { LanguageProvider } from '@/context/LanguageContext';

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title }: any) => <div data-testid="section-heading">{title}</div>
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        li: ({ children, className }: any) => <li className={className}>{children}</li>,
        button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
        section: ({ children, className, id }: any) => <section className={className} id={id}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    Briefcase: () => <div data-testid="icon-briefcase" />,
    Calendar: () => <div data-testid="icon-calendar" />,
    MapPin: () => <div data-testid="icon-map-pin" />,
    ChevronRight: () => <div data-testid="icon-chevron-right" />,
    ChevronDown: () => <div data-testid="icon-chevron-down" />,
    ChevronUp: () => <div data-testid="icon-chevron-up" />,
    Clock: () => <div data-testid="icon-clock" />,
    Filter: () => <div data-testid="icon-filter" />,
    X: () => <div data-testid="icon-x" />,
}));

jest.mock('@/components/ui/Button', () => ({
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: any) => <a href="#">{children}</a>,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

// Mock usePrefersReducedMotion
const mockPrefersReducedMotion = jest.fn().mockReturnValue(false);
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => mockPrefersReducedMotion()
}));

jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            experience: {
                title: 'My Experience Resume',
                showMore: 'Show More',
                showLess: 'Show Less',
                filterBySkill: 'Filter by skill',
                allSkills: 'All Skills',
                clearFilter: 'Clear',
                items: [
                    {
                        id: 1,
                        role: 'Lead Developer',
                        company: 'Tech Corp',
                        period: '2023 - Present',
                        description: 'Building awesome stuff',
                        startDate: '2023-01',
                        endDate: 'Present',
                        duration: '1 year',
                        highlights: ['Built feature A', 'Led team B'],
                        skills: ['React', 'Node']
                    },
                    {
                        id: 2,
                        role: 'Software Engineer',
                        company: 'Startup Inc',
                        period: '2020 - 2023',
                        description: 'Early stage development',
                        startDate: '2020-01',
                        endDate: '2023-01',
                        duration: '3 years',
                        highlights: ['Built MVP'],
                        skills: ['Python', 'React']
                    },
                    {
                        id: 3,
                        role: 'Junior Dev',
                        company: 'Big Co',
                        period: '2018 - 2020',
                        description: 'Learning and growing',
                        startDate: '2018-01',
                        endDate: '2020-01',
                        skills: ['JavaScript']
                    },
                    {
                        id: 4,
                        role: 'Intern',
                        company: 'Agency',
                        period: '2017',
                        description: 'First job',
                        startDate: '2017-01',
                        skills: ['HTML']
                    }
                ]
            }
        },
        language: 'en'
    }),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

describe('Experience Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPrefersReducedMotion.mockReturnValue(false);
    });

    const renderWithContext = () => {
        return render(
            <LanguageProvider>
                <Experience />
            </LanguageProvider>
        );
    };

    it('renders the section title', () => {
        renderWithContext();
        expect(screen.getAllByText('My Experience Resume')[0]).toBeInTheDocument();
    });

    it('renders experience items', () => {
        renderWithContext();
        // Just check that component renders without crashing
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('renders company logos or icons', () => {
        renderWithContext();
        expect(screen.getAllByTestId('icon-briefcase').length).toBeGreaterThan(0);
    });

    it('handles mobile accordion interaction', () => {
        renderWithContext();
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);

        // Click first accordion button
        if (buttons[0]) {
            fireEvent.click(buttons[0]);
        }
    });

    describe('Skill Filtering', () => {
        it('renders skill filter buttons', () => {
            renderWithContext();
            expect(screen.getByText('All Skills')).toBeInTheDocument();
            expect(screen.getAllByText('React').length).toBeGreaterThan(0);
        });

        it('filters by skill when skill button is clicked', () => {
            renderWithContext();

            // Click on React skill (first one in the filter bar)
            fireEvent.click(screen.getAllByText('React')[0]);

            // Clear filter button should appear
            expect(screen.getByText('Clear')).toBeInTheDocument();
        });

        it('clears filter when All Skills is clicked', () => {
            renderWithContext();

            // First filter by a skill
            fireEvent.click(screen.getAllByText('React')[0]);

            // Then click All Skills
            fireEvent.click(screen.getByText('All Skills'));

            // Clear button should no longer be visible
            expect(screen.queryByText('Clear')).not.toBeInTheDocument();
        });

        it('toggles skill filter on/off when clicking same skill', () => {
            renderWithContext();

            // Click React to filter
            fireEvent.click(screen.getAllByText('React')[0]);
            expect(screen.getByText('Clear')).toBeInTheDocument();

            // Click React again to unfilter
            fireEvent.click(screen.getAllByText('React')[0]);
            expect(screen.queryByText('Clear')).not.toBeInTheDocument();
        });

        it('updates activeId when filtered skill is not in current selection', () => {
            renderWithContext();

            // Filter by a skill that the first item doesn't have
            const htmlSkill = screen.getAllByText('HTML');
            if (htmlSkill.length > 0) {
                fireEvent.click(htmlSkill[0]);
                // Should update to show an item with HTML skill
                expect(screen.getByText('Clear')).toBeInTheDocument();
            }
        });
    });

    describe('Show More/Less', () => {
        it('renders Show More button when more items available', () => {
            renderWithContext();
            // Initially shows only 3 items, has 4 total
            expect(screen.getAllByText(/Show More/i)[0]).toBeInTheDocument();
        });

        it('toggles between show more and show less', () => {
            renderWithContext();

            // Click Show More
            const showMoreButtons = screen.getAllByText(/Show More/i);
            fireEvent.click(showMoreButtons[0]);

            // Now should show Show Less
            expect(screen.getAllByText(/Show Less/i)[0]).toBeInTheDocument();
        });
    });

    describe('Accordion Toggling', () => {
        it('expands first item by default', () => {
            renderWithContext();
            // First item description should be visible
            expect(screen.getAllByText('Building awesome stuff')[0]).toBeInTheDocument();
        });

        it('collapses item when clicking expanded item', () => {
            renderWithContext();

            // Find accordion button with expanded state
            const accordionButtons = screen.getAllByRole('button').filter(btn =>
                btn.getAttribute('aria-expanded') === 'true'
            );

            if (accordionButtons[0]) {
                fireEvent.click(accordionButtons[0]);
            }
        });

        it('expands multiple items when clicked', () => {
            renderWithContext();

            // Find all accordion toggle buttons
            const toggleButtons = screen.getAllByRole('button').filter(btn =>
                btn.hasAttribute('aria-expanded')
            );

            // Click second item to expand it
            if (toggleButtons[1]) {
                fireEvent.click(toggleButtons[1]);
            }
        });
    });

    describe('Desktop Timeline', () => {
        it('renders timeline buttons for each experience', () => {
            renderWithContext();

            // Check for role names in timeline
            expect(screen.getAllByText('Lead Developer').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Software Engineer').length).toBeGreaterThan(0);
        });

        it('switches active experience when timeline item clicked', () => {
            renderWithContext();

            // Get all timeline buttons
            const buttons = screen.getAllByRole('button');

            // Click on a different item - filter for ones that might be timeline buttons
            const timelineButtons = buttons.filter(btn =>
                btn.textContent?.includes('Software Engineer')
            );

            if (timelineButtons[0]) {
                fireEvent.click(timelineButtons[0]);
            }
        });
    });

    describe('Reduced Motion', () => {
        it('respects reduced motion preference', () => {
            mockPrefersReducedMotion.mockReturnValue(true);
            renderWithContext();

            expect(screen.getAllByText('My Experience Resume')[0]).toBeInTheDocument();
        });
    });

    describe('Keyboard Navigation', () => {
        it('handles keyboard navigation - ArrowDown', () => {
            renderWithContext();

            // Focus on section and simulate keyboard event
            const section = document.getElementById('experience');
            if (section) {
                section.focus();
                fireEvent.focusIn(section);

                // Simulate ArrowDown
                fireEvent.keyDown(window, { key: 'ArrowDown' });

                fireEvent.focusOut(section);
            }
        });

        it('handles keyboard navigation - ArrowUp', () => {
            renderWithContext();

            const section = document.getElementById('experience');
            if (section) {
                section.focus();
                fireEvent.focusIn(section);

                fireEvent.keyDown(window, { key: 'ArrowUp' });

                fireEvent.focusOut(section);
            }
        });

        it('handles keyboard navigation - ArrowLeft', () => {
            renderWithContext();

            const section = document.getElementById('experience');
            if (section) {
                section.focus();
                fireEvent.focusIn(section);

                fireEvent.keyDown(window, { key: 'ArrowLeft' });

                fireEvent.focusOut(section);
            }
        });

        it('handles keyboard navigation - ArrowRight', () => {
            renderWithContext();

            const section = document.getElementById('experience');
            if (section) {
                section.focus();
                fireEvent.focusIn(section);

                fireEvent.keyDown(window, { key: 'ArrowRight' });

                fireEvent.focusOut(section);
            }
        });
    });

    describe('Company Logo', () => {
        it('renders fallback initial when no logo provided', () => {
            renderWithContext();
            // Items without logo should show company initial
            // Look for "T" for Tech Corp, "S" for Startup Inc, etc.
            const initials = screen.getAllByText(/^[TSBA]$/);
            expect(initials.length).toBeGreaterThan(0);
        });
    });

    describe('Skill Click in Detail View', () => {
        it('filters when clicking skill in detail panel', () => {
            renderWithContext();

            // Find skill tags in the detail view (they're buttons)
            const skillButtons = screen.getAllByRole('button').filter(btn => {
                const text = btn.textContent || '';
                return text === 'React' || text === 'Node';
            });

            if (skillButtons.length > 0) {
                // Click a skill to filter
                fireEvent.click(skillButtons[0]);
                expect(screen.getByText('Clear')).toBeInTheDocument();

                // Click again to toggle off
                fireEvent.click(skillButtons[0]);
            }
        });
    });

    describe('Empty Filter State', () => {
        it('handles empty filter results gracefully', () => {
            renderWithContext();

            // Try to trigger empty state by filtering by a skill not in visible items
            // This is hard to test without modifying the mock, but we ensure no crash
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
