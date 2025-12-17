# ADR-005: Internationalization (i18n)

## Status
Accepted

## Context
The portfolio needs to support multiple languages (English, French, Spanish) to reach a wider audience.

## Decision
We implemented a **React Context-based i18n solution** rather than using a library like next-intl or i18next.

### Reasons:
1. **Simplicity**: No complex routing setup required
2. **Bundle Size**: No additional i18n library overhead
3. **Control**: Full control over translation loading
4. **Type Safety**: TypeScript strongly-typed translations

### Implementation
- `LanguageContext` with `useLanguage` hook
- Locale files in `/locales/` (en.ts, fr.ts, es.ts)
- Language persisted to localStorage
- Auto-detection from browser settings

## Consequences
- ✅ Simple and lightweight
- ✅ Type-safe translations
- ✅ No URL path changes required
- ⚠️ All translations bundled (no lazy loading per locale)
- ⚠️ No URL-based locale (SEO tradeoff)
