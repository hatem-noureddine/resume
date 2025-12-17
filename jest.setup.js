import '@testing-library/jest-dom'
import React from 'react';

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

if (typeof window !== 'undefined') {
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
}

// -----------------------------------------------------------------------------
// Global Mocks to suppress console errors from libraries in tests
// -----------------------------------------------------------------------------

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fill, priority, placeholder, blurDataURL, overrideSrc, ...rest } = props;
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...rest} />;
    },
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,

        AnimatePresence: ({ children }) => <>{children}</>,
        motion: new Proxy({}, {
            get: (target, prop) => {
                // eslint-disable-next-line react/display-name
                return React.forwardRef((props, ref) => {
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
            }
        }),
    };
});

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react', () => ({
    Analytics: () => null,
}));
jest.mock('@vercel/analytics/next', () => ({
    Analytics: () => null,
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
