# API Reference

[← Back to Home](Home)

This document covers the API endpoints available in the portfolio website.

## Chat API

### POST /api/chat

AI-powered chat endpoint using Groq's LLama 3.1 model to respond to questions about skills and experience.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messages` | array | Yes | Chat messages (max 10 for context) |
| `messages[].role` | string | Yes | Either "user" or "assistant" |
| `messages[].content` | string | Yes | The message content |

#### Response

**Success (200):** Server-Sent Events stream
```
data: {"content": "Hello! I'm Hatem's AI assistant..."}
data: {"content": " I can help you..."}
data: [DONE]
```

**Error (400):** Bad Request
```json
{ "error": "Messages array is required" }
```

**Error (500):** Server Error
```json
{ "error": "Chat service not configured" }
```

#### Example Usage

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What are your skills?' }]
  })
});

// Handle streaming response
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      const data = JSON.parse(line.slice(6));
      console.log(data.content);
    }
  }
}
```

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | API key from [groq.com](https://console.groq.com/) |

---

## Newsletter API

### POST /api/newsletter

Subscribe to newsletter.

**Body:**
```json
{ "email": "user@example.com" }
```

---

## Contact Form (Formspree)

The `ContactForm` component supports Formspree integration.

### Setup

1. Create account at [formspree.io](https://formspree.io)
2. Create a form and get your form ID
3. Use the component:

```tsx
<ContactForm formspreeId="your-form-id" />
```

### Form Data Schema

```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

## Related Docs

- [Architecture](Architecture) - System design
- [Development Guide](Development-Guide) - Coding standards
