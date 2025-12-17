# Component Documentation

This document describes the reusable UI components available in this project.

## Installation

All components are located in `src/components/ui/` and can be imported directly:

```tsx
import { Button, ContactForm, Modal, Tooltip } from '@/components/ui';
```

---

## Form Components

### Input

Accessible input field with label, error, and helper text support.

```tsx
import { Input } from '@/components/ui/FormField';

<Input
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Label text |
| `error` | string | - | Error message |
| `helperText` | string | - | Helper text |
| `...` | InputHTMLAttributes | - | All native input props |

### Textarea

Accessible textarea with same features as Input.

```tsx
import { Textarea } from '@/components/ui/FormField';

<Textarea
  label="Message"
  name="message"
  rows={5}
  error={errors.message}
  required
/>
```

### ContactForm

Complete contact form with Formspree integration.

```tsx
import { ContactForm } from '@/components/ui/ContactForm';

// With Formspree
<ContactForm formspreeId="your-form-id" />

// With custom handler
<ContactForm onSubmit={async (data) => {
  await sendEmail(data);
}} />
```

---

## Overlay Components

### Modal

Accessible modal with focus trap and keyboard support.

```tsx
import { Modal } from '@/components/ui/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Settings"
  size="md"
>
  <p>Modal content here</p>
</Modal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Controls visibility |
| `onClose` | () => void | - | Close handler |
| `title` | string | - | Modal title |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | Modal width |
| `closeOnOverlayClick` | boolean | true | Close on backdrop click |
| `showCloseButton` | boolean | true | Show X button |

### Tooltip

Accessible tooltip with auto-positioning.

```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Helpful information" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | ReactNode | - | Tooltip content |
| `position` | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | Preferred position |
| `delay` | number | 200 | Show delay in ms |

---

## Hover Effects

### HoverCard

Card wrapper with hover animations.

```tsx
import { HoverCard } from '@/components/ui/HoverEffects';

<HoverCard glow scale={1.02} lift={-4}>
  <div className="p-4">Card content</div>
</HoverCard>
```

### HoverButton

Button with hover effects and shine animation.

```tsx
import { HoverButton } from '@/components/ui/HoverEffects';

<HoverButton variant="primary" onClick={handleClick}>
  Click me
</HoverButton>
```

### HoverLink

Link with animated underline on hover.

```tsx
import { HoverLink } from '@/components/ui/HoverEffects';

<HoverLink href="/about" underline>
  About Us
</HoverLink>
```

### HoverIcon

Icon wrapper with rotation and scale effects.

```tsx
import { HoverIcon } from '@/components/ui/HoverEffects';

<HoverIcon rotate={15} scale={1.1}>
  <Settings className="w-5 h-5" />
</HoverIcon>
```

---

## Loading Components

### Skeleton

Animated skeleton loader for content placeholders.

```tsx
import { Skeleton, ImageWithSkeleton } from '@/components/ui/Skeleton';

<Skeleton className="w-full h-4" variant="text" />
<Skeleton width={200} height={200} variant="box" />
<Skeleton variant="circle" width={48} height={48} />

// Image with loading skeleton
<ImageWithSkeleton src="/image.jpg" alt="Description" width={300} height={200} />
```

---

## Other Components

### Button

Primary button component with variants.

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="default" size="lg">
  Primary Button
</Button>
```

### ErrorBoundary

Error boundary with fallback UI.

```tsx
import { ErrorBoundary, withErrorBoundary } from '@/components/ui/ErrorBoundary';

<ErrorBoundary fallback={<ErrorMessage />}>
  <ChildComponent />
</ErrorBoundary>

// Or as HOC
const SafeComponent = withErrorBoundary(MyComponent, <ErrorFallback />);
```

### ScrollProgress

Reading progress indicator for blog posts.

```tsx
import { ScrollProgress } from '@/components/ui/ScrollProgress';

<ScrollProgress />
```

### ShareButtons

Social share buttons for blog posts.

```tsx
import { ShareButtons } from '@/components/ui/ShareButtons';

<ShareButtons url={postUrl} title={postTitle} />
```

### BookmarkButton

Bookmark button for saving posts.

```tsx
import { BookmarkButton } from '@/components/ui/BookmarkButton';

<BookmarkButton postSlug={slug} postTitle={title} />
```

---

## Best Practices

1. **Always provide labels** for form fields for accessibility
2. **Use semantic variants** (primary, secondary) for buttons
3. **Handle loading states** with Skeleton components
4. **Wrap risky components** with ErrorBoundary
5. **Test keyboard navigation** for interactive components
