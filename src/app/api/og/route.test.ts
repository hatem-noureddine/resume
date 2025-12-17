/**
 * @jest-environment node
 */
import { GET } from './route';
import { NextRequest } from 'next/server';

describe('OG Image API', () => {
    const createRequest = (params: Record<string, string> = {}) => {
        const url = new URL('http://localhost:3000/api/og');
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        return new NextRequest(url);
    };

    it('returns an ImageResponse', async () => {
        const req = createRequest();
        const response = await GET(req);

        expect(response).toBeDefined();
        expect(response.headers.get('content-type')).toBe('image/png');
    });

    it('handles custom title', async () => {
        const req = createRequest({ title: 'My Custom Title' });
        const response = await GET(req);

        expect(response.status).toBe(200);
    });

    it('handles custom subtitle', async () => {
        const req = createRequest({
            title: 'Title',
            subtitle: 'My Subtitle'
        });
        const response = await GET(req);

        expect(response.status).toBe(200);
    });

    it('handles category badge', async () => {
        const req = createRequest({
            title: 'Title',
            category: 'Technology'
        });
        const response = await GET(req);

        expect(response.status).toBe(200);
    });

    it('handles all parameters', async () => {
        const req = createRequest({
            title: 'Full Title',
            subtitle: 'Full Subtitle',
            category: 'Blog'
        });
        const response = await GET(req);

        expect(response.status).toBe(200);
    });

    it('handles empty parameters with defaults', async () => {
        const req = createRequest({});
        const response = await GET(req);

        expect(response.status).toBe(200);
        // Should use default title "Hatem Noureddine"
    });

    it('adjusts font size for long titles', async () => {
        const req = createRequest({
            title: 'This is a very long title that should trigger smaller font size for better readability'
        });
        const response = await GET(req);

        expect(response.status).toBe(200);
    });
});
