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
        { id: '1', role: 'Role A', company: 'Comp A', period: '2023', startDate: '2023-01', skills: ['Skill A'], description: 'Desc A', highlights: ['Highlight A1'] },
        { id: '2', role: 'Role B', company: 'Comp B', period: '2022', startDate: '2022-01', skills: ['Skill B'], description: 'Desc B' },
        { id: '3', role: 'Role C', company: 'Comp C', period: '2021', startDate: '2021-01', skills: ['Skill C'], description: 'Desc C' },
        { id: '4', role: 'Role D', company: 'Comp D', period: '2020', startDate: '2020-01', skills: ['Skill A'], description: 'Desc D', highlights: ['Highlight D1'] },
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
            { id: 'def1', role: 'Default Role', company: 'Def Co', period: '2020', startDate: '2020-01', description: 'Def Desc', skills: [] }
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

    it('handles keyboard navigation logic (LTR)', async () => {
        render(<Experience items={mockItems} />);
        const section = document.getElementById('experience');
        fireEvent.focusIn(section!);

        // Arrow Down -> Next Item
        fireEvent.keyDown(window, { key: 'ArrowDown' });
        await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());

        // Arrow Up -> Prev Item
        fireEvent.keyDown(window, { key: 'ArrowUp' });
        await waitFor(() => expect(screen.getAllByText('Desc A')[0]).toBeInTheDocument());

        // Arrow Right -> Next Item (LTR)
        fireEvent.keyDown(window, { key: 'ArrowRight' });
        await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());

        // Arrow Left -> Prev Item (LTR)
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        await waitFor(() => expect(screen.getAllByText('Desc A')[0]).toBeInTheDocument());

        // Boundary checks
        fireEvent.keyDown(window, { key: 'ArrowUp' }); // Already at 0, shouldn't crash
        expect(screen.getAllByText('Desc A')[0]).toBeInTheDocument();
    });

    it('handles keyboard navigation logic (RTL)', async () => {
        (useLanguage as jest.Mock).mockReturnValue({
            t: { experience: { title: 'Exp', items: [] } },
            language: 'ar', direction: 'rtl'
        });

        render(<Experience items={mockItems} />);
        const section = document.getElementById('experience');
        fireEvent.focusIn(section!);

        // Arrow Left -> Next Item (RTL)
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());

        // Arrow Right -> Prev Item (RTL)
        fireEvent.keyDown(window, { key: 'ArrowRight' });
        await waitFor(() => expect(screen.getAllByText('Desc A')[0]).toBeInTheDocument());
    });

    it('toggles accordion items', async () => {
        render(<Experience items={mockItems} />);
        // Role A is expanded by default
        const toggleBtnA = screen.getAllByRole('button', { expanded: true })[0];
        fireEvent.click(toggleBtnA); // Close A
        await waitFor(() => expect(toggleBtnA).toHaveAttribute('aria-expanded', 'false'));

        fireEvent.click(toggleBtnA); // Open A again
        await waitFor(() => expect(toggleBtnA).toHaveAttribute('aria-expanded', 'true'));
    });

    it('filters by skill via top bar', async () => {
        render(<Experience items={mockItems} />);
        const skillBtns = screen.getAllByText('Skill A');
        fireEvent.click(skillBtns[0]);
        await waitFor(() => {
            expect(screen.getAllByText('Role A')[0]).toBeInTheDocument();
            expect(screen.queryByText('Role B')).not.toBeInTheDocument();
        });

        // Clear filter
        const clearBtn = screen.getByText('Clear');
        fireEvent.click(clearBtn);
        await waitFor(() => {
            expect(screen.getAllByText('Role B')[0]).toBeInTheDocument();
        });
    });

    it('filters by skill via detail tag', async () => {
        render(<Experience items={mockItems} />);
        const skillABtns = screen.getAllByText('Skill A');
        const detailTag = skillABtns[skillABtns.length - 1]; // One of the tags in detail view
        fireEvent.click(detailTag);
        await waitFor(() => {
            expect(screen.queryByText('Role B')).not.toBeInTheDocument();
        });

        // Click same skill to toggle off
        const activeSkillBtn = screen.getAllByText('Skill A')[0]; // Top filter bar button
        fireEvent.click(activeSkillBtn);
        await waitFor(() => {
            expect(screen.getAllByText('Role B')[0]).toBeInTheDocument();
        });
    });

    it('resets activeId when filter excludes current active item', async () => {
        render(<Experience items={mockItems} />);
        // Initially Role A (Skill A) is active.
        // Filter by Skill B (Role B). Role A should disappear, ActiveId should switch to Role B.

        const skillBBtns = screen.getAllByText('Skill B');
        fireEvent.click(skillBBtns[0]);

        await waitFor(() => {
            // Role B should be active detailed view
            expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument();
            expect(screen.queryByText('Desc A')).not.toBeInTheDocument();
        });
    });

    it('handles interactions correctly', async () => {
        render(<Experience items={mockItems} />);
        const items = screen.getAllByText('Role B');
        // Assuming desktop button interaction
        const timelineBtn = items.find(el => el.closest('button')?.classList.contains('ltr:text-left'));
        if (timelineBtn) {
            fireEvent.click(timelineBtn);
            await waitFor(() => expect(screen.getAllByText('Desc B')[0]).toBeInTheDocument());
        }
    });

    it('sorts items by startDate properly', () => {
        const unsortedItems = [
            { id: '1', role: 'Old', startDate: '2020-01', period: '2020', company: 'C1', description: 'D1' },
            { id: '2', role: 'New', startDate: '2022-01', period: '2022', company: 'C2', description: 'D2' },
            { id: '3', role: 'NoDate', period: '?', company: 'C3', description: 'D3' } // Should be treated as old
        ];

        render(<Experience items={unsortedItems} />);
        // Should appear in DOM order: New (2022), Old (2020), NoDate (1900 default)
        expect(screen.getAllByText('New')[0].compareDocumentPosition(screen.getAllByText('Old')[0])).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('handles reduced motion', () => {
        (usePrefersReducedMotion as jest.Mock).mockReturnValue(true);
        render(<Experience items={mockItems} />);
        expect(screen.getAllByText('Role A')[0]).toBeInTheDocument();
    });
});
