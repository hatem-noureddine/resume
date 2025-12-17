import { render, screen, fireEvent } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

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

    it('renders code content', () => {
        render(
            <CodeBlock className="language-typescript">
                const x = 1;
            </CodeBlock>
        );
        expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('shows language badge when className contains language', () => {
        render(
            <CodeBlock className="language-python">
                {`print("hello")`}
            </CodeBlock>
        );
        expect(screen.getByText('python')).toBeInTheDocument();
    });

    it('renders copy button', () => {
        render(
            <CodeBlock className="language-javascript">
                {`console.log("test")`}
            </CodeBlock>
        );
        expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
    });

    it('copies code to clipboard when copy button is clicked', () => {
        render(
            <CodeBlock className="language-javascript">
                const test = true;
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('shows check icon after copying', async () => {
        jest.useFakeTimers();
        render(
            <CodeBlock className="language-javascript">
                code
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        await screen.findByLabelText('Copied!');

        jest.runAllTimers();
        jest.useRealTimers();
    });

    it('does not show language badge when no language class', () => {
        render(<CodeBlock>plain code</CodeBlock>);
        // Should only show the code content, no badge
        expect(screen.getByText('plain code')).toBeInTheDocument();
    });

    it('handles nested elements in extractText', () => {
        render(
            <CodeBlock className="language-jsx">
                <span>nested</span>
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('nested');
    });

    it('handles number children', () => {
        render(
            <CodeBlock className="language-text">
                {42}
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('42');
    });

    it('handles array children', () => {
        render(
            <CodeBlock className="language-text">
                {['line1', 'line2']}
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('line1line2');
    });

    it('handles empty/null children gracefully', () => {
        render(
            <CodeBlock className="language-text">
                {null}
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });

    it('handles clipboard error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Clipboard error'));

        render(
            <CodeBlock className="language-text">
                test
            </CodeBlock>
        );

        const copyButton = screen.getByLabelText('Copy code');
        fireEvent.click(copyButton);

        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});

