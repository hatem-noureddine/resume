"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESUME_CONTEXT } from "@/lib/resume-context";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hi! I'm here to help you learn about ${RESUME_CONTEXT.name}. Ask me about their skills, experience, or projects!`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

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

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Add empty assistant message that we'll update
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

                                // Update the last message with accumulated content
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = {
                                        role: 'assistant',
                                        content: assistantMessage
                                    };
                                    return updated;
                                });
                            } catch {
                                // Ignore parse errors for incomplete chunks
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
                    content: 'Sorry, I had trouble responding. Please try again or contact directly at ' + RESUME_CONTEXT.email
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const suggestedQuestions = [
        "What are your main skills?",
        "Tell me about your experience",
        "Are you available for hire?",
        "How can I contact you?"
    ];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg",
                    "bg-primary text-white hover:bg-primary/90",
                    "transition-colors duration-200"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "fixed bottom-24 right-6 z-50",
                            "w-[360px] h-[500px] max-h-[80vh]",
                            "bg-background border border-border rounded-2xl shadow-2xl",
                            "flex flex-col overflow-hidden",
                            "md:w-[400px]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground rounded-t-2xl flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Resume Assistant</h3>
                                <p className="text-sm opacity-80">Ask about skills & experience</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-2",
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Bot size={16} className="text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] p-3 rounded-2xl text-sm",
                                            msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                                        )}
                                    >
                                        {msg.content || (
                                            <span className="flex items-center gap-2">
                                                <Loader2 size={14} className="animate-spin" />
                                                Thinking...
                                            </span>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                            <User size={16} className="text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions (only show if few messages) */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.slice(0, 2).map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInput(q);
                                                sendMessage();
                                            }}
                                            disabled={isLoading}
                                            className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about experience, skills..."
                                    disabled={isLoading}
                                    className={cn(
                                        "flex-1 px-4 py-2.5 rounded-full text-sm",
                                        "bg-secondary border-0 outline-none",
                                        "focus:ring-2 focus:ring-primary/50",
                                        "disabled:opacity-50"
                                    )}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "p-2.5 rounded-full bg-primary text-white",
                                        "hover:bg-primary/90 transition-colors",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
