/**
 * Hooks barrel export
 */

// Data hooks
export { useBookmarks } from './useBookmarks';
export { useChat } from './useChat';
export { useRating } from './useRating';

// UI/Animation hooks
export { usePrefersReducedMotion } from './usePrefersReducedMotion';
export { useKeyboardNavigation, useFocusTrap, useSkipLink } from './useFocusManagement';

// PWA hooks
export { useServiceWorker } from './useServiceWorker';
