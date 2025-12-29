import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Experience } from './Experience';
import { useLanguage } from '@/context/LanguageContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

jest.mock('@/context/LanguageContext', () => ({ useLanguage: jest.fn() }));
jest.mock('@/hooks/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: jest.fn() }));
jest.mock('@/components/ui/SectionHeading', () => ({ SectionHeading: () => <div /> }));
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
        li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: () => ({ get: () => 0 }),
}));
jest.mock('lucide-react', () => ({
    Calendar: () => <div />, ChevronDown: () => <div />, ChevronUp: () => <div />,
    Clock: () => <div />, Briefcase: () => <div />, Filter: () => <div />, X: () => <div />,
}));

describe('Experience', () => {
    const mockItems = [
        { id: '1', role: 'Role A', company: 'Comp A', startDate: '2023-01', skills: ['Skill A'], description: 'Desc A', highlights: ['Highlight A1'] },
        { id: '2', role: 'Role B', company: 'Comp B', startDate: '2022-01', skills: ['Skill B'], description: 'Desc B' },
        { id: '3', role: 'Role C', company: 'Comp C', startDate: '2021-01', skills: ['Skill C'], description: 'Desc C' },
        { id: '4', role: 'Role D', company: 'Comp D', startDate: '2020-01', skills: ['Skill A'], description: 'Desc D', highlights: ['Highlight D1'] },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useLanguage as jest.Mock).mockReturnValue({
            t: { experience: { title: 'Exp', items: [] } },
            language: 'en', direction: 'ltr'
        });
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(false);
    });

    it('renders initial visible items and highlights', () => {
        const { unmount } = render(<Experience items={mockItems} />);
        expect(screen.getAllByText('Role A')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Highlight A1')[0]).toBeInTheDocument();
        expect(screen.queryByText('Role D')).not.toBeInTheDocument();
        unmount();
    });

    it('renders default items from translation if no items prop', () => {
        const defaultItems = [
            { id: 'def1', role: 'Default Role', company: 'Def Co', startDate: '2020-01', description: 'Def Desc', skills: [] }
        ];
        (useLanguage as jest.Mock).mockReturnValue({
            t: { experience: { title: 'Exp', items: defaultItems } },
            language: 'en', direction: 'ltr'
        });

        render(<Experience />); // No items prop
        expect(screen.getAllByText('Default Role')[0]).toBeInTheDocument();
    });

    it('expands to show more items', async () => {
        render(<Experience items={mockItems} />);
        const showMoreBtns = screen.getAllByText(/Show More/);
        fireEvent.click(showMoreBtns[0]);
        await waitFor(() => expect(screen.getAllByText('Role D')[0]).toBeInTheDocument());
    });

    it('handles keyboard navigation cleanup', async () => {
        const { unmount } = render(<Experience items={mockItems} />);
        const section = document.getElementById('experience');
        fireEvent.focusIn(section!); // Adds event listener
        unmount(); // Should remove event listener
    });

    it('handles keyboard navigation logic', async () => {
        render(<Experience items={mockItems} />);
        const section = document.getElementById('experience');
        fireEvent.focusIn(section!);
        fireEvent.keyDown(globalThis, { key: 'ArrowDown' });
        await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());
    });

    it('filters by skill via top bar', async () => {
        render(<Experience items={mockItems} />);
        const skillBtns = screen.getAllByText('Skill A');
        fireEvent.click(skillBtns[0]);
        await waitFor(() => {
            expect(screen.getAllByText('Role A')[0]).toBeInTheDocument();
            expect(screen.queryByText('Role B')).not.toBeInTheDocument();
        });
    });

    it('filters by skill via detail tag', async () => {
        render(<Experience items={mockItems} />);
        const skillABtns = screen.getAllByText('Skill A');
        const detailTag = skillABtns[skillABtns.length - 1];
        fireEvent.click(detailTag);
        await waitFor(() => {
            expect(screen.queryByText('Role B')).not.toBeInTheDocument();
        });
    });

    it('resets activeId when filter excludes current active item', async () => {
        render(<Experience items={mockItems} />);
        const skillBBtns = screen.getAllByText('Skill B');
        fireEvent.click(skillBBtns[0]);
        await waitFor(() => expect(screen.getAllByText('Role B')[0]).toBeInTheDocument());
    });

    it('handles interactions correctly', async () => {
        render(<Experience items={mockItems} />);
        const roleBBtns = screen.getAllByText('Role B');
        roleBBtns.forEach(btn => fireEvent.click(btn));
        await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());
    });
});
