"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RESUME_CONTEXT } from "@/config/resume";
import { useLanguage } from "@/context/LanguageContext";
import { en } from "@/locales/en";

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function useChat() {
    const { t } = useLanguage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat = (t as any).chat || en.chat;

    // Initialize messages from localStorage if available, otherwise empty array
    // We'll set the initial greeting in an effect to allow for hydration match if needed,
    // or we can just start empty and let the component handle the initial greeting logic
    // matching the original component's behavior.
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [rateLimitWarning, setRateLimitWarning] = useState(false);

    // Use a flag to track if we've loaded from storage to avoid overwriting with initial state
    const [isLoaded, setIsLoaded] = useState(false);

    const messageTimestamps = useRef<number[]>([]);

    // Rate limiting constants
    const RATE_LIMIT = 10;
    const RATE_WINDOW = 60000; // 1 minute in ms

    // Load from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chat_history');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                     
                    setMessages(parsed);
                     
                    setHasInteracted(true);
                }
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
         
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever messages change
    useEffect(() => {
        if (isLoaded && messages.length > 0) {
            localStorage.setItem('chat_history', JSON.stringify(messages));
        }
    }, [messages, isLoaded]);

    const checkRateLimit = useCallback(() => {
        const now = Date.now();
        messageTimestamps.current = messageTimestamps.current.filter(
            ts => now - ts < RATE_WINDOW
        );

        if (messageTimestamps.current.length >= RATE_LIMIT) {
            setRateLimitWarning(true);
            setTimeout(() => setRateLimitWarning(false), 3000);
            return false;
        }

        messageTimestamps.current.push(now);
        return true;
    }, []);

    const sendMessage = async (messageText?: string) => {
        const userMessage = (messageText || input).trim();
        if (!userMessage || isLoading) return;

        if (!checkRateLimit()) return;

        setInput('');
        setHasInteracted(true);

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content || '';
                                assistantMessage += content;

                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = {
                                        role: 'assistant',
                                        content: assistantMessage
                                    };
                                    return updated;
                                });
                            } catch {
                                // Ignore parse errors
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: `${chat.errorMessage} ${RESUME_CONTEXT.email}`
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = useCallback(() => {
        setMessages([]);
        setHasInteracted(false);
        localStorage.removeItem('chat_history');
    }, []);

    return {
        messages,
        input,
        setInput,
        isLoading,
        hasInteracted,
        sendMessage,
        rateLimitWarning,
        clearHistory,
        setMessages // exposed for initial greeting logic if needed
    };
}
