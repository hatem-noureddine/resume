# API Documentation

## Chat API

### POST /api/chat

AI-powered chat endpoint that uses Groq's LLama 3.1 model to respond to user messages about the portfolio owner's resume and experience.

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
| `messages` | array | Yes | Array of chat messages (max 10 used for context) |
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
{
  "error": "Messages array is required"
}
```

**Error (500):** Server Error
```json
{
  "error": "Chat service not configured"
}
```

#### Example Usage

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What are your skills?' }
    ]
  })
});

// Handle streaming response
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parse SSE format: "data: {...}\n\n"
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      const data = JSON.parse(line.slice(6));
      console.log(data.content);
    }
  }
}
```

#### Rate Limiting

Client-side rate limiting is recommended:
- Max 10 messages per minute
- Implemented in `useChat` hook

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | API key from [groq.com](https://console.groq.com/) |

---

## Contact Form (Formspree)

The `ContactForm` component supports Formspree integration for serverless form handling.

### Setup

1. Create an account at [formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. Use the component:

```tsx
import { ContactForm } from '@/components/ui/ContactForm';

<ContactForm formspreeId="your-form-id" />
```

### Custom Handler

```tsx
<ContactForm onSubmit={async (data) => {
  await fetch('/your-api', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}} />
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
