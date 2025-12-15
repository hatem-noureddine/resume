import '@testing-library/jest-dom'

// Mock window.matchMedia for reduced motion hook
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false, // Default: no reduced motion preference
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
class IntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserver,
});
