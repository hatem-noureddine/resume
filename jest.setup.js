import '@testing-library/jest-dom'
import React from 'react';

import { TextEncoder, TextDecoder } from 'node:util';

Object.assign(globalThis, {
    TextDecoder,
    TextEncoder,
});

// Polyfill fetch if not present (jsdom doesn't include it by default)
if (!globalThis.fetch) {
    globalThis.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve(""),
            blob: () => Promise.resolve(new Blob()),
        })
    );
    globalThis.Request = jest.fn();
    globalThis.Response = jest.fn();
    globalThis.Headers = jest.fn();
}

if (globalThis.window !== undefined) {
    // Mock window.matchMedia for reduced motion hook
    Object.defineProperty(globalThis, 'matchMedia', {
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
    globalThis.IntersectionObserver = class {
        constructor() {
            this.observe = jest.fn();
            this.unobserve = jest.fn();
            this.disconnect = jest.fn();
        }
    };

    // Mock ResizeObserver
    globalThis.ResizeObserver = class {
        constructor() {
            this.observe = jest.fn();
            this.unobserve = jest.fn();
            this.disconnect = jest.fn();
        }
    };
}

// -----------------------------------------------------------------------------
// Global Mocks to suppress console errors from libraries in tests
// -----------------------------------------------------------------------------

// Mock next/image
jest.mock('next/image', () => {
    const MockImage = (props) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fill, priority, placeholder, blurDataURL, overrideSrc, ...rest } = props;
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...rest} />;
    };
    MockImage.displayName = 'NextImage';
    return {
        __esModule: true,
        default: MockImage,
    };
});

// Mock framer-motion
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    const MockAnimatePresence = ({ children }) => <>{children}</>;
    MockAnimatePresence.displayName = 'AnimatePresence';

    return {
        ...actual,
        AnimatePresence: MockAnimatePresence,
        motion: new Proxy({}, {
            get: (target, prop) => {
                const MotionComponent = React.forwardRef((props, ref) => {
                    /* eslint-disable @typescript-eslint/no-unused-vars */
                    // Destructure and discard Framer Motion specific props to avoid DOM warnings
                    const {
                        layout,
                        initial,
                        animate,
                        exit,
                        whileInView,
                        viewport,
                        transition,
                        variants,
                        whileHover,
                        whileTap,
                        ...rest
                    } = props;
                    /* eslint-enable @typescript-eslint/no-unused-vars */
                    return React.createElement(prop, { ref, ...rest });
                });
                MotionComponent.displayName = `motion.${prop}`;
                return MotionComponent;
            }
        }),
    };
});

// Mock Vercel Analytics
jest.mock('@vercel/analytics', () => ({
    track: jest.fn(),
}));
jest.mock('@vercel/analytics/react', () => ({
    Analytics: () => null,
}));
jest.mock('@vercel/analytics/next', () => ({
    Analytics: () => null,
}));
jest.mock('@vercel/speed-insights', () => ({
    track: jest.fn(),
}));
jest.mock('@vercel/speed-insights/next', () => ({
    SpeedInsights: () => null,
}));

// Mock Giscus
jest.mock('@giscus/react', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="giscus-mock" />,
    };
});

// Mock markdown libraries
jest.mock('react-markdown', () => {
    return {
        __esModule: true,
        default: ({ children }) => <>{children}</>,
    };
});

jest.mock('remark-gfm', () => () => { });

// Mock lottie-react (requires canvas which isn't available in jsdom)
jest.mock('lottie-react', () => {
    return {
        __esModule: true,
        default: ({ animationData, loop, autoplay, style, className, ...rest }) => (
            <div
                data-testid="lottie-animation"
                data-animation-name={animationData?.nm || 'unknown'}
                data-loop={loop}
                data-autoplay={autoplay}
                style={style}
                className={className}
                {...rest}
            />
        ),
    };
});
// Mock SectionTracker - default to pass through children
jest.mock('@/components/ui/SectionTracker', () => ({
    SectionTracker: ({ children }) => <>{children}</>,
}));

// Mock Keystatic
jest.mock('@keystatic/core', () => ({
    config: jest.fn().mockReturnValue({}),
    collection: jest.fn(),
    singleton: jest.fn(),
    fields: new Proxy({}, {
        get: () => jest.fn().mockReturnValue({}),
    }),
}));
jest.mock('@keystatic/core/reader', () => ({
    createReader: () => ({
        collections: {
            posts: {
                all: jest.fn().mockResolvedValue([]),
                read: jest.fn().mockResolvedValue(null),
            },
            portfolio: {
                all: jest.fn().mockResolvedValue([]),
                read: jest.fn().mockResolvedValue(null),
            },
        },
        singletons: {
            resume: {
                read: jest.fn().mockResolvedValue(null),
            },
        },
    }),
}));

// Mock @/lib/keystatic to avoid Keystatic integration in tests
jest.mock('@/lib/keystatic', () => ({
    getResumes: jest.fn().mockResolvedValue([]),
    getPortfolioProjects: jest.fn().mockResolvedValue([]),
    getPosts: jest.fn().mockResolvedValue([]),
    getCertifications: jest.fn().mockResolvedValue([]),
    getExperiences: jest.fn().mockResolvedValue([]),
    getLanguages: jest.fn().mockResolvedValue([]),
    getBlogPosts: jest.fn().mockResolvedValue([]),
    getProjects: jest.fn().mockResolvedValue([]),
    getExperience: jest.fn().mockResolvedValue([]),
    getSkills: jest.fn().mockResolvedValue([]),
    getServices: jest.fn().mockResolvedValue([]),
    getTestimonials: jest.fn().mockResolvedValue([]),
    reader: {
        collections: {
            posts: { all: jest.fn().mockResolvedValue([]) },
            portfolio: { all: jest.fn().mockResolvedValue([]) },
        },
        singletons: { resume: { read: jest.fn().mockResolvedValue(null) } },
    },
}));

// Mock @/context/AnnouncerContext to provide useAnnouncer without provider
jest.mock('@/context/AnnouncerContext', () => ({
    useAnnouncer: () => ({
        announce: jest.fn(),
    }),
    AnnouncerProvider: ({ children }) => children,
}));
