# Technical Debt Report

## Summary
Analysis date: 2025-12-18

| Category | Count | Severity |
|----------|-------|----------|
| Any Types | 50+ | Medium |
| ESLint Disables | 29 | Medium |
| Array Index Keys | 12 | Low |
| Deprecated Icons | 6 | Low |

---

## High Priority

### 1. Type Safety Issues
**Files with `: any` usage (non-test):**
- `FloatingActions.tsx:16` - `hero: any`
- `Blog.tsx:14` - `blogText: any`
- `ChatWidget.tsx:17` - locale typing
- `Footer.tsx:93` - navigation typing
- `Services.tsx:19,21,221` - service typing
- `useChat.ts:15` - message typing

**Recommendation:** Create proper TypeScript interfaces for locale types.

---

### 2. React Anti-patterns

**setState in useEffect (9 occurrences):**
| File | Line | Context |
|------|------|---------|
| Header.tsx | 26 | Scroll state |
| ChatWidget.tsx | 49,69 | Badge management |
| ThemeToggle.tsx | 14 | Theme init |
| ScrollProgress.tsx | 16 | Scroll tracking |
| Tooltip.tsx | 58 | Position calc |
| LanguageContext.tsx | 30 | Language init |
| ThemeContext.tsx | 40 | Theme init |
| FeatureFlags.tsx | 60 | Feature loading |
| useServiceWorker.ts | 43 | SW state |

**Note:** Most are legitimate patterns for initialization/effects.

---

### 3. Array Index as Keys (12 occurrences)
| File | Line |
|------|------|
| Blog.tsx | 105 |
| Skills.tsx | 150, 337, 468, 481 |
| Footer.tsx | 97 |
| TechCarousel.tsx | 15 |
| ClientCarousel.tsx | 13 |
| Services.tsx | 189 |
| Hero.tsx | 222, 254 |
| FloatingActions.tsx | 71 |

**Risk:** Can cause rendering bugs if list items change.
**Fix:** Use unique IDs or content-based keys.

---

## Medium Priority

### 4. Missing Component Barrel Exports
```
src/components/
├── ui/           # 65 files - needs index.ts
├── sections/     # 15 files - needs index.ts
├── blog/         # 10 files - needs index.ts
└── layout/       # 5 files - needs index.ts
```

### 5. Test Mocks with Any Types
50+ `any` usages in test files for framer-motion, next/image mocks.
**Recommendation:** Create shared typed mock utilities.

---

## Low Priority

### 6. CSS Class Modernization
- `bg-gradient-to-br` → `bg-linear-to-br` (5 occurrences in ChatWidget)

### 7. Lucide Icon Deprecations
Replace with new names:
- `Github` → `GitHubLogoIcon` or keep (just deprecation warning)
- `Linkedin` → `LinkedInLogoIcon`  
- `Twitter` → `XIcon` or `TwitterIcon`

---

## Recommendations

1. **Create locale types** - Define strict TypeScript interfaces for translations
2. **Create shared test utils** - Typed mocks for framer-motion, next/image
3. **Add barrel exports** - index.ts files for cleaner imports
4. **Use stable keys** - Replace array indices with unique IDs
5. **Document anti-patterns** - Add comments explaining legitimate eslint-disables
