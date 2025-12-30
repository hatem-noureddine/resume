/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with configurable limits.
 * 
 * Note: This is suitable for single-instance deployments.
 * For multi-instance deployments, use Redis or similar.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
    /** Maximum number of requests allowed within the window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
};

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}

/**
 * Check if a request should be rate limited.
 * 
 * @param key - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Result indicating if request is allowed and remaining quota
 * 
 * @example
 * ```typescript
 * const result = checkRateLimit(clientIP, { maxRequests: 10, windowMs: 60000 });
 * if (!result.success) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
    key: string,
    config: Partial<RateLimitConfig> = {}
): RateLimitResult {
    const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
    const now = Date.now();

    // Clean up expired entries periodically
    // Use crypto for better randomness (Sonar scan fix)
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const random = array[0] / (0xffffffff + 1);

    if (random < 0.1) {
        cleanupExpiredEntries();
    }

    const entry = rateLimitMap.get(key);

    // No existing entry or window has expired
    if (!entry || now > entry.resetTime) {
        const resetTime = now + windowMs;
        rateLimitMap.set(key, { count: 1, resetTime });
        return {
            success: true,
            remaining: maxRequests - 1,
            resetTime,
        };
    }

    // Within the window - check limit
    if (entry.count >= maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime,
            retryAfter,
        };
    }

    // Increment count
    entry.count += 1;
    return {
        success: true,
        remaining: maxRequests - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Create rate limit headers for the response.
 * 
 * @param result - Rate limit check result
 * @param config - Rate limit configuration
 * @returns Headers object with rate limit information
 */
export function createRateLimitHeaders(result: RateLimitResult): Headers {
    const headers = new Headers();
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.resetTime.toString());

    if (!result.success && result.retryAfter) {
        headers.set('Retry-After', result.retryAfter.toString());
    }

    return headers;
}

/**
 * Create a rate-limited error response.
 */
export function rateLimitedResponse(result: RateLimitResult): Response {
    const headers = createRateLimitHeaders(result);
    return new Response(
        JSON.stringify({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Please try again in ${result.retryAfter} seconds.`,
            retryAfter: result.retryAfter,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                ...Object.fromEntries(headers.entries()),
            },
        }
    );
}

/**
 * Get client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIP(request: Request): string {
    // Try various headers used by different platforms
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    // Fallback for local development
    return 'unknown';
}

/**
 * Clean up expired rate limit entries to prevent memory leaks.
 */
function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}

// Preset configurations for common use cases
export const RATE_LIMITS = {
    /** Strict limit for sensitive operations like form submissions */
    strict: { maxRequests: 3, windowMs: 60 * 1000 },
    /** Standard limit for regular API calls */
    standard: { maxRequests: 10, windowMs: 60 * 1000 },
    /** Relaxed limit for less sensitive endpoints */
    relaxed: { maxRequests: 30, windowMs: 60 * 1000 },
    /** Very strict limit for newsletter subscriptions */
    newsletter: { maxRequests: 2, windowMs: 60 * 60 * 1000 }, // 2 per hour
    /** Limit for contact form submissions */
    contact: { maxRequests: 3, windowMs: 5 * 60 * 1000 }, // 3 per 5 minutes
    /** Limit for AI/chat endpoints */
    ai: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
} as const;
