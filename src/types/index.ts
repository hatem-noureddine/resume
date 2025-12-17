/**
 * Shared type definitions for the application
 * Consolidates types used across multiple components
 */

// =============================================================================
// Chat Types
// =============================================================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
}

export interface ChatApiRequest {
    message: string;
    context?: string;
}

export interface ChatApiResponse {
    response: string;
    error?: string;
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    input: string;
}

// =============================================================================
// Blog Types
// =============================================================================

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    category?: string;
    tags?: string[];
    readingTime?: string;
    image?: string;
    content?: string;
}

export interface TableOfContentsHeading {
    id: string;
    text: string;
    level: number;
}

// =============================================================================
// Resume Types
// =============================================================================

export interface Experience {
    title: string;
    company: string;
    period: string;
    location?: string;
    highlights: string[];
}

export interface Education {
    degree: string;
    institution: string;
    period: string;
    location?: string;
}

export interface Skill {
    name: string;
    level?: number;
    category?: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
    image?: string;
}

// =============================================================================
// UI Types
// =============================================================================

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    isVisible: boolean;
    onClose: () => void;
}

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    showError?: boolean;
}

// =============================================================================
// Language Types
// =============================================================================

export type SupportedLanguage = 'en' | 'fr' | 'es';

export interface LocaleMetadata {
    name: string;
    flag: string;
    resume: string;
}
