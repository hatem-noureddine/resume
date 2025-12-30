/**
 * @jest-environment node
 */
import { POST } from './route';

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Function to clear fetch mock
    global.fetch = jest.fn();
    // Suppress console.error for expected errors
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
});

describe('POST /api/chat', () => {
    it('returns 400 if messages are missing', async () => {
        const req = new Request('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Messages array is required');
    });

    it('returns 500 if GROQ_API_KEY is not configured', async () => {
        delete process.env.GROQ_API_KEY;

        const req = new Request('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }],
            }),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Chat service not configured');
    });

    it('returns 500 if upstream API fails', async () => {
        process.env.GROQ_API_KEY = 'test-key';

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: async () => 'Upstream Error',
        });

        const req = new Request('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }],
            }),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to get response from AI');
    });

    it('returns 200 and streams response on success', async () => {
        process.env.GROQ_API_KEY = 'test-key';

        // Mock specialized streaming response
        const mockStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'));
                controller.close();
            }
        });

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: mockStream,
        });

        const req = new Request('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }],
            }),
        });

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/event-stream');
        expect(response.body).toBeDefined();
    });
});
