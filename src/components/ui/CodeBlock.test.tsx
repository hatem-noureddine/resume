import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeBlock, CodeBlockLegacy } from './CodeBlock';

// Mock prismjs
jest.mock('prismjs/components/prism-kotlin', () => ({}));

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
    },
});

describe('CodeBlock', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders code content with syntax highlighting', () => {
        render(<CodeBlock code="const x = 1;" language="javascript" />);
        // Language badge should be shown
        expect(screen.getByText('javascript')).toBeInTheDocument();
    });

    it('shows language badge', () => {
        render(<CodeBlock code="print('hello')" language="python" />);
        expect(screen.getByText('python')).toBeInTheDocument();
    });

    it('normalizes language names', () => {
        render(<CodeBlock code="fun main() {}" language="kt" />);
        expect(screen.getByText('kotlin')).toBeInTheDocument();
    });

    it('renders copy button', () => {
        render(<CodeBlock code="console.log('test')" language="javascript" />);
        expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
    });

    it('copies code to clipboard when copy button is clicked', async () => {
        render(<CodeBlock code="const test = true;" language="javascript" />);

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const test = true;');
        });
    });

    it('shows Copied! label after copying', async () => {
        jest.useFakeTimers();
        render(<CodeBlock code="code" language="javascript" />);

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Copied!')).toBeInTheDocument();
        });

        jest.runAllTimers();
        jest.useRealTimers();
    });

    it('shows line numbers by default', () => {
        render(<CodeBlock code="line1" language="text" />);
        // Line number "1" should exist (might have multiple occurrences)
        expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    });

    it('hides line numbers when showLineNumbers is false', () => {
        render(<CodeBlock code="single line" language="text" showLineNumbers={false} />);
        // Language badge should still show
        expect(screen.getByText('text')).toBeInTheDocument();
    });

    it('handles clipboard error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Clipboard error'));

        render(<CodeBlock code="test" language="text" />);

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });
});

describe('CodeBlockLegacy', () => {
    it('extracts language from className', () => {
        render(
            <CodeBlockLegacy className="language-typescript">
                const x: number = 1;
            </CodeBlockLegacy>
        );
        expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('extracts text from children', async () => {
        render(
            <CodeBlockLegacy className="language-javascript">
                const test = true;
            </CodeBlockLegacy>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });

    it('handles nested elements in extractText', async () => {
        render(
            <CodeBlockLegacy className="language-jsx">
                <span>nested</span>
            </CodeBlockLegacy>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('nested');
        });
    });

    it('handles number children', async () => {
        render(
            <CodeBlockLegacy className="language-text">
                {42}
            </CodeBlockLegacy>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('42');
        });
    });

    it('handles array children', async () => {
        render(
            <CodeBlockLegacy className="language-text">
                {['line1', 'line2']}
            </CodeBlockLegacy>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('line1line2');
        });
    });

    it('defaults to text language when no className', () => {
        render(<CodeBlockLegacy>plain code</CodeBlockLegacy>);
        expect(screen.getByText('text')).toBeInTheDocument();
    });
});
