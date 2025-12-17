# ADR-003: Groq AI for Chatbot

## Status
Accepted

## Context
We wanted to add an AI-powered chatbot to answer questions about the resume owner. Key requirements:
- Fast response times
- Cost-effective
- Easy integration

## Decision
We chose **Groq API** with the Llama 3.1 8B model because:

1. **Speed**: Groq's custom hardware provides extremely fast inference
2. **Cost**: Competitive pricing for API usage
3. **Quality**: Llama 3.1 provides good response quality
4. **OpenAI-Compatible**: Easy to switch models if needed

## Implementation
- Edge API route at `/api/chat`
- Server-Sent Events (SSE) for streaming responses
- System prompt with resume context
- Rate limiting (10 messages/minute)

## Consequences
- ✅ Sub-second response times
- ✅ Cost-effective for personal portfolio
- ✅ Streaming for real-time feedback
- ⚠️ Requires API key management
- ⚠️ Dependent on external service
