# ADR-002: Tailwind CSS for Styling

## Status
Accepted

## Context
We needed a styling solution that is:
- Fast to develop with
- Maintainable at scale
- Performant in production

## Decision
We chose **Tailwind CSS v4** because:

1. **Utility-First**: Rapid UI development without context switching
2. **Zero Runtime**: Styles are purged at build time
3. **Design Tokens**: Built-in design system with CSS variables
4. **Tree Shaking**: Only used classes are included in bundle

## Alternatives Considered
- **CSS Modules**: More verbose, slower development
- **Styled Components**: Runtime overhead, larger bundle
- **Vanilla CSS**: Less maintainable at scale

## Consequences
- ✅ Fast development with atomic classes
- ✅ Consistent design system via CSS variables
- ✅ Small production bundle
- ✅ Easy dark mode with `dark:` prefix
- ⚠️ HTML can look verbose with many classes
- ⚠️ Requires learning utility class names
