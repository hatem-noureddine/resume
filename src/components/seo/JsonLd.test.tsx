import { render } from '@testing-library/react';
import { JsonLd, BreadcrumbJsonLd, ArticleJsonLd } from './JsonLd';

describe('JsonLd Components', () => {
    describe('JsonLd', () => {
        it('renders JSON-LD script with data', () => {
            const data = { '@type': 'Test', name: 'Test Name' };
            const { container } = render(<JsonLd data={data} />);
            const script = container.querySelector('script[type="application/ld+json"]');

            expect(script).toBeInTheDocument();
            expect(script?.textContent).toContain('Test Name');
        });
    });

    describe('BreadcrumbJsonLd', () => {
        it('renders breadcrumb structured data', () => {
            const items = [
                { name: 'Home', item: 'https://example.com' },
                { name: 'Blog', item: 'https://example.com/blog' },
                { name: 'Post', item: 'https://example.com/blog/post' },
            ];

            const { container } = render(<BreadcrumbJsonLd items={items} />);
            const script = container.querySelector('script[type="application/ld+json"]');

            expect(script).toBeInTheDocument();
            const data = JSON.parse(script?.textContent || '{}');

            expect(data['@type']).toBe('BreadcrumbList');
            expect(data.itemListElement).toHaveLength(3);
            expect(data.itemListElement[0].name).toBe('Home');
            expect(data.itemListElement[1].position).toBe(2);
        });
    });

    describe('ArticleJsonLd', () => {
        it('renders article structured data', () => {
            const { container } = render(
                <ArticleJsonLd
                    url="https://example.com/blog/test"
                    title="Test Article"
                    images={['https://example.com/image.jpg']}
                    datePublished="2024-01-01"
                    description="Test description"
                    authorName="Test Author"
                />
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            expect(script).toBeInTheDocument();

            const data = JSON.parse(script?.textContent || '{}');
            expect(data['@type']).toBe('BlogPosting');
            expect(data.headline).toBe('Test Article');
            expect(data.author.name).toBe('Test Author');
            expect(data.datePublished).toBe('2024-01-01');
        });

        it('uses datePublished as dateModified when not provided', () => {
            const { container } = render(
                <ArticleJsonLd
                    url="https://example.com/blog/test"
                    title="Test"
                    images={[]}
                    datePublished="2024-01-01"
                    description="Test"
                    authorName="Author"
                />
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const data = JSON.parse(script?.textContent || '{}');
            expect(data.dateModified).toBe('2024-01-01');
        });

        it('uses provided dateModified when available', () => {
            const { container } = render(
                <ArticleJsonLd
                    url="https://example.com/blog/test"
                    title="Test"
                    images={[]}
                    datePublished="2024-01-01"
                    dateModified="2024-02-01"
                    description="Test"
                    authorName="Author"
                />
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const data = JSON.parse(script?.textContent || '{}');
            expect(data.dateModified).toBe('2024-02-01');
        });
    });
});
