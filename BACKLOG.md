# Resume Portfolio - Feature Backlog

> Last updated: December 27, 2025

## 🚀 Active Development

### Testing & Quality (In Progress)
- [x] Unit test coverage > 85% lines/statements
- [x] Branch coverage > 75%
- [ ] Increase branch coverage to 80%+ (requires extensive component mocking)

### CI/CD Improvements (Completed ✅)
- [x] Visual regression tests (non-blocking due to OS differences)
- [x] PR comment permissions fixed
- [x] Vercel deployment with legacy-peer-deps
- [x] SonarCloud action upgraded to v4
- [x] Workflow permissions moved to job-level for security
- [x] Unused variable lint warnings cleaned up
- [x] Platform-specific visual regression snapshots (Linux for CI)

---

## ✅ Recently Completed (December 2025)

### Test Coverage Improvements
- [x] Added `ai-service.ts` tests (100% coverage)
- [x] Added `site.ts` config tests (100% coverage)
- [x] Enhanced `api.ts` tests with retry logic, error handling
- [x] Enhanced `PWAInstallPrompt.tsx` tests (iOS, standalone, localStorage, install flow)
- [x] Enhanced `FloatingAccessibility.tsx` tests (menu toggle, click-outside, font size bounds, RTL)
- [x] Excluded hard-to-test files from coverage (keystatic.ts, linkedin-sync.ts)
- [x] 959 tests passing (up from 912)

### Theme & Configuration
- [x] High Contrast theme colors configurable via Keystatic Admin
- [x] Dark mode High Contrast variant support
- [x] Refactored theme CSS injection with `buildCssVars` helper
- [x] Upgraded dependencies (Next.js 16.1.1, Storybook 10.1.10, Vitest 4.0.16)

### Code Quality
- [x] Type safety improvements - strict locale types
- [x] Shared test utilities - `test/utils.tsx`
- [x] Centralized animation system - `lib/animations.ts`
- [x] API abstraction layer with retry logic - `lib/api.ts`
- [x] Barrel exports for all modules

### Accessibility
- [x] Skip to content link
- [x] High contrast mode (WCAG AAA compliant)
- [x] Font size controls (small/medium/large)
- [x] Screen reader announcements (AnnouncerContext)
- [x] Focus trap for modals (useFocusTrap hook)
- [x] Keyboard support for all interactive elements

### Performance
- [x] Lazy-loaded Lottie animations
- [x] Optimized image loading
- [x] Bundle size monitoring
- [x] Service Worker caching for offline support
- [x] Core Web Vitals optimization

---

## ✅ Completed Features

### User Experience
- [x] Dark/Light mode persistence with localStorage
- [x] Smooth scroll-to-section with animation
- [x] Loading skeleton components
- [x] Page transition animations
- [x] Scroll progress indicator
- [x] Theme customization via Keystatic Admin

### Content & CMS
- [x] Dynamic resume data from Keystatic CMS
- [x] Multiple CV versions support
- [x] Project case studies with images and tech stack
- [x] Testimonials section with carousel
- [x] Certifications showcase with badges

### SEO & Performance
- [x] Structured data (JSON-LD) for Person, Resume
- [x] Dynamic Open Graph images
- [x] Core Web Vitals optimization
- [x] Preload critical assets
- [x] Service Worker caching

### Interactive Features
- [x] Interactive timeline
- [x] Project filtering by technology, year, category
- [x] Contact form with validation (Formspree)
- [x] Copy-to-clipboard for email/phone
- [x] QR code generation

### Analytics
- [x] Resume download tracking
- [x] Section visibility tracking
- [x] Chat analytics
- [x] A/B testing support

### Developer Experience
- [x] Storybook documentation
- [x] E2E test coverage (Playwright)
- [x] Visual regression tests
- [x] Bundle analyzer dashboard
- [x] Lighthouse CI checks

### Visual Enhancements
- [x] Particle background
- [x] Custom cursor effects
- [x] 3D elements (Three.js)
- [x] Glassmorphism cards
- [x] Animated Lottie icons
- [x] Gradient animations
- [x] Parallax scrolling

### Social Features
- [x] Social share buttons
- [x] LinkedIn sync
- [x] GitHub activity widget
- [x] Blog RSS feed
- [x] Newsletter signup

### Internationalization
- [x] English, French, Spanish, Arabic support
- [x] RTL layout support
- [x] Auto-detect locale
- [x] Language-specific formatting

