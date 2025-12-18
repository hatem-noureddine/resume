import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { FeatureFlagProvider, useFeatureFlags, Feature } from './FeatureFlags';

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('FeatureFlags', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
    });

    describe('FeatureFlagProvider', () => {
        it('provides default flags', () => {
            const result: { current: Record<string, boolean> } = { current: {} };

            function TestComponent() {
                const { flags } = useFeatureFlags();
                React.useEffect(() => {
                    result.current = flags;
                });
                return null;
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(result.current.chatbot).toBe(true);
            expect(result.current.darkMode).toBe(true);
        });

        it('merges initial flags with defaults', () => {
            const result: { current: Record<string, boolean> } = { current: {} };

            function TestComponent() {
                const { flags } = useFeatureFlags();
                React.useEffect(() => {
                    result.current = flags;
                });
                return null;
            }

            render(
                <FeatureFlagProvider initialFlags={{ customFlag: true }}>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(result.current.chatbot).toBe(true);
            expect(result.current.customFlag).toBe(true);
        });

        it('handles corrupted localStorage data gracefully', () => {
            // Set invalid JSON in localStorage
            mockLocalStorage.setItem('featureFlags', 'not valid json');

            const result: { current: Record<string, boolean> } = { current: {} };

            function TestComponent() {
                const { flags } = useFeatureFlags();
                React.useEffect(() => {
                    result.current = flags;
                });
                return null;
            }

            // Should not throw, should use defaults
            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            // Should still have default flags
            expect(result.current.chatbot).toBe(true);
        });

        it('loads flags from localStorage when available', () => {
            // Set valid JSON in localStorage
            mockLocalStorage.setItem('featureFlags', JSON.stringify({ comments: true }));

            const result = { isCommentsEnabled: false };

            function TestComponent() {
                const { isEnabled } = useFeatureFlags();
                React.useEffect(() => {
                    result.isCommentsEnabled = isEnabled('comments');
                });
                return null;
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            // Should merge localStorage flags
            expect(result.isCommentsEnabled).toBe(true);
        });

        it('returns false for unknown flags', () => {
            const result = { unknownFlagValue: true };

            function TestComponent() {
                const { isEnabled } = useFeatureFlags();
                React.useEffect(() => {
                    result.unknownFlagValue = isEnabled('unknownFlag');
                });
                return null;
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(result.unknownFlagValue).toBe(false);
        });
    });

    describe('useFeatureFlags', () => {
        it('returns fallback when outside provider', () => {
            const { result } = renderHook(() => useFeatureFlags());
            expect(result.current.isEnabled('chatbot')).toBe(true);
        });

        it('isEnabled returns correct value', () => {
            function TestComponent() {
                const { isEnabled } = useFeatureFlags();
                return (
                    <div>
                        <span data-testid="chatbot">{isEnabled('chatbot') ? 'yes' : 'no'}</span>
                        <span data-testid="comments">{isEnabled('comments') ? 'yes' : 'no'}</span>
                    </div>
                );
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(screen.getByTestId('chatbot')).toHaveTextContent('yes');
            expect(screen.getByTestId('comments')).toHaveTextContent('no');
        });

        it('setFlag updates flag value', () => {
            function TestComponent() {
                const { isEnabled, setFlag } = useFeatureFlags();
                return (
                    <div>
                        <span data-testid="flag">{isEnabled('comments') ? 'yes' : 'no'}</span>
                        <button onClick={() => setFlag('comments', true)}>Enable</button>
                    </div>
                );
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(screen.getByTestId('flag')).toHaveTextContent('no');

            act(() => {
                screen.getByRole('button').click();
            });

            expect(screen.getByTestId('flag')).toHaveTextContent('yes');
        });
    });

    describe('Feature component', () => {
        it('renders children when flag is enabled', () => {
            render(
                <FeatureFlagProvider>
                    <Feature flag="chatbot">
                        <div>Enabled Feature</div>
                    </Feature>
                </FeatureFlagProvider>
            );

            expect(screen.getByText('Enabled Feature')).toBeInTheDocument();
        });

        it('renders fallback when flag is disabled', () => {
            render(
                <FeatureFlagProvider>
                    <Feature flag="comments" fallback={<div>Coming Soon</div>}>
                        <div>Feature Content</div>
                    </Feature>
                </FeatureFlagProvider>
            );

            expect(screen.getByText('Coming Soon')).toBeInTheDocument();
            expect(screen.queryByText('Feature Content')).not.toBeInTheDocument();
        });

        it('renders nothing when disabled and no fallback', () => {
            render(
                <FeatureFlagProvider>
                    <Feature flag="comments">
                        <div>Feature Content</div>
                    </Feature>
                </FeatureFlagProvider>
            );

            expect(screen.queryByText('Feature Content')).not.toBeInTheDocument();
        });
    });
});
