
import { checkRateLimit, createRateLimitHeaders, rateLimitedResponse, getClientIP, RATE_LIMITS } from './rate-limit';

describe('rate-limit', () => {
    // Mock crypto for deterministic testing
    const originalCrypto = globalThis.crypto;
    const originalHeaders = globalThis.Headers;
    const originalRequest = globalThis.Request;
    const originalResponse = globalThis.Response;

    beforeAll(() => {
        Object.defineProperty(globalThis, 'crypto', {
            value: {
                getRandomValues: (arr: Uint32Array) => {
                    // Return 0 to force cleanup (or consistent behavior)
                    arr[0] = 0;
                    return arr;
                }
            }
        });

        // Mock Headers
        globalThis.Headers = class {
            private map = new Map<string, string>();
            append(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
            delete(name: string) { this.map.delete(name.toLowerCase()); }
            get(name: string) { return this.map.get(name.toLowerCase()) || null; }
            has(name: string) { return this.map.has(name.toLowerCase()); }
            set(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
            forEach(callback: any) { this.map.forEach(callback); }
            entries() { return this.map.entries(); }
        } as any;

        // Mock Request
        globalThis.Request = class {
            headers: Headers;
            url: string;
            constructor(input: string, init?: any) {
                this.url = input;
                this.headers = new Headers();
                if (init?.headers) {
                    for (const [key, value] of Object.entries(init.headers)) {
                        this.headers.set(key, value as string);
                    }
                }
            }
        } as any;

        // Mock Response
        globalThis.Response = class {
            status: number;
            headers: Headers;
            private body: any;

            constructor(body: any, init?: any) {
                this.body = body;
                this.status = init?.status || 200;
                this.headers = new Headers();
                if (init?.headers) {
                    for (const [key, value] of Object.entries(init.headers)) {
                        this.headers.set(key, value as string);
                    }
                }
            }
            json() { return Promise.resolve(JSON.parse(this.body)); }
        } as any;
    });

    afterAll(() => {
        Object.defineProperty(globalThis, 'crypto', { value: originalCrypto });
        globalThis.Headers = originalHeaders;
        globalThis.Request = originalRequest;
        globalThis.Response = originalResponse;
    });

    beforeEach(() => {
        // Since rateLimitMap is module-level private, we can't clear it directly.
        // We rely on unique keys for tests.
    });

    describe('checkRateLimit', () => {
        it('should allow requests within limit', () => {
            const key = 'test-client-1';
            const config = { maxRequests: 2, windowMs: 1000 };

            expect(checkRateLimit(key, config).success).toBe(true);
            expect(checkRateLimit(key, config).success).toBe(true);
        });

        it('should block requests exceeding limit', () => {
            const key = 'test-client-2';
            const config = { maxRequests: 1, windowMs: 1000 };

            expect(checkRateLimit(key, config).success).toBe(true);
            expect(checkRateLimit(key, config).success).toBe(false);
            expect(checkRateLimit(key, config).remaining).toBe(0);
        });

        it('should reset after windowMs', async () => {
            const key = 'test-client-3';
            const config = { maxRequests: 1, windowMs: 100 };

            checkRateLimit(key, config);
            expect(checkRateLimit(key, config).success).toBe(false);

            // Wait for window to expire
            await new Promise(resolve => setTimeout(resolve, 150));

            expect(checkRateLimit(key, config).success).toBe(true);
        });

        it('should use default config if not provided', () => {
            const key = 'test-client-default';
            // Default is 5 requests per minute
            for (let i = 0; i < 5; i++) {
                expect(checkRateLimit(key).success).toBe(true);
            }
            expect(checkRateLimit(key).success).toBe(false);
        });
    });

    describe('createRateLimitHeaders', () => {
        it('should create correct headers', () => {
            const result = {
                success: true,
                remaining: 5,
                resetTime: 1234567890
            };
            const headers = createRateLimitHeaders(result);
            expect(headers.get('X-RateLimit-Remaining')).toBe('5');
            expect(headers.get('X-RateLimit-Reset')).toBe('1234567890');
            expect(headers.get('Retry-After')).toBeNull();
        });

        it('should include Retry-After on failure', () => {
            const result = {
                success: false,
                remaining: 0,
                resetTime: 1234567890,
                retryAfter: 10
            };
            const headers = createRateLimitHeaders(result);
            expect(headers.get('Retry-After')).toBe('10');
        });
    });

    describe('rateLimitedResponse', () => {
        it('should return 429 response with correct headers', async () => {
            const result = {
                success: false,
                remaining: 0,
                resetTime: 1234567890,
                retryAfter: 60
            };
            const response = rateLimitedResponse(result);

            expect(response.status).toBe(429);
            expect(response.headers.get('Content-Type')).toBe('application/json');
            expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
            expect(response.headers.get('Retry-After')).toBe('60');

            const body = await response.json();
            expect(body.error).toBe('Too Many Requests');
        });
    });

    describe('getClientIP', () => {
        it('should extract IP from x-forwarded-for', () => {
            const req = new Request('http://localhost', {
                headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }
            });
            expect(getClientIP(req)).toBe('1.2.3.4');
        });

        it('should extract IP from x-real-ip', () => {
            const req = new Request('http://localhost', {
                headers: { 'x-real-ip': '10.0.0.1' }
            });
            expect(getClientIP(req)).toBe('10.0.0.1');
        });

        it('should fallback to unknown', () => {
            const req = new Request('http://localhost');
            expect(getClientIP(req)).toBe('unknown');
        });
    });

    describe('RATE_LIMITS', () => {
        it('should have predefined configs', () => {
            expect(RATE_LIMITS.strict).toBeDefined();
            expect(RATE_LIMITS.standard).toBeDefined();
            expect(RATE_LIMITS.ai).toBeDefined();
        });
    });
});
