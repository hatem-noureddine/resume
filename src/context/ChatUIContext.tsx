"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatUIContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleChat: () => void;
}

const ChatUIContext = createContext<ChatUIContextType | undefined>(undefined);

export function ChatUIProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <ChatUIContext.Provider value={{ isOpen, setIsOpen, toggleChat }}>
            {children}
        </ChatUIContext.Provider>
    );
}

export function useChatUI() {
    const context = useContext(ChatUIContext);
    if (context === undefined) {
        throw new Error("useChatUI must be used within a ChatUIProvider");
    }
    return context;
}
