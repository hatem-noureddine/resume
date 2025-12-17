# Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client Browser"]
        UI["React UI Components"]
        Context["Context Providers<br/>(Theme, Language)"]
        Hooks["Custom Hooks<br/>(useChat, useBookmarks, etc.)"]
    end

    subgraph NextApp["Next.js App Router"]
        Pages["Pages<br/>(/app/**/page.tsx)"]
        Layouts["Layouts<br/>(layout.tsx)"]
        API["API Routes<br/>(/api/chat)"]
    end

    subgraph Components["Component Library"]
        UIComp["UI Components<br/>(Button, Modal, etc.)"]
        Sections["Page Sections<br/>(Hero, Skills, etc.)"]
        Chat["Chat Widget"]
        Blog["Blog Components"]
    end

    subgraph External["External Services"]
        Groq["Groq AI API"]
        Formspree["Formspree"]
        Vercel["Vercel Analytics"]
    end

    subgraph Data["Data Layer"]
        Posts["Markdown Posts<br/>(/content/posts)"]
        Config["Configuration<br/>(/config/*)"]
        Locales["Translations<br/>(/locales/*)"]
    end

    UI --> Context
    Context --> Hooks
    Hooks --> API
    
    Pages --> Layouts
    Pages --> Components
    
    UIComp --> Sections
    Chat --> API
    Blog --> Posts
    
    API --> Groq
    UIComp --> Formspree
    Layouts --> Vercel
    
    Sections --> Config
    UI --> Locales
```

## Layer Descriptions

### Client Layer
- **React UI Components**: All visible user interface elements
- **Context Providers**: Global state management (Theme, Language)
- **Custom Hooks**: Reusable logic (useChat, useBookmarks, useFocusManagement)

### Next.js App Router
- **Pages**: File-based routing under `/app`
- **Layouts**: Shared layout components
- **API Routes**: Server-side API endpoints

### Component Library
- **UI Components**: Reusable components (Button, Modal, Tooltip, etc.)
- **Page Sections**: Composed sections (Hero, Skills, Experience)
- **Chat Widget**: AI-powered chatbot interface
- **Blog Components**: Blog-specific components (TableOfContents, RelatedPosts)

### External Services
- **Groq AI API**: Powers the chatbot responses
- **Formspree**: Handles contact form submissions
- **Vercel Analytics**: Tracks page views and performance

### Data Layer
- **Markdown Posts**: Blog content in `/content/posts`
- **Configuration**: Site and resume config in `/config`
- **Translations**: Multi-language support in `/locales`

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Hook
    participant API
    participant Groq

    User->>UI: Types message
    UI->>Hook: Updates input state
    User->>UI: Clicks send
    UI->>Hook: Calls sendMessage()
    Hook->>API: POST /api/chat
    API->>Groq: Stream request
    Groq-->>API: SSE response
    API-->>Hook: Stream chunks
    Hook-->>UI: Updates messages
    UI-->>User: Shows response
```

## Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/chat/        # Chat API endpoint
│   ├── blog/            # Blog pages
│   └── portfolio/       # Portfolio page
├── components/
│   ├── chat/            # Chat widget
│   ├── layout/          # Layout components
│   ├── sections/        # Page sections
│   ├── seo/             # SEO components
│   └── ui/              # UI component library
├── config/              # Configuration files
├── content/posts/       # Markdown blog posts
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── locales/             # Translation files
└── types/               # TypeScript types
```
