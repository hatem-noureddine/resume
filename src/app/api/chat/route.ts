import { CHATBOT_SYSTEM_PROMPT } from '@/config/resume';

export const runtime = 'edge';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json() as { messages: ChatMessage[] };

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Messages array is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Chat service not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Build messages with system prompt
        const chatMessages: ChatMessage[] = [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
            ...messages.slice(-10) // Keep last 10 messages for context
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: chatMessages,
                max_tokens: 500,
                temperature: 0.7,
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API error:', error);
            return new Response(
                JSON.stringify({ error: 'Failed to get response from AI' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Return streaming response
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
