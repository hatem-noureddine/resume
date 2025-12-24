import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card';

describe('Card Components', () => {
    describe('Card', () => {
        it('renders children', () => {
            render(<Card>Card Content</Card>);
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(<Card className="custom-class">Content</Card>);
            expect(container.firstChild).toHaveClass('custom-class');
        });

        it('forwards ref', () => {
            const ref = { current: null } as React.RefObject<HTMLDivElement>;
            render(<Card ref={ref}>Content</Card>);
            expect(ref.current).toBeInstanceOf(HTMLElement);
        });
    });

    describe('CardHeader', () => {
        it('renders children', () => {
            render(<CardHeader>Header Content</CardHeader>);
            expect(screen.getByText('Header Content')).toBeInTheDocument();
        });

        it('applies flex layout', () => {
            const { container } = render(<CardHeader>Header</CardHeader>);
            expect(container.firstChild).toHaveClass('flex');
        });
    });

    describe('CardTitle', () => {
        it('renders as h3', () => {
            render(<CardTitle>Title</CardTitle>);
            expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
        });

        it('renders children', () => {
            render(<CardTitle>Card Title</CardTitle>);
            expect(screen.getByText('Card Title')).toBeInTheDocument();
        });
    });

    describe('CardDescription', () => {
        it('renders as paragraph', () => {
            render(<CardDescription>Description text</CardDescription>);
            expect(screen.getByText('Description text')).toBeInTheDocument();
        });

        it('has muted styling', () => {
            const { container } = render(<CardDescription>Desc</CardDescription>);
            expect(container.firstChild).toHaveClass('text-muted-foreground');
        });
    });

    describe('CardContent', () => {
        it('renders children', () => {
            render(<CardContent>Main Content</CardContent>);
            expect(screen.getByText('Main Content')).toBeInTheDocument();
        });

        it('has padding', () => {
            const { container } = render(<CardContent>Content</CardContent>);
            expect(container.firstChild).toHaveClass('p-6');
        });
    });

    describe('CardFooter', () => {
        it('renders children', () => {
            render(<CardFooter>Footer Content</CardFooter>);
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });

        it('applies flex layout', () => {
            const { container } = render(<CardFooter>Footer</CardFooter>);
            expect(container.firstChild).toHaveClass('flex');
        });
    });

    describe('Full Card Composition', () => {
        it('renders a complete card with all parts', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Test Title</CardTitle>
                        <CardDescription>Test Description</CardDescription>
                    </CardHeader>
                    <CardContent>Main content here</CardContent>
                    <CardFooter>Footer here</CardFooter>
                </Card>
            );

            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
            expect(screen.getByText('Main content here')).toBeInTheDocument();
            expect(screen.getByText('Footer here')).toBeInTheDocument();
        });
    });
});
