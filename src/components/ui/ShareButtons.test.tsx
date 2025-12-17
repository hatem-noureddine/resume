import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButtons } from './ShareButtons';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
    },
});

describe('ShareButtons', () => {
    const defaultProps = {
        url: 'https://example.com/blog/test-post',
        title: 'Test Post Title',
        description: 'Test description',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders share buttons', () => {
        render(<ShareButtons {...defaultProps} />);

        expect(screen.getByText('Share:')).toBeInTheDocument();
        expect(screen.getByLabelText('Share on X')).toBeInTheDocument();
        expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
        expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
        expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
    });

    it('has correct share links', () => {
        render(<ShareButtons {...defaultProps} />);

        const xLink = screen.getByLabelText('Share on X');
        const linkedinLink = screen.getByLabelText('Share on LinkedIn');
        const facebookLink = screen.getByLabelText('Share on Facebook');

        expect(xLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
        expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
        expect(facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));
    });

    it('copies link to clipboard when copy button is clicked', async () => {
        render(<ShareButtons {...defaultProps} />);

        const copyButton = screen.getByLabelText('Copy link');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.url);
    });

    it('shows check icon after copying', async () => {
        jest.useFakeTimers();
        render(<ShareButtons {...defaultProps} />);

        const copyButton = screen.getByLabelText('Copy link');
        fireEvent.click(copyButton);

        // Wait for state update
        await screen.findByLabelText('Link copied!');

        jest.runAllTimers();
        jest.useRealTimers();
    });

    it('applies custom className', () => {
        const { container } = render(<ShareButtons {...defaultProps} className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
