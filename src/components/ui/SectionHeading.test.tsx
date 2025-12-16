import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        span: ({ children, className }: React.HTMLAttributes<HTMLSpanElement>) => (
            <span className={className}>{children}</span>
        ),
        h2: ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
            <h2 className={className}>{children}</h2>
        ),
    },
}));

describe('SectionHeading Component', () => {
    it('renders title and subtitle', () => {
        render(<SectionHeading title="Test Title" subtitle="Test Subtitle" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders h2 element for title', () => {
        render(<SectionHeading title="My Heading" subtitle="Sub" />);
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('My Heading');
    });

    it('applies center alignment by default', () => {
        const { container } = render(<SectionHeading title="Title" subtitle="Sub" />);
        expect(container.firstChild).toHaveClass('text-center');
    });

    it('applies left alignment when specified', () => {
        const { container } = render(<SectionHeading title="Title" subtitle="Sub" align="left" />);
        expect(container.firstChild).toHaveClass('text-left');
    });

    it('applies custom className', () => {
        const { container } = render(<SectionHeading title="Title" subtitle="Sub" className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders subtitle with uppercase styling', () => {
        render(<SectionHeading title="Title" subtitle="Subtitle" />);
        const subtitle = screen.getByText('Subtitle');
        expect(subtitle).toHaveClass('uppercase');
    });
});
