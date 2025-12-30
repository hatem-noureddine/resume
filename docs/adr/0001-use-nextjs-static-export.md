# 1. Use Next.js Static Export

Date: 2025-12-15

## Status

Accepted

## Context

The project is a personal portfolio and resume website. A key requirement is low-cost, zero-maintenance hosting. GitHub Pages offers free static hosting. Next.js is the chosen framework for its component model and developer experience.

## Decision

We will use Next.js with `output: "export"` to generate a static HTML/CSS/JS site.

## Consequences

### Positive
- **Cost**: Hosting is free on GitHub Pages.
- **Performance**: Static files can be served via CDN with high cache hit rates.
- **Security**: No server to patch or secure; reduced attack surface.

### Negative
- **Dynamic Features**: No server-side rendering (SSR) at runtime.
- **API Routes**: Next.js API Routes (`/api/*`) are not supported. All backend logic must be offloaded to external services (e.g., Formspree for forms) or client-side APIs.
- **Image Optimization**: Default `next/image` optimization requires a server. We must use a custom loader or unoptimized images (or a cloud provider like Cloudinary/Sanity).