### Advanced Features
- [x] PWA support (installable web app)
- [x] Voice navigation (Web Speech API)
- [x] AI resume suggestions (`/admin/assist`)

---

## 📋 Technical Debt (All Resolved ✅)

| Issue | Priority | Status |
|-------|----------|--------|
| Add error boundaries | Medium | ✅ Done |
| Migrate to React 19 features | Low | ✅ Done |
| Add retry logic to API calls | Medium | ✅ Done |
| Optimize bundle splitting | Medium | ✅ Done |
| Add request caching | Low | ✅ Done |

---

## 💡 Ideas for Future Consideration

### 🔧 Quick Wins (Low Effort, High Impact)
- [x] **Add dependency caching in CI** - Faster CI runs (30-50% faster)
- [x] **Add bundle size budget checks** - Catch size regressions in PRs (500KB chunk / 2MB total)
- [x] **Fix remaining SonarQube warnings** - Refactored ThemeContext.tsx, cleaner internal naming
- [x] **Print stylesheet** - Clean print version of resume optimized for A4/Letter

### 📊 Test Coverage Enhancements
- [ ] **Increase branch coverage to 80%** - Focus on Hero.tsx (62%), NewsletterForm.tsx (72%), markdown-components.tsx (46%)
- [ ] **Integration tests for key flows** - Contact form, language switching, theme persistence
- [ ] **E2E tests for admin flows** - CMS editing, AI suggestions

### 🚀 Performance Improvements
- [ ] **Image optimization** - Convert remaining images to WebP/AVIF, add blur placeholders
- [ ] **Code splitting** - Lazy load admin sections and heavy 3D components
- [ ] **Aggressive caching headers** - Static assets, API responses with SWR

### 🎨 UX/UI Enhancements
- [x] **Skeleton loading improvements** - Shimmer animation effects already implemented
- [ ] **Micro-interactions** - Haptic-like feedback on buttons, subtle hover animations
- [ ] **Mobile navigation improvements** - Better touch targets, swipe gestures

### 🔒 Security & Reliability
- [ ] **Error tracking integration** - Sentry or similar for production monitoring
- [x] **Rate limiting** - API routes protected (newsletter: 2/hr, chat: 10/min)

---

### Near-Term (Completed ✅)
- [x] **Cross-browser visual snapshots** - Platform-specific snapshot paths configured
- [x] **Upgrade SonarCloud action** - Migrated to `sonarqube-scan-action@v4`
- [x] **Performance monitoring dashboard** - Real-time Core Web Vitals at `/admin/performance`

### Long-Term
- [ ] **AI cover letter generator** - Generate tailored cover letters
- [ ] **Interview scheduler** - Calendly integration
- [ ] **Live resume preview** - Real-time preview while editing in CMS

---

## 🛠️ Admin Dashboard Improvements

### Admin Hub & Navigation
- [x] **Shared admin layout** - Consistent header/sidebar across all admin pages
- [x] **Breadcrumb navigation** - Show context on subpages (Admin > Performance)
- [x] **Back to dashboard** link on all subpages
- [x] **Responsive sidebar** - Collapsible sidebar for mobile admin access
- [ ] **Dynamic stats** - Fetch real counts from Keystatic (blog posts, projects)
- [ ] **Activity feed** - Show recent content changes/updates

### Performance Dashboard Enhancements
- [ ] **Historical data** - Store and display performance trends over time
- [ ] **Page-specific metrics** - Select which page to measure
- [ ] **Export functionality** - Download metrics as JSON/CSV
- [ ] **Performance alerts** - Visual warning when metrics degrade
- [ ] **Comparison mode** - Compare current vs baseline metrics

### AI Assistant Improvements
- [ ] **Bulk analysis** - Analyze all experience/project items at once
- [ ] **Custom prompts** - Let users customize the AI suggestions
- [ ] **Copy to clipboard** - Easy copy of generated suggestions
- [ ] **Suggestion history** - Save and view previous suggestions
- [ ] **Apply suggestions** - One-click apply to Keystatic content

### Admin UX Enhancements
- [ ] **Admin search bar** - Quick search across all admin tools
- [ ] **Status indicators** - Show if services are running (Storybook, etc.)
- [ ] **Quick actions** - Common tasks accessible from dashboard
- [ ] **Keyboard shortcuts** - Power user navigation (Cmd+K, etc.)
- [ ] **Admin theme toggle** - Dark/light mode in admin header
