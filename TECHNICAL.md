# Technical Documentation

## Architecture Overview

This project is built using **Next.js 16** with the **App Router**, leveraging **Server Components** for static rendering and **Client Components** for localized interactivity.

### Tech Stack Choices

1.  **Framework: Next.js 16**
    *   **Reason**: Chosen for its robust static site generation (SSG) capabilities, which are ideal for a high-performance portfolio/resume site. The App Router provides a clean, folder-based routing structure.

2.  **Styling: Tailwind CSS v4**
    *   **Reason**: Provides utility-first styling with minimal runtime overhead. Version 4 (if configured) or v3 pattern offers modern features like compiled build-time styles.

3.  **Animation: Framer Motion**
    *   **Reason**: The industry standard for React animations. It is used for scroll-triggered reveal effects (`whileInView`) and interactive elements (hover states).

4.  **Icons: Lucide React**
    *   **Reason**: A consistent, lightweight icon set that integrates seamlessly with React.

5.  **State Management: React Context**
    *   **LanguageContext**: Handles application-wide language state without prop drilling.
    *   **ThemeContext**: Manages Dark/Light mode preferences.

### Design Patterns

*   **Component-Based Architecture**: UI is broken down into small, reusable components in `src/components`.
    *   `sections`: Large page sections (e.g., `Hero`, `Skills`).
    *   `ui`: Low-level atomic components (e.g., `Button`, `SectionHeading`).
*   **Localization Strategy**:
    *   Content is stored in TypeScript files (`src/locales/*.ts`) rather than JSON to allow type safety and code-splitting if needed.
    *   A custom hook `useLanguage` provides access to proper strings based on the current selection.

### Directory Structure

```
src/
├── app/               # Next.js App Router pages
├── components/        # React components
│   ├── layout/        # Header, Footer
│   ├── sections/      # Page sections (Skills, Hero, etc.)
│   └── ui/            # Reusable UI atoms
├── context/           # Global state providers
├── data/              # Static data (Carousels)
├── hooks/             # Custom hooks
│   └── usePrefersReducedMotion.ts # Accessible animation preferences
├── lib/               # Utilities
└── locales/           # Translation files

### Key Custom Hooks

-   **`usePrefersReducedMotion`**: A SSR-safe hook that detects the user's `prefers-reduced-motion` setting. It uses `useSyncExternalStore` to prevent hydration mismatches and ensures accessibility compliance by disabling or simplifying animations.

```

### Future Considerations

*   **CMS Integration**: The current structure separates data (`locales`, `data`) from presentation, making it easy to swap static imports for API calls to a Headless CMS (like Strapi or Contentful) in the future.
*   **Performance**: Images currently use standard `img` tags or placeholders. Migrating to `next/image` is recommended for production optimization.
