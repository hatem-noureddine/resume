"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Mail, Linkedin, FileText, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESUME_CONTEXT } from "@/config/resume";
import { useLanguage } from "@/context/LanguageContext";
import { en } from "@/locales/en";
import { useChat } from "@/hooks/useChat";
import { TypingIndicator } from "@/components/ui/TypingIndicator";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const { t } = useLanguage();

    // Get chat translations with English locale as fallback (single source of truth)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat = (t as any).chat || en.chat;

    const {
        messages,
        input,
        setInput,
        isLoading,
        hasInteracted,
        sendMessage,
        rateLimitWarning,
        clearHistory,
        setMessages
    } = useChat();

    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Set initial message when language changes or on mount
    useEffect(() => {
        if (!hasInteracted && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: `${chat.greeting}\n\n${chat.intro}\n\n${chat.askMe}`
                }
            ]);
            // Show unread badge for initial message if chat is closed
            if (!isOpen) {
                setUnreadCount(1);
            }
        }
    }, [chat.greeting, chat.intro, chat.askMe, hasInteracted, isOpen, messages.length, setMessages]);

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
        // Clear unread count when chat is opened
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const suggestedQuestions = chat.suggestedQuestions || [];

    return (
        <>
            {/* Floating Button with pulse animation */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg",
                    "bg-linear-to-r from-primary to-primary/80 text-white",
                    "hover:shadow-xl hover:shadow-primary/25",
                    "transition-all duration-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {/* Unread message badge */}
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                {/* Pulse ring when closed and no unread */}
                {!isOpen && unreadCount === 0 && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}
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
                            className="relative"
                        >
                            <MessageCircle size={24} />
                            <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300" />
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
                            "fixed z-50",
                            // Mobile: full screen with some padding
                            "inset-4 bottom-20",
                            // Tablet and up: positioned widget
                            "sm:inset-auto sm:bottom-24 sm:right-6",
                            "sm:w-[360px] sm:h-[520px] sm:max-h-[80vh]",
                            "md:w-[420px]",
                            // Shared styles
                            "bg-background border border-border rounded-2xl shadow-2xl",
                            "flex flex-col overflow-hidden"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{chat.header}</h3>
                                        <p className="text-sm opacity-80">{chat.subtitle}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearHistory}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors opacity-80 hover:opacity-100"
                                    title="Clear History"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2 mt-3">
                                <a
                                    href={`mailto:${RESUME_CONTEXT.email}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                                >
                                    <Mail size={12} />
                                    {chat.contactMe}
                                </a>
                                <a
                                    href={RESUME_CONTEXT.portfolio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                                >
                                    <Linkedin size={12} />
                                    LinkedIn
                                </a>
                                <a
                                    href={RESUME_CONTEXT.portfolio.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                                >
                                    <FileText size={12} />
                                    {chat.viewResume}
                                </a>
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
                                            "max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line",
                                            msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                                        )}
                                    >
                                        {msg.content || (
                                            <TypingIndicator />
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
                        {messages.length <= 2 && suggestedQuestions.length > 0 && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.slice(0, 3).map((q: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q)}
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
                            {/* Rate limit warning */}
                            {rateLimitWarning && (
                                <div className="mb-2 text-xs text-red-500 text-center animate-pulse">
                                    Too many messages. Please wait a moment.
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={chat.placeholder}
                                    disabled={isLoading}
                                    className={cn(
                                        "flex-1 px-4 py-2.5 rounded-full text-sm",
                                        "bg-secondary border-0 outline-none",
                                        "focus:ring-2 focus:ring-primary/50",
                                        "disabled:opacity-50"
                                    )}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message"
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
