# Changelog

[← Back to Home](Home)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-15
 
### Added
- **RSL Standard**: Implemented Responsible Source Licensing with `license.xml` and `robots.txt`
- **Hooks**: Added `usePrefersReducedMotion` for safe, accessible animations

### Fixed
- **CI Pipeline**: Resolved "setState in effect" ESLint errors across multiple components
- **CI Pipeline**: Fixed 50-minute hang in E2E tests by explicitly capturing `serve` dependency
- **Components**: Fixed import structure in `Skeleton.tsx` and logic in `AnimatedCounter.tsx`

## [1.0.0] - 2024-12-15

### Added
- **SEO Enhancements**
  - Dynamic sitemap generation (`/sitemap.xml`)
  - JSON-LD structured data (Person schema)
  - Open Graph and Twitter meta tags
  - Canonical URL support

- **Testing**
  - Comprehensive unit tests (81 tests, 18 suites)
  - E2E tests for all major features
  - Accessibility testing with axe-core
  - Lighthouse CI integration

- **Documentation**
  - `CONTRIBUTING.md` - Contribution guidelines
  - `CHANGELOG.md` - Release history
  - `TECHNICAL.md` - Architecture documentation
  - `DEPLOYMENT.md` - Deployment guide

- **CI/CD**
  - Consolidated CI workflow with lint, test, and E2E stages
  - Test coverage reporting
  - Lighthouse performance reports

### Changed
- Renamed project to `hatem-noureddine-portfolio`
- Simplified npm scripts with unified `verify` command

## [0.1.0] - 2024-11-01

### Added
- Initial portfolio website
- Multi-language support (EN, FR, ES)
- Dark/Light theme toggle
- Responsive design
- Blog section with Markdown support
- Portfolio showcase
- Contact form

## Related Docs

- [Roadmap](Roadmap) - Future plans
- [Contributing](Contributing) - How to contribute
