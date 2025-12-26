import {
    API_ENDPOINTS,
    ApiError,
    sendChatMessage,
    subscribeToNewsletter,
    getOgImageUrl
} from './api';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Utilities', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('API_ENDPOINTS', () => {
        it('exports correct endpoints', () => {
            expect(API_ENDPOINTS.chat).toBe('/api/chat');
            expect(API_ENDPOINTS.newsletter).toBe('/api/newsletter');
            expect(API_ENDPOINTS.og).toBe('/api/og');
        });
    });

    describe('ApiError', () => {
        it('creates error with message and status', () => {
            const error = new ApiError('Test error', 500);
            expect(error.message).toBe('Test error');
            expect(error.status).toBe(500);
            expect(error.name).toBe('ApiError');
        });

        it('creates error with optional code', () => {
            const error = new ApiError('Test error', 400, 'INVALID_INPUT');
            expect(error.code).toBe('INVALID_INPUT');
        });

        it('extends Error', () => {
            const error = new ApiError('Test', 500);
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('sendChatMessage', () => {
        it('sends messages to chat API', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Hello!' }),
            });

            const result = await sendChatMessage([
                { role: 'user', content: 'Hi' }
            ]);

            expect(mockFetch).toHaveBeenCalledWith(
                '/api/chat',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }),
                })
            );
            expect(result.data).toEqual({ reply: 'Hello!' });
            expect(result.error).toBeNull();
        });

        it('handles 400 error response without retry', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: 'Bad request' }),
            });

            const result = await sendChatMessage([]);

            expect(result.data).toBeNull();
            expect(result.error).toBe('Bad request');
            expect(result.status).toBe(400);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('uses generic error when response has no error field', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => Promise.resolve({}),
            });

            const result = await sendChatMessage([]);

            expect(result.error).toBe('Request failed with status 404');
        });

        it('handles successful response correctly', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Test reply' }),
            });

            const result = await sendChatMessage([{ role: 'user', content: 'test' }]);

            expect(result.status).toBe(200);
            expect(result.data?.reply).toBe('Test reply');
            expect(result.error).toBeNull();
        });
    });

    describe('subscribeToNewsletter', () => {
        it('sends email to newsletter API', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true, message: 'Subscribed!' }),
            });

            const result = await subscribeToNewsletter('test@example.com');

            expect(mockFetch).toHaveBeenCalledWith(
                '/api/newsletter',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ email: 'test@example.com' }),
                })
            );
            expect(result.data?.success).toBe(true);
        });

        it('handles newsletter subscription error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: 'Invalid email' }),
            });

            const result = await subscribeToNewsletter('invalid');

            expect(result.error).toBe('Invalid email');
            expect(result.status).toBe(400);
        });

        it('returns success message', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true, message: 'Welcome!' }),
            });

            const result = await subscribeToNewsletter('user@example.com');

            expect(result.data?.message).toBe('Welcome!');
        });
    });

    describe('getOgImageUrl', () => {
        it('generates URL with title', () => {
            const url = getOgImageUrl({ title: 'Test Title' });
            expect(url).toBe('/api/og?title=Test+Title');
        });

        it('generates URL with title and subtitle', () => {
            const url = getOgImageUrl({ title: 'Test', subtitle: 'Subtitle' });
            expect(url).toContain('title=Test');
            expect(url).toContain('subtitle=Subtitle');
        });

        it('generates URL with all params', () => {
            const url = getOgImageUrl({
                title: 'Test',
                subtitle: 'Sub',
                category: 'Blog'
            });
            expect(url).toContain('title=Test');
            expect(url).toContain('subtitle=Sub');
            expect(url).toContain('category=Blog');
        });

        it('encodes special characters', () => {
            const url = getOgImageUrl({ title: 'Hello & World' });
            expect(url).toContain('Hello');
            expect(url).toContain('World');
        });

        it('omits undefined optional params', () => {
            const url = getOgImageUrl({ title: 'Test' });
            expect(url).not.toContain('subtitle');
            expect(url).not.toContain('category');
        });

        it('handles empty title', () => {
            const url = getOgImageUrl({ title: '' });
            expect(url).toBe('/api/og?title=');
        });
    });
});
