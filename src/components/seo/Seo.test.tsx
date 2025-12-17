import React from 'react';
import { render, screen } from '@testing-library/react';

import { JsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

describe('SEO Components', () => {


    describe('JsonLd', () => {
        it('renders valid JSON-LD', () => {
            const data = { '@context': 'https://schema.org', '@type': 'Person', name: 'Test' };
            const { container } = render(<JsonLd data={data} />);
            const script = container.querySelector('script[type="application/ld+json"]');
            expect(script).toBeInTheDocument();
            expect(script?.innerHTML).toContain('"name":"Test"');
        });
    });

    describe('BreadcrumbJsonLd', () => {
        it('renders breadcrumb schema', () => {
            const items = [{ name: 'Home', item: '/' }, { name: 'Blog', item: '/blog' }];
            const { container } = render(<BreadcrumbJsonLd items={items} />);
            const script = container.querySelector('script[type="application/ld+json"]');
            expect(script).toBeInTheDocument();
            expect(script?.innerHTML).toContain('BreadcrumbList');
        });
    });
});
