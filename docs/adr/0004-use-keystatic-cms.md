# 4. Use Keystatic CMS

Date: 2025-12-15

## Status

Accepted

## Context

The portfolio uses Markdown files for blog posts. Managing frontmatter and formatting manually is error-prone.
We explored Headless CMS options (Sanity, Contentful) but desired a solution that:
1. Works with Static Export (GitHub Pages).
2. Keeps content in the Git repository (ownership, versioning).
3. Requires no external database or complex infrastructure.

## Decision

We will use **Keystatic**.
- **Mode**: Local (Git-based).
- **Storage**: Filesystem (`src/content/posts`).
- **Format**: Markdoc/MDX (via Keystatic Document field).

## Consequences

### Positive
- **Zero Infrastructure**: Content is just files in the repo.
- **Developer Experience**: "Local" mode allows editing via a nice Admin UI at `/keystatic` running on localhost.
- **Type Safety**: Keystatic generates types (or schemas are typed).

### Negative
- **Build Step**: Requires `@keystatic/core` and refactoring data fetchers to be async.
- **Production Editing**: Editing in production requires `github` mode configuration, which we are not enabling initially (sticking to local-first workflow).
