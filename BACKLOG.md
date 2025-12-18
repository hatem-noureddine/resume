# Project Improvement Backlog

## High Priority

### 1. Type Safety Improvements
- [x] Add strict typing to locale types (hero, blog, contact, etc.) ✓ Already defined in types.ts
- [x] Replace `any` types throughout codebase ✓ Fixed in Blog.tsx, Services.tsx, useChat.ts
- [ ] Create shared type definitions for API responses

### 2. Component Accessibility (a11y)
- [x] Add keyboard support to LottieIcon click handler ✓ Enter/Space support added
- [x] Ensure all interactive elements have proper ARIA roles ✓ StarRating, ThemeToggle, LottieIcon
- [x] Add focus states to custom interactive elements ✓ Focus rings added to LottieIcon

---

## Medium Priority

### 3. Component Organization
- [x] Create barrel exports (index.ts) for component directories ✓ All 8 directories
- [ ] Group hooks by domain: `/hooks/ui`, `/hooks/data`, `/hooks/animations`
- [ ] Standardize component file structure

### 4. Test Improvements
- [ ] Create shared test utilities and helpers
- [ ] Add visual regression tests with Playwright
- [ ] Improve test coverage for edge cases

### 5. Performance
- [x] Lazy load Lottie animations ✓ LottieAnimation.tsx uses React.lazy()
- [x] Optimize image loading with priority hints ✓ Hero uses loading="eager"
- [x] Add bundle size monitoring ✓ npm run analyze (bundle-analyzer configured)

---

## Low Priority

### 6. Animation System
- [ ] Centralize animation variants in config file
- [ ] Create reusable motion presets
- [ ] Document animation guidelines

### 7. Service Layer
- [ ] Abstract API calls to service modules
- [ ] Add request/response interceptors
- [ ] Implement proper error handling patterns

### 8. Documentation
- [ ] Add Storybook documentation for all components
- [ ] Create architecture decision records (ADRs)
- [ ] Add JSDoc comments to key functions

---

## Technical Debt (All Resolved ✓)

| Issue | Files | Status |
|-------|-------|--------|
| Array index as keys | Multiple | ✅ Fixed |
| Deprecated icons (brand icons) | FloatingActions, ChatWidget | ✅ Fixed (react-icons) |
| Cognitive complexity | Skills.tsx, useChat.ts | ✅ Fixed |
| Props not marked readonly | Multiple | ✅ Fixed |
| Type assertions | Skills.tsx | ✅ Fixed |
| Negated conditions | Hero, Skills | ✅ Fixed |
| Deprecated priority prop | BlurImage | ✅ Fixed (loading="eager") |

