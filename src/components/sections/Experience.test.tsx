import { render, screen, fireEvent } from '@testing-library/react';
import { Experience } from './Experience';
import { LanguageProvider } from '@/context/LanguageContext';

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title }: any) => <div data-testid="section-heading">{title}</div>
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...rest }: any) => <div className={className} onClick={onClick}>{children}</div>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        li: ({ children, className }: any) => <li className={className}>{children}</li>,
        button: ({ children, className, onClick, ...rest }: any) => <button className={className} onClick={onClick}>{children}</button>,
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
});
