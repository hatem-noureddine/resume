# Resume Portfolio - Feature Backlog

> Last updated: December 2024

## 🚀 High Priority

### User Experience Enhancements
- [x] **Dark/Light mode persistence** - Save theme preference to localStorage
- [x] **Smooth scroll-to-section** - Add animated scrolling for navigation links
- [x] **Loading skeleton components** - Add skeleton loaders for async content
- [x] **Page transition animations** - Smooth transitions between routes
- [x] **Scroll progress indicator** - Show reading progress bar at top

### Content & Personalization
- [x] **Dynamic resume data from CMS** - Integrate Keystatic for content management
- [x] **Multiple CV versions** - Support different resume layouts (detailed vs compact)
- [x] **Project case studies** - Detailed project pages with images and tech stack
- [x] **Testimonials section** - Add client/colleague testimonials with carousel
- [x] **Certifications showcase** - Display professional certifications with badges

### SEO & Performance
- [x] **Structured data (JSON-LD)** - Add schema markup for Person, Resume
- [x] **Open Graph images** - Dynamic OG images for social sharing
- [x] **Core Web Vitals optimization** - Improve LCP, FID, CLS scores
- [x] **Preload critical assets** - Fonts, hero images, above-fold content
- [x] **Service Worker caching** - Offline support for static content

---

## ⚡ Medium Priority

### Interactive Features
- [x] **Interactive timeline** - Clickable/filterable experience timeline
- [x] **Project filtering** - Filter by technology, year, or category
- [x] **Contact form with validation** - Real form submission (Formspree/EmailJS)
- [x] **Copy-to-clipboard** - Quick copy for email/phone
- [x] **QR code generation** - Generate QR code linking to resume

### Analytics & Insights
- [x] Resume download tracking
- [x] Section visibility tracking (`SectionTracker` component)
- [x] Chat analytics
- [x] QR Code interaction tracking
- [ ] **A/B testing support** - Test different layouts/content

### Unit Testing & Coverage
- [x] `SectionTracker` tests (100% component coverage)
- [x] `QRCodeModal` tests (100% component coverage)
- [x] Jest `fetch` polyfill and environment fixes
- [x] Global mocks for `@keystatic/core`, `@vercel/analytics`
- [ ] (Remaining) Integration-level tests for `App`, `Experience`, `Testimonials`, `Certifications`

### Accessibility Improvements
- [x] **Skip to content link** - Keyboard navigation shortcut
- [x] **High contrast mode** - Alternative color scheme option (WCAG AAA compliant)
- [x] **Font size controls** - Allow users to adjust text size (small/medium/large)
- [x] **Screen reader announcements** - Live regions for dynamic content (AnnouncerContext)
- [x] **Focus trap for modals** - Proper focus management (useFocusTrap hook)

### Developer Experience
- [ ] **Storybook documentation** - Component library with examples
- [ ] **E2E test coverage** - Playwright tests for critical flows
- [ ] **Visual regression tests** - Screenshot comparison testing
- [ ] **Bundle analyzer dashboard** - Size monitoring in CI
- [ ] **Lighthouse CI checks** - Performance gates in PR checks

---

## 🎨 Low Priority / Nice to Have

### Visual Enhancements
- [x] **Particle background** - Subtle interactive particle effect (ParticleBackground component)
- [x] **Cursor effects** - Custom cursor with hover trails (CustomCursor component)
- [ ] **3D elements** - Three.js integration for hero section
- [x] **Glassmorphism cards** - Modern glass-effect UI elements (GlassCard enhanced)
- [x] **Animated icons** - Lottie animations for all section icons (LottieAnimation + 12 animations)
- [x] **Gradient animations** - Moving gradient backgrounds (AnimatedBackground enhanced)
- [x] **Parallax scrolling** - Depth effect on scroll (ParallaxSection component)

### Social Features
- [x] **Social share buttons** - Share profile on social media
- [x] **LinkedIn sync** - Auto-import from LinkedIn profile
- [x] **GitHub activity widget** - Show recent commits/contributions (GitHubActivity component)
- [x] **Blog RSS feed** - Syndicate blog content (/feed.xml)
- [x] **Newsletter signup** - Mailchimp/ConvertKit/Local API integration

### Internationalization
- [x] **Additional languages** - English, French, Spanish support
- [x] **RTL layout support** - Right-to-left for Arabic
- [x] **Auto-detect locale** - Browser language detection (via middleware/hook)
- [x] **Language-specific formatting** - Dates, numbers, etc.

### Advanced Features
- [x] **PWA support** - Installable web app with manifest (PWAInstallPrompt component)
- [x] **Voice navigation** - Web Speech API commands (VoiceNavigation component)
- [ ] **AI resume suggestions** - Content improvement recommendations

---

## ✅ Completed

### Code Quality (Dec 2024)
- [x] Type safety improvements - strict locale types, no `any`
- [x] Shared test utilities - `test/utils.tsx`
- [x] Centralized animation system - `lib/animations.ts`
- [x] API abstraction layer - `lib/api.ts`
- [x] Barrel exports for all modules

### Accessibility (Dec 2024)
- [x] Keyboard support for interactive elements
- [x] ARIA roles and labels
- [x] Focus states and indicators
- [x] Reduced motion support
- [x] One-click Copy-to-Clipboard utility
- [x] Professional skills visibility animations
- [x] One-click Copy-to-Clipboard for contact details
- [x] Fixed syntax errors in production components

### Performance (Dec 2024)
- [x] Lazy-loaded Lottie animations
- [x] Optimized image loading
- [x] Bundle size monitoring

### Bug Fixes (Dec 2024)
- [x] Professional skills visibility (animation variant fix)
- [x] AnimatedCounter test stability (CI memory issues)
- [x] Removed tracked gitignored files from remote

---

## 📋 Technical Debt

| Issue | Priority | Status |
|-------|----------|--------|
| Add error boundaries | Medium | ✅ Done |
| Migrate to React 19 features | Low | ⏳ Pending |
| Add retry logic to API calls | Medium | ✅ Done |
| Optimize bundle splitting | Medium | ⏳ Pending |
| Add request caching | Low | ⏳ Pending |

---

## 💡 Ideas for Future Consideration

- **AR Business Card** - Augmented reality experience with camera
- **Voice-controlled navigation** - "Show me your projects"
- **AI cover letter generator** - Generate tailored cover letters
- **Interview scheduler** - Calendly integration
- **Skills assessment quiz** - Interactive tech knowledge test
- **Collaborative resume builder** - Multi-user editing for teams
