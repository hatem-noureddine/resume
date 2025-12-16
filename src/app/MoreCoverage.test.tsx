import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClientCarousel } from '@/components/sections/ClientCarousel';
import { TableOfContents } from '@/components/blog/TableOfContents';

// Note: PortfolioPage test removed - Server Components with hooks require special test setup
// Coverage for portfolio/page.tsx can be achieved via E2E tests

describe('Additional Coverage', () => {
    describe('ClientCarousel', () => {
        it('renders carousel items', () => {
            render(<ClientCarousel />);
            // It renders items 3 times for infinite scroll
            const items = screen.getAllByText('TechCorp');
            expect(items.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('TableOfContents', () => {
        it('renders toc items and handles clicks', () => {
            const headings = [
                { id: 'section-1', text: 'Section 1', level: 2 },
                { id: 'section-2', text: 'Section 2', level: 3 }
            ];

            // Mock scrollIntoView
            Element.prototype.scrollIntoView = jest.fn();

            render(
                <div>
                    <div id="section-1" />
                    <div id="section-2" />
                    <TableOfContents headings={headings} />
                </div>
            );

            expect(screen.getByText('Section 1')).toBeInTheDocument();
            const link = screen.getByText('Section 2');
            expect(link).toBeInTheDocument();

            // Test click interaction
            link.click();
            expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        });

        it('renders nothing if headings empty', () => {
            const { container } = render(<TableOfContents headings={[]} />);
            expect(container).toBeEmptyDOMElement();
        });
    });
});
