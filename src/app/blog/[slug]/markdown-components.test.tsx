import { render, screen } from '@testing-library/react';
import { markdownComponents } from './markdown-components';

// Mock dependencies
jest.mock('@/components/ui/BlurImage', () => ({
    // eslint-disable-next-line @next/next/no-img-element
    BlurImage: (props: any) => <img {...props} alt={props.alt || ''} data-testid="blur-image" />
}));
jest.mock('@/components/ui/CodeBlock', () => ({
    CodeBlockLegacy: ({ children }: { children: React.ReactNode }) => <pre data-testid="code-block">{children}</pre>
}));

describe('Markdown Components', () => {
    it('renders img with BlurImage', () => {
        const Img = markdownComponents.img as React.FC<any>;
        render(<Img src="/test.jpg" alt="Test Image" />);
        const img = screen.getByTestId('blur-image');
        expect(img).toHaveAttribute('src', '/test.jpg');
        expect(img).toHaveAttribute('alt', 'Test Image');
    });

    it('renders img fallback without src/alt', () => {
        const Img = markdownComponents.img as React.FC<any>;
        render(<Img />);
        const img = screen.getByTestId('blur-image');
        expect(img).toBeInTheDocument();
    });

    it('renders blockquote', () => {
        const Blockquote = markdownComponents.blockquote as React.FC<any>;
        render(<Blockquote>Quote</Blockquote>);
        expect(screen.getByText('Quote').closest('blockquote')).toBeInTheDocument();
    });

    it('renders headers with complex nested children', () => {
        const H1 = markdownComponents.h1 as React.FC<any>;
        render(
            <H1>
                <span>Nested</span> <strong>Text</strong>
            </H1>
        );
        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1.id).toBe('nested-text');
    });

    it('handles arrays and nested objects in getTextFromNode', () => {
        const H1 = markdownComponents.h1 as React.FC<any>;
        render(
            <H1>
                {['Part 1', ' ', 'Part 2']}
            </H1>
        );
        expect(screen.getByRole('heading', { level: 1 }).id).toBe('part-1-part-2');

        render(
            <H1>
                <div>Outer <span>Inner</span></div>
            </H1>
        );
        expect(screen.getAllByRole('heading', { level: 1 })[1].id).toBe('outer-inner');
    });

    it('handles empty or non-string children gracefully in generateId', () => {
        const H1 = markdownComponents.h1 as React.FC<any>;
        const { container, rerender } = render(<H1>{null}</H1>);
        expect(container.querySelector('h1')?.id).toBe('');

        rerender(<H1>{123}</H1>);
        expect(container.querySelector('h1')?.id).toBe('123');
    });

    it('handles special characters and whitespace in generateId', () => {
        const H1 = markdownComponents.h1 as React.FC<any>;
        render(<H1>Hello @ World!!!  </H1>);
        expect(screen.getByRole('heading', { level: 1 }).id).toBe('hello-world');
    });

    it('renders link with target blank', () => {
        const Link = markdownComponents.a as React.FC<any>;
        render(<Link href="https://example.com">Link</Link>);
        const link = screen.getByText('Link');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders inline code', () => {
        const Code = markdownComponents.code as React.FC<any>;
        render(<Code>const x = 1;</Code>);
        expect(screen.getByText('const x = 1;').tagName).toBe('CODE');
        expect(screen.queryByTestId('code-block')).not.toBeInTheDocument();
    });

    it('renders code block', () => {
        const Code = markdownComponents.code as React.FC<any>;
        render(<Code className="language-js">console.log()</Code>);
        expect(screen.getByTestId('code-block')).toBeInTheDocument();
    });

    it('renders pre', () => {
        const Pre = markdownComponents.pre as React.FC<any>;
        render(<Pre>content</Pre>);
        expect(screen.getByText('content')).toBeInTheDocument();
    });
});
