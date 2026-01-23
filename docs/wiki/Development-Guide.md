# Development Guide

[← Back to Home](Home)

This guide covers development workflows, coding standards, and best practices.

## Development Workflow

### Branch Strategy

```
main          # Production-ready code
├── feature/* # New features
├── fix/*     # Bug fixes
└── docs/*    # Documentation updates
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new portfolio filter
fix: resolve language switching bug
docs: update API documentation
chore: update dependencies
test: add unit tests for Skills component
```

## Coding Standards

### TypeScript

- Strict mode enabled
- Explicit return types for functions
- Use interfaces over types where possible

```typescript
// ✅ Good
interface Project {
    id: string;
    title: string;
    category: string;
}

// ✅ Good - explicit return type
function getProjects(): Project[] {
    return [...];
}
```

### React Components

- Use functional components with hooks
- Props must be `Readonly<>`
- Use named exports

```tsx
// ✅ Good
interface ButtonProps {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: Readonly<ButtonProps>) {
    return <button className={variant}>{children}</button>;
}
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx` |
| Hooks | camelCase with `use` prefix | `useChat.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Tests | Same name + `.test` | `Button.test.tsx` |

## Testing

### Unit Tests (Jest)

```bash
npm run test              # Run all tests
npm run test:coverage     # With coverage report
npm run test -- --watch   # Watch mode
```

### E2E Tests (Playwright)

```bash
npm run test:e2e          # Run E2E tests
npx playwright test --ui  # Interactive mode
```

### Test Structure

```typescript
describe('ComponentName', () => {
    it('renders correctly', () => {
        render(<Component />);
        expect(screen.getByText('...')).toBeInTheDocument();
    });
});
```

## Linting

```bash
npm run lint              # Run ESLint
npm run lint -- --fix     # Auto-fix issues
```

### ESLint Rules

- `react-hooks/rules-of-hooks` - Enforce hooks rules
- `@typescript-eslint/no-explicit-any` - Avoid `any` type
- `react/display-name` - Components need display names

## Pre-commit Hooks

Husky + lint-staged runs on every commit:

1. ESLint with auto-fix
2. Prettier formatting
3. TypeScript type checking

## Storybook

```bash
npm run storybook         # Start on port 6006
```

Useful for developing components in isolation.

## Related Docs

- [Components](Components) - Component library
- [Animation Guidelines](Animation-Guidelines) - Motion patterns
- [API Reference](API-Reference) - API endpoints
