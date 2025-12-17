import { render, screen } from '@testing-library/react';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from './PageTransition';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: () => '/test',
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('PageTransition Components', () => {
    describe('PageTransition', () => {
        it('renders children', () => {
            render(
                <PageTransition>
                    <div>Page Content</div>
                </PageTransition>
            );
            expect(screen.getByText('Page Content')).toBeInTheDocument();
        });

        it('accepts fade mode', () => {
            render(
                <PageTransition mode="fade">
                    <div>Content</div>
                </PageTransition>
            );
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('accepts slide mode', () => {
            render(
                <PageTransition mode="slide">
                    <div>Content</div>
                </PageTransition>
            );
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('accepts scale mode', () => {
            render(
                <PageTransition mode="scale">
                    <div>Content</div>
                </PageTransition>
            );
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('accepts slideUp mode', () => {
            render(
                <PageTransition mode="slideUp">
                    <div>Content</div>
                </PageTransition>
            );
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });

    describe('FadeIn', () => {
        it('renders children', () => {
            render(<FadeIn>Fade Content</FadeIn>);
            expect(screen.getByText('Fade Content')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(<FadeIn className="custom">Content</FadeIn>);
            expect(container.firstChild).toHaveClass('custom');
        });

        it('accepts delay prop', () => {
            render(<FadeIn delay={0.5}>Content</FadeIn>);
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('accepts duration prop', () => {
            render(<FadeIn duration={0.5}>Content</FadeIn>);
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });

    describe('StaggerContainer', () => {
        it('renders children', () => {
            render(
                <StaggerContainer>
                    <div>Child 1</div>
                    <div>Child 2</div>
                </StaggerContainer>
            );
            expect(screen.getByText('Child 1')).toBeInTheDocument();
            expect(screen.getByText('Child 2')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <StaggerContainer className="custom">
                    <div>Child</div>
                </StaggerContainer>
            );
            expect(container.firstChild).toHaveClass('custom');
        });

        it('accepts staggerDelay prop', () => {
            render(
                <StaggerContainer staggerDelay={0.2}>
                    <div>Child</div>
                </StaggerContainer>
            );
            expect(screen.getByText('Child')).toBeInTheDocument();
        });
    });

    describe('StaggerItem', () => {
        it('renders children', () => {
            render(<StaggerItem>Item Content</StaggerItem>);
            expect(screen.getByText('Item Content')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(<StaggerItem className="custom">Content</StaggerItem>);
            expect(container.firstChild).toHaveClass('custom');
        });
    });
});
