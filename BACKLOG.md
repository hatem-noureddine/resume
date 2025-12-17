# Project Improvement Backlog

## High Priority

### 1. Type Safety Improvements
- [ ] Add strict typing to locale types (hero, blog, contact, etc.)
- [ ] Replace `any` types throughout codebase
- [ ] Create shared type definitions for API responses

### 2. Component Accessibility (a11y)
- [ ] Add keyboard support to LottieIcon click handler
- [ ] Ensure all interactive elements have proper ARIA roles
- [ ] Add focus states to custom interactive elements

---

## Medium Priority

### 3. Component Organization
- [ ] Create barrel exports (index.ts) for component directories
- [ ] Group hooks by domain: `/hooks/ui`, `/hooks/data`, `/hooks/animations`
- [ ] Standardize component file structure

### 4. Test Improvements
- [ ] Create shared test utilities and helpers
- [ ] Add visual regression tests with Playwright
- [ ] Improve test coverage for edge cases

### 5. Performance
- [ ] Lazy load Lottie animations
- [ ] Optimize image loading with priority hints
- [ ] Add bundle size monitoring

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

## Technical Debt

| Issue | Files | Priority |
|-------|-------|----------|
| Array index as keys | Multiple | Medium |
| Deprecated props (priority→fetchPriority) | BlurImage | Low |
| globalThis vs window | Some tests | Low |
| Props not marked readonly | Multiple components | Low |
