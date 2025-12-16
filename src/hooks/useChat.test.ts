import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from './useChat';

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
});
