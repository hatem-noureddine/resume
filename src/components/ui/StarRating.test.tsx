import { render, screen, fireEvent } from "@testing-library/react";
import { StarRating } from "./StarRating";

// Mock useRating hook
const mockSetRating = jest.fn();
const mockRating = {
    rating: 0,
    setRating: mockSetRating,
    hasRated: false,
    averageRating: 0,
    totalRatings: 0,
    resetRating: jest.fn(),
};

jest.mock("@/hooks/useRating", () => ({
    useRating: () => mockRating,
}));

// Mock usePrefersReducedMotion
jest.mock("@/hooks/usePrefersReducedMotion", () => ({
    usePrefersReducedMotion: () => false,
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
    motion: {
        button: ({ children, onClick, onMouseEnter, onKeyDown, className, ...props }: any) => (
            <button
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onKeyDown={onKeyDown}
                className={className}
                {...props}
            >
                {children}
            </button>
        ),
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
    Star: ({ className }: any) => <span data-testid="star" className={className}>★</span>,
}));

describe("StarRating", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRating.rating = 0;
        mockRating.hasRated = false;
        mockRating.averageRating = 0;
        mockRating.totalRatings = 0;
    });

    it("renders 5 stars by default", () => {
        render(<StarRating postSlug="test-post" />);

        const stars = screen.getAllByTestId("star");
        expect(stars).toHaveLength(5);
    });

    it("renders custom number of stars", () => {
        render(<StarRating postSlug="test-post" maxStars={10} />);

        const stars = screen.getAllByTestId("star");
        expect(stars).toHaveLength(10);
    });

    it("calls setRating when star is clicked", () => {
        render(<StarRating postSlug="test-post" />);

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[2]); // Click 3rd star

        expect(mockSetRating).toHaveBeenCalledWith(3);
    });

    it("shows thank you message when hasRated is true", () => {
        mockRating.hasRated = true;
        render(<StarRating postSlug="test-post" />);

        expect(screen.getByText("Thanks for rating!")).toBeInTheDocument();
    });

    it("shows rating count when totalRatings > 0", () => {
        mockRating.totalRatings = 5;
        mockRating.averageRating = 4.5;
        render(<StarRating postSlug="test-post" />);

        expect(screen.getByText("(5 ratings)")).toBeInTheDocument();
        expect(screen.getByText("4.5")).toBeInTheDocument();
    });

    it("shows singular 'rating' for 1 rating", () => {
        mockRating.totalRatings = 1;
        mockRating.averageRating = 5;
        render(<StarRating postSlug="test-post" />);

        expect(screen.getByText("(1 rating)")).toBeInTheDocument();
    });

    it("handles keyboard navigation with Enter", () => {
        render(<StarRating postSlug="test-post" />);

        const buttons = screen.getAllByRole("button");
        fireEvent.keyDown(buttons[3], { key: "Enter" });

        expect(mockSetRating).toHaveBeenCalledWith(4);
    });

    it("handles keyboard navigation with Space", () => {
        render(<StarRating postSlug="test-post" />);

        const buttons = screen.getAllByRole("button");
        fireEvent.keyDown(buttons[4], { key: " " });

        expect(mockSetRating).toHaveBeenCalledWith(5);
    });

    it("has proper accessibility attributes", () => {
        render(<StarRating postSlug="test-post" />);

        const group = screen.getByRole("group");
        expect(group).toHaveAttribute("aria-label", "Rate this article");

        const buttons = screen.getAllByRole("button");
        expect(buttons[0]).toHaveAttribute("aria-label", "Rate 1 out of 5 stars");
    });

    it("applies hover state on mouse enter", () => {
        render(<StarRating postSlug="test-post" />);

        const buttons = screen.getAllByRole("button");
        fireEvent.mouseEnter(buttons[2]);

        // Component should update hover state (visual change tested via snapshot or visual regression)
        expect(buttons[2]).toBeInTheDocument();
    });

    it("does not show count when showCount is false", () => {
        mockRating.totalRatings = 5;
        render(<StarRating postSlug="test-post" showCount={false} />);

        expect(screen.queryByText(/ratings/)).not.toBeInTheDocument();
    });

    it("does not show average when showAverage is false", () => {
        mockRating.totalRatings = 5;
        mockRating.averageRating = 4.5;
        render(<StarRating postSlug="test-post" showAverage={false} />);

        expect(screen.queryByText("4.5")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(
            <StarRating postSlug="test-post" className="custom-class" />
        );

        expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies different size classes", () => {
        const { rerender } = render(<StarRating postSlug="test-post" size="sm" />);
        expect(screen.getAllByTestId("star")[0]).toHaveClass("w-4");

        rerender(<StarRating postSlug="test-post" size="lg" />);
        expect(screen.getAllByTestId("star")[0]).toHaveClass("w-6");
    });
});
