import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './error';

describe('Error Page', () => {
    const mockError = { message: 'Test error message', digest: 'test-digest' } as Error & { digest?: string };
    const mockReset = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders error message', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />);
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />);
        expect(screen.getByText('An unexpected error occurred in this section.')).toBeInTheDocument();
    });

    it('renders try again button', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />);
        expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('calls reset when try again is clicked', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />);

        fireEvent.click(screen.getByText('Try again'));

        expect(mockReset).toHaveBeenCalled();
    });

    it('logs error to console on mount', () => {
        const consoleSpy = jest.spyOn(console, 'error');
        render(<ErrorPage error={mockError} reset={mockReset} />);

        expect(consoleSpy).toHaveBeenCalledWith(mockError);
    });
});

