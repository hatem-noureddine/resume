/**
 * API Utilities
 * 
 * Lightweight API helper functions for the portfolio site.
 * Provides consistent error handling and response parsing.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    reply: string;
}

export interface NewsletterResponse {
    success: boolean;
    message: string;
}

// =============================================================================
// API ENDPOINTS
// =============================================================================

export const API_ENDPOINTS = {
    chat: '/api/chat',
    newsletter: '/api/newsletter',
    og: '/api/og',
} as const;

// =============================================================================
// ERROR HANDLING
// =============================================================================

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// =============================================================================
// BASE FETCH WRAPPER
// =============================================================================

async function fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error || `Request failed with status ${response.status}`,
                status: response.status,
            };
        }

        return {
            data,
            error: null,
            status: response.status,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            data: null,
            error: message,
            status: 0,
        };
    }
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Send a message to the chat API
 */
export async function sendChatMessage(
    messages: ChatMessage[]
): Promise<ApiResponse<ChatResponse>> {
    return fetchWithErrorHandling<ChatResponse>(API_ENDPOINTS.chat, {
        method: 'POST',
        body: JSON.stringify({ messages }),
    });
}

/**
 * Subscribe to the newsletter
 */
export async function subscribeToNewsletter(
    email: string
): Promise<ApiResponse<NewsletterResponse>> {
    return fetchWithErrorHandling<NewsletterResponse>(API_ENDPOINTS.newsletter, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

/**
 * Generate OG image URL
 */
export function getOgImageUrl(params: {
    title: string;
    subtitle?: string;
    category?: string;
}): string {
    const searchParams = new URLSearchParams();
    searchParams.set('title', params.title);
    if (params.subtitle) searchParams.set('subtitle', params.subtitle);
    if (params.category) searchParams.set('category', params.category);

    return `${API_ENDPOINTS.og}?${searchParams.toString()}`;
}
