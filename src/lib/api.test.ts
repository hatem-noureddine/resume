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

// Speed up tests by mocking setTimeout
jest.useFakeTimers();

describe('API Utilities', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        jest.clearAllTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
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

            const resultPromise = sendChatMessage([
                { role: 'user', content: 'Hi' }
            ]);
            jest.runAllTimers();
            const result = await resultPromise;

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

            const resultPromise = sendChatMessage([]);
            jest.runAllTimers();
            const result = await resultPromise;

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

            const resultPromise = sendChatMessage([]);
            jest.runAllTimers();
            const result = await resultPromise;

            expect(result.error).toBe('Request failed with status 404');
        });

        it('handles successful response correctly', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Test reply' }),
            });

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);
            jest.runAllTimers();
            const result = await resultPromise;

            expect(result.status).toBe(200);
            expect(result.data?.reply).toBe('Test reply');
            expect(result.error).toBeNull();
        });

        it('retries on 500 server error and eventually succeeds', async () => {
            // First call fails with 500
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'Server error' }),
            });
            // Second call succeeds
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Success after retry' }),
            });

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            // Run timers for retry delays
            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(result.data?.reply).toBe('Success after retry');
            expect(result.error).toBeNull();
        });

        it('retries on 429 rate limit error', async () => {
            // First call fails with 429
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 429,
                json: () => Promise.resolve({ error: 'Rate limited' }),
            });
            // Second call succeeds
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Success' }),
            });

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(result.data?.reply).toBe('Success');
        });

        it('fails after exhausting all retries on persistent 500 error', async () => {
            // All calls fail with 500
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'Server error' }),
            });

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            // Run through all retry delays
            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);
            await jest.advanceTimersByTimeAsync(1200);
            await jest.advanceTimersByTimeAsync(2400);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
            expect(result.error).toBe('Server error');
            expect(result.data).toBeNull();
        });

        it('retries on network error and eventually succeeds', async () => {
            // First call throws network error
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            // Second call succeeds
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ reply: 'Success' }),
            });

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(result.data?.reply).toBe('Success');
        });

        it('fails after exhausting all retries on persistent network error', async () => {
            // All calls throw network error
            mockFetch.mockRejectedValue(new Error('Network error'));

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);
            await jest.advanceTimersByTimeAsync(1200);
            await jest.advanceTimersByTimeAsync(2400);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(4);
            expect(result.error).toBe('Network error');
            expect(result.status).toBe(0);
        });

        it('handles non-Error object thrown', async () => {
            mockFetch.mockRejectedValue('string error');

            const resultPromise = sendChatMessage([{ role: 'user', content: 'test' }]);

            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);
            await jest.advanceTimersByTimeAsync(1200);
            await jest.advanceTimersByTimeAsync(2400);

            const result = await resultPromise;

            expect(result.error).toBe('Unknown error occurred');
        });
    });

    describe('subscribeToNewsletter', () => {
        it('sends email to newsletter API', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true, message: 'Subscribed!' }),
            });

            const resultPromise = subscribeToNewsletter('test@example.com');
            jest.runAllTimers();
            const result = await resultPromise;

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

            const resultPromise = subscribeToNewsletter('invalid');
            jest.runAllTimers();
            const result = await resultPromise;

            expect(result.error).toBe('Invalid email');
            expect(result.status).toBe(400);
        });

        it('returns success message', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true, message: 'Welcome!' }),
            });

            const resultPromise = subscribeToNewsletter('user@example.com');
            jest.runAllTimers();
            const result = await resultPromise;

            expect(result.data?.message).toBe('Welcome!');
        });

        it('retries on server error for newsletter', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 502,
                json: () => Promise.resolve({ error: 'Bad gateway' }),
            });
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true, message: 'Subscribed!' }),
            });

            const resultPromise = subscribeToNewsletter('test@example.com');

            await jest.advanceTimersByTimeAsync(300);
            await jest.advanceTimersByTimeAsync(600);

            const result = await resultPromise;

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(result.data?.success).toBe(true);
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
