'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface FeatureFlags {
    [key: string]: boolean;
}

interface FeatureFlagContextType {
    flags: FeatureFlags;
    isEnabled: (flag: string) => boolean;
    setFlag: (flag: string, enabled: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Default feature flags
const DEFAULT_FLAGS: FeatureFlags = {
    chatbot: true,
    newsletter: true,
    darkMode: true,
    animations: true,
    comments: false, // Giscus integration pending
    analytics: true,
    pwa: true,
    projects: false, // Projects section - enable when ready
};

interface FeatureFlagProviderProps {
    children: ReactNode;
    initialFlags?: FeatureFlags;
}

/**
 * Feature flag provider for conditional feature rendering.
 * 
 * Usage:
 * ```tsx
 * // In layout.tsx
 * <FeatureFlagProvider>
 *   <App />
 * </FeatureFlagProvider>
 * ```
 */
export function FeatureFlagProvider({
    children,
    initialFlags = {},
}: FeatureFlagProviderProps) {
    const [flags, setFlags] = useState<FeatureFlags>({
        ...DEFAULT_FLAGS,
        ...initialFlags,
    });

    // Load flags from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('featureFlags');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading persisted state on mount
                setFlags(prev => ({ ...prev, ...parsed }));
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    const isEnabled = (flag: string): boolean => {
        return flags[flag] ?? false;
    };

    const setFlag = (flag: string, enabled: boolean): void => {
        setFlags(prev => {
            const newFlags = { ...prev, [flag]: enabled };
            localStorage.setItem('featureFlags', JSON.stringify(newFlags));
            return newFlags;
        });
    };

    return (
        <FeatureFlagContext.Provider value={{ flags, isEnabled, setFlag }}>
            {children}
        </FeatureFlagContext.Provider>
    );
}

/**
 * Hook to access feature flags.
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { isEnabled } = useFeatureFlags();
 *   
 *   if (!isEnabled('chatbot')) return null;
 *   return <ChatWidget />;
 * }
 * ```
 */
export function useFeatureFlags(): FeatureFlagContextType {
    const context = useContext(FeatureFlagContext);
    if (!context) {
        // Return a fallback for components outside provider
        return {
            flags: DEFAULT_FLAGS,
            isEnabled: (flag: string) => DEFAULT_FLAGS[flag] ?? false,
            setFlag: () => { },
        };
    }
    return context;
}

interface FeatureProps {
    flag: string;
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Conditional rendering component based on feature flag.
 * 
 * Usage:
 * ```tsx
 * <Feature flag="chatbot" fallback={<ComingSoon />}>
 *   <ChatWidget />
 * </Feature>
 * ```
 */
export function Feature({ flag, children, fallback = null }: FeatureProps) {
    const { isEnabled } = useFeatureFlags();
    return isEnabled(flag) ? <>{children}</> : <>{fallback}</>;
}
