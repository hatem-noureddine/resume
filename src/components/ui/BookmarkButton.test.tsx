import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkButton } from './BookmarkButton';

// Mock useBookmarks
const mockToggleBookmark = jest.fn();
const mockIsBookmarked = jest.fn();

jest.mock('@/hooks/useBookmarks', () => ({
    useBookmarks: () => ({
        isBookmarked: mockIsBookmarked,
        toggleBookmark: mockToggleBookmark,
        mounted: true,
    }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <button {...props}>{children}</button>
        ),
        div: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('BookmarkButton', () => {
    const defaultProps = {
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test Description',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockIsBookmarked.mockReturnValue(false);
    });

    it('renders bookmark button', () => {
        render(<BookmarkButton {...defaultProps} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows correct aria-label when not bookmarked', () => {
        mockIsBookmarked.mockReturnValue(false);
        render(<BookmarkButton {...defaultProps} />);
        expect(screen.getByLabelText('Add to reading list')).toBeInTheDocument();
    });

    it('shows correct aria-label when bookmarked', () => {
        mockIsBookmarked.mockReturnValue(true);
        render(<BookmarkButton {...defaultProps} />);
        expect(screen.getByLabelText('Remove from reading list')).toBeInTheDocument();
    });

    it('calls toggleBookmark when clicked', () => {
        render(<BookmarkButton {...defaultProps} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockToggleBookmark).toHaveBeenCalledWith({
            slug: 'test-post',
            title: 'Test Post',
            description: 'Test Description',
        });
    });

    it('stops event propagation when clicked', () => {
        const parentClick = jest.fn();
        render(
            <div onClick={parentClick}>
                <BookmarkButton {...defaultProps} />
            </div>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(parentClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        render(<BookmarkButton {...defaultProps} className="custom-class" />);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
});
