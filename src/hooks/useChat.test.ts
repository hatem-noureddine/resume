import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from './useChat';
import { TextEncoder } from 'util';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock language context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            chat: {
                greeting: 'Hello!',
                intro: 'Welcome',
                askMe: 'Ask me anything',
                errorMessage: 'Error occurred',
            },
        },
        language: 'en',
    }),
}));

// Mock resume context
jest.mock('@/config/resume', () => ({
    RESUME_CONTEXT: {
        name: 'Test User',
        email: 'test@example.com',
    },
}));

describe('useChat', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        mockFetch.mockReset();
    });

    it('initializes with empty messages', () => {
        const { result } = renderHook(() => useChat());
        expect(result.current.messages).toEqual([]);
        expect(result.current.isLoading).toBe(false);
    });

    it('loads messages from localStorage on mount', async () => {
        const savedMessages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there' },
        ];
        localStorageMock.setItem('chat_history', JSON.stringify(savedMessages));

        const { result } = renderHook(() => useChat());

        await waitFor(() => {
            expect(result.current.messages).toHaveLength(2);
        });
    });

    it('sets input value', () => {
        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test message');
        });

        expect(result.current.input).toBe('test message');
    });

    it('clears chat history', async () => {
        const savedMessages = [
            { role: 'user', content: 'Hello' },
        ];
        localStorageMock.setItem('chat_history', JSON.stringify(savedMessages));

        const { result } = renderHook(() => useChat());

        await waitFor(() => {
            expect(result.current.messages.length).toBeGreaterThan(0);
        });

        act(() => {
            result.current.clearHistory();
        });

        expect(result.current.messages).toHaveLength(0);
    });

    it('does not send empty messages', async () => {
        const { result } = renderHook(() => useChat());

        await act(async () => {
            await result.current.sendMessage('   ');
        });

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles rate limiting', async () => {
        const { result } = renderHook(() => useChat());

        // Mock successful API response
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn()
                        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n') })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        });

        // Send 11 messages quickly to trigger rate limit
        for (let i = 0; i < 11; i++) {
            act(() => {
                result.current.setInput(`message ${i}`);
            });
            await act(async () => {
                await result.current.sendMessage();
            });
        }

        // Rate limit warning should be set at some point
        // The exact behavior depends on implementation
        expect(result.current.rateLimitWarning || mockFetch.mock.calls.length <= 10).toBeTruthy();
    });

    it('handles setMessages function', () => {
        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setMessages([
                { role: 'user', content: 'New message' },
            ]);
        });

        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].content).toBe('New message');
    });

    it('handles invalid JSON in localStorage gracefully', async () => {
        localStorageMock.setItem('chat_history', 'invalid json');

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useChat());

        await waitFor(() => {
            expect(result.current.messages).toEqual([]);
        });

        consoleSpy.mockRestore();
    });

    it('saves messages to localStorage when they change', async () => {
        const { result } = renderHook(() => useChat());

        await waitFor(() => {
            expect(result.current).toBeDefined();
        });

        act(() => {
            result.current.setMessages([
                { role: 'user', content: 'Test' },
            ]);
        });

        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'chat_history',
                expect.any(String)
            );
        });
    });

    it('sets isLoading true during message send', async () => {
        // Create a promise that we can control
        let resolvePromise: (value: any) => void;
        const pendingPromise = new Promise(resolve => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValue(pendingPromise);

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test');
        });

        // Start sending - don't await yet
        let sendPromise: Promise<void>;
        act(() => {
            sendPromise = result.current.sendMessage();
        });

        // isLoading should be true while waiting
        expect(result.current.isLoading).toBe(true);

        // Resolve the promise
        resolvePromise!({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn().mockResolvedValue({ done: true }),
                }),
            },
        });

        await act(async () => {
            await sendPromise;
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('handles API error response', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        });

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test message');
        });

        await act(async () => {
            await result.current.sendMessage();
        });

        // Should have added error message
        expect(result.current.messages.some(m =>
            m.role === 'assistant' && m.content.includes('test@example.com')
        )).toBe(true);

        consoleSpy.mockRestore();
    });

    it('handles [DONE] in streaming data', async () => {
        const encoder = new TextEncoder();
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn()
                        .mockResolvedValueOnce({
                            done: false,
                            value: encoder.encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n')
                        })
                        .mockResolvedValueOnce({
                            done: false,
                            value: encoder.encode('data: [DONE]\n\n')
                        })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        });

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test');
        });

        await act(async () => {
            await result.current.sendMessage();
        });

        // Should have processed the message correctly despite [DONE]
        expect(result.current.messages.length).toBeGreaterThan(0);
    });

    it('handles missing body in response', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            body: null,
        });

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test');
        });

        await act(async () => {
            await result.current.sendMessage();
        });

        // Should complete without error
        expect(result.current.isLoading).toBe(false);
    });

    it('does not send while already loading', async () => {
        let resolvePromise: (value: any) => void;
        const pendingPromise = new Promise(resolve => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValue(pendingPromise);

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('first');
        });

        // Start first send
        act(() => {
            result.current.sendMessage();
        });

        // Try to send again while loading
        act(() => {
            result.current.setInput('second');
            result.current.sendMessage();
        });

        // Should only have called fetch once
        expect(mockFetch).toHaveBeenCalledTimes(1);

        // Cleanup
        resolvePromise!({
            ok: true,
            body: { getReader: () => ({ read: jest.fn().mockResolvedValue({ done: true }) }) },
        });
    });

    it('handles JSON parse error in stream gracefully', async () => {
        const encoder = new TextEncoder();
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn()
                        .mockResolvedValueOnce({
                            done: false,
                            value: encoder.encode('data: invalid json\n\n')
                        })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        });

        const { result } = renderHook(() => useChat());

        act(() => {
            result.current.setInput('test');
        });

        // Should not throw
        await act(async () => {
            await result.current.sendMessage();
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('handles empty localStorage array', async () => {
        localStorageMock.setItem('chat_history', JSON.stringify([]));

        const { result } = renderHook(() => useChat());

        await waitFor(() => {
            expect(result.current.messages).toEqual([]);
        });

        // hasInteracted should still be false for empty array
        expect(result.current.hasInteracted).toBe(false);
    });

    it('can pass message directly to sendMessage', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn().mockResolvedValue({ done: true }),
                }),
            },
        });

        const { result } = renderHook(() => useChat());

        await act(async () => {
            await result.current.sendMessage('direct message');
        });

        expect(result.current.messages[0].content).toBe('direct message');
    });

    it('trims whitespace from messages', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn().mockResolvedValue({ done: true }),
                }),
            },
        });

        const { result } = renderHook(() => useChat());

        await act(async () => {
            await result.current.sendMessage('  trimmed message  ');
        });

        expect(result.current.messages[0].content).toBe('trimmed message');
    });
});

