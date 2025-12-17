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
            let flags: Record<string, boolean> = {};

            function TestComponent() {
                const { flags: f } = useFeatureFlags();
                flags = f;
                return null;
            }

            render(
                <FeatureFlagProvider>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(flags.chatbot).toBe(true);
            expect(flags.darkMode).toBe(true);
        });

        it('merges initial flags with defaults', () => {
            let flags: Record<string, boolean> = {};

            function TestComponent() {
                const { flags: f } = useFeatureFlags();
                flags = f;
                return null;
            }

            render(
                <FeatureFlagProvider initialFlags={{ customFlag: true }}>
                    <TestComponent />
                </FeatureFlagProvider>
            );

            expect(flags.chatbot).toBe(true);
            expect(flags.customFlag).toBe(true);
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
