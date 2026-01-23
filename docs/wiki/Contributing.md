# Contributing

[← Back to Home](Home)

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/resume.git
   cd resume
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
```

### Code Quality

Before submitting a PR, ensure your code passes all checks:

```bash
npm run verify:quick   # Quick check (lint, test, build)
npm run verify         # Full verification (includes E2E)
```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define types explicitly, avoid `any`
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Props must be `Readonly<>`

### CSS
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new skill section
fix: correct mobile menu z-index
docs: update README
test: add Hero component tests
chore: update dependencies
```

## Pull Request Process

1. **Update tests** - Add/update tests for your changes
2. **Update documentation** - If applicable
3. **Run full verification** - `npm run verify:quick`
4. **Create PR** with clear description
5. **Address review feedback**

## Reporting Issues

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

## Related Docs

- [Development Guide](Development-Guide) - Coding standards
- [Getting Started](Getting-Started) - Local setup
