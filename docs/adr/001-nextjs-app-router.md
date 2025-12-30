# ADR-001: Next.js App Router Architecture

## Status
Accepted

## Context
We needed to choose between Next.js Pages Router and the newer App Router for our portfolio/resume website.

## Decision
We chose **Next.js App Router** (introduced in Next.js 13) for the following reasons:

1. **Server Components by Default**: Better performance with server-side rendering
2. **Improved Routing**: File-based routing with layouts and parallel routes
3. **Streaming**: Progressive rendering for better user experience
4. **Future-Proof**: App Router is the future of Next.js

## Consequences
- ✅ Better SEO through server-side rendering
- ✅ Improved loading performance
- ✅ Cleaner code organization with colocation
- ⚠️ Learning curve for developers familiar with Pages Router
- ⚠️ Some libraries may need "use client" directive
