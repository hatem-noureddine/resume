# Animation Guidelines

This document provides guidelines for using animations consistently across the portfolio website.

## Overview

All animations are centralized in `lib/animations.ts`. This ensures consistency and makes it easy to adjust timing and effects globally.

## Core Principles

1. **Respect Reduced Motion** - Always check `usePrefersReducedMotion()` before applying non-essential animations
2. **Keep It Subtle** - Animations should enhance, not distract
3. **Use Consistent Timing** - Stick to the predefined duration presets
4. **Stagger Children** - Use container variants for lists and grids

## Available Presets

### Fade Variants
```tsx
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from '@/lib/animations';

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
    Content fades in while moving up
</motion.div>
```

### Scale Variants
```tsx
import { scaleIn, scaleInBounce } from '@/lib/animations';

<motion.div variants={scaleIn} initial="hidden" animate="visible">
    Content scales in smoothly
</motion.div>
```

### Container Variants (Staggered Children)
```tsx
import { staggerContainer, fadeInUp } from '@/lib/animations';

<motion.ul variants={staggerContainer} initial="hidden" animate="visible">
    {items.map(item => (
        <motion.li key={item.id} variants={fadeInUp}>
            {item.name}
        </motion.li>
    ))}
</motion.ul>
```

### Hover & Tap States
```tsx
import { hoverScale, tapScale, hoverLift } from '@/lib/animations';

<motion.button whileHover={hoverScale} whileTap={tapScale}>
    Interactive Button
</motion.button>
```

## Duration Presets

| Preset | Duration | Use Case |
|--------|----------|----------|
| `fast` | 150ms | Micro-interactions, hover states |
| `normal` | 300ms | Standard transitions |
| `slow` | 500ms | Page transitions, modals |
| `verySlow` | 800ms | Hero sections, dramatic reveals |

## Handling Reduced Motion

Always respect the user's reduced motion preference:

```tsx
import { usePrefersReducedMotion } from '@/hooks';
import { fadeInUp, conditionalAnimation } from '@/lib/animations';

function MyComponent() {
    const prefersReducedMotion = usePrefersReducedMotion();
    
    return (
        <motion.div
            initial={conditionalAnimation({ opacity: 0, y: 20 }, prefersReducedMotion)}
            animate={{ opacity: 1, y: 0 }}
        >
            Content
        </motion.div>
    );
}
```

## Best Practices

### ✅ Do
- Use predefined variants from `lib/animations.ts`
- Check `usePrefersReducedMotion()` for non-essential animations
- Keep animations under 500ms for UI elements
- Use `staggerContainer` for lists

### ❌ Don't
- Create one-off animation definitions inline
- Ignore reduced motion preferences
- Use animations that block user interaction
- Animate on every scroll (use viewport triggers sparingly)

## Adding New Variants

If you need a new animation pattern:

1. Add it to `lib/animations.ts`
2. Export it with proper TypeScript types
3. Document it in this file
4. Follow the naming convention: `{effect}{Direction}` (e.g., `fadeInUp`, `scaleInBounce`)
