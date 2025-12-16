import { render, screen, fireEvent } from '@testing-library/react';
import GlobalError from './global-error';

describe('Global Error Page', () => {
    const mockError = new Error('Global test error');
    const mockReset = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        // Mock window.location
        delete (window as { location?: Location }).location;
        window.location = { href: '' } as Location;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders error message', () => {
        render(<GlobalError error={mockError} reset={mockReset} />);
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('renders error description', () => {
        render(<GlobalError error={mockError} reset={mockReset} />);
        expect(screen.getByText('We apologize for the inconvenience. An unexpected error occurred.')).toBeInTheDocument();
    });

    it('displays error.message in a code block', () => {
        render(<GlobalError error={mockError} reset={mockReset} />);
        expect(screen.getByText('Global test error')).toBeInTheDocument();
    });

    it('calls reset when Try again is clicked', () => {
        render(<GlobalError error={mockError} reset={mockReset} />);

        fireEvent.click(screen.getByText('Try again'));

        expect(mockReset).toHaveBeenCalled();
    });

    it('navigates home when Go Home is clicked', () => {
        render(<GlobalError error={mockError} reset={mockReset} />);

        fireEvent.click(screen.getByText('Go Home'));

        expect(window.location.href).toBe('/');
    });

    it('displays "Unknown error" when error.message is empty', () => {
        const emptyError = new Error('');
        render(<GlobalError error={emptyError} reset={mockReset} />);
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });

    it('logs error to console on mount', () => {
        const consoleSpy = jest.spyOn(console, 'error');
        render(<GlobalError error={mockError} reset={mockReset} />);

        expect(consoleSpy).toHaveBeenCalledWith(mockError);
    });
});
