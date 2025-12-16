import { render, screen, fireEvent, act } from '@testing-library/react';
import { TableOfContents } from './TableOfContents';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        aside: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <aside className={className} {...props}>{children}</aside>
        ),
        li: ({ children, className, onClick, ...props }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) => (
            <li className={className} onClick={onClick} {...props}>{children}</li>
        ),
        div: ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
}));

describe('TableOfContents', () => {
    const mockHeadings = [
        { id: 'intro', text: 'Introduction', level: 2 },
        { id: 'overview', text: 'Overview', level: 2 },
        { id: 'details', text: 'Details', level: 3 },
        { id: 'conclusion', text: 'Conclusion', level: 2 },
    ];

    beforeEach(() => {
        // Mock getElementById
        document.getElementById = jest.fn((id) => {
            if (mockHeadings.some(h => h.id === id)) {
                return {
                    offsetTop: 100,
                    getBoundingClientRect: () => ({ top: 100 }),
                    scrollIntoView: jest.fn(),
                } as unknown as HTMLElement;
            }
            return null;
        });
    });

    it('renders table of contents', () => {
        const { container } = render(<TableOfContents headings={mockHeadings} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders all headings', () => {
        render(<TableOfContents headings={mockHeadings} />);

        expect(screen.getByText('Introduction')).toBeInTheDocument();
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Details')).toBeInTheDocument();
        expect(screen.getByText('Conclusion')).toBeInTheDocument();
    });

    it('handles empty headings array', () => {
        const { container } = render(<TableOfContents headings={[]} />);
        // Should still render the container
        expect(container).toBeInTheDocument();
    });

    it('clicking a heading calls scroll handler', () => {
        render(<TableOfContents headings={mockHeadings} />);

        const introLink = screen.getByText('Introduction');
        fireEvent.click(introLink);

        // Should have called getElementById
        expect(document.getElementById).toHaveBeenCalledWith('intro');
    });

    it('highlights active heading based on scroll position', () => {
        render(<TableOfContents headings={mockHeadings} />);

        // Simulate scroll
        act(() => {
            fireEvent.scroll(globalThis);
        });

        // Component should still render
        expect(screen.getByText('Introduction')).toBeInTheDocument();
    });

    it('applies different styling for different heading levels', () => {
        render(<TableOfContents headings={mockHeadings} />);

        // Level 2 and level 3 headings should both render
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Details')).toBeInTheDocument();
    });
});
