# 3. Form Handling Strategy

Date: 2025-12-15

## Status

Accepted

## Context

The user requested an investigation into using "API routes for form".
However, as documented in [ADR 0001](./0001-use-nextjs-static-export.md), the site uses Next.js Static Export (`output: "export"`) to host on GitHub Pages. Static exports do not support server-side API Routes (`/api/contact`) at runtime.

## Decision

We will use **Formspree** (or a similar external service) to handle form submissions.
We will **NOT** implement internal Next.js API routes for this purpose.

## Consequences

### Positive
- **Compatibility**: Works perfectly with Static Export/GitHub Pages.
- **Simplicity**: No backend code to write or maintain. Formspree handles email delivery and spam protection.

### Negative
- **Dependency**: Reliance on a third-party service.
- **Limits**: Free tier usage limits apply.
