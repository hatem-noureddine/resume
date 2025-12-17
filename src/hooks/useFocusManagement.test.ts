import { renderHook } from '@testing-library/react';
import { useFocusTrap, useKeyboardNavigation, useSkipLink } from './useFocusManagement';

describe('useFocusManagement', () => {
    describe('useFocusTrap', () => {
        it('returns a ref object', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(true));
            expect(result.current).toHaveProperty('current');
        });

        it('returns ref with null current initially', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(true));
            expect(result.current.current).toBeNull();
        });

        it('can be inactive', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(false));
            expect(result.current).toBeDefined();
        });
    });

    describe('useKeyboardNavigation', () => {
        it('returns navigation utilities', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            expect(result.current).toHaveProperty('focusedIndex');
            expect(result.current).toHaveProperty('setFocusedIndex');
            expect(result.current).toHaveProperty('handleKeyDown');
            expect(result.current).toHaveProperty('getItemProps');
        });

        it('starts at index 0', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            expect(result.current.focusedIndex).toBe(0);
        });

        it('getItemProps returns correct props for focused item', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(0);

            expect(props.tabIndex).toBe(0);
            expect(props['aria-selected']).toBe(true);
        });

        it('getItemProps returns tabIndex -1 for non-focused items', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(1);

            expect(props.tabIndex).toBe(-1);
            expect(props['aria-selected']).toBe(false);
        });

        it('accepts wrap option', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation(5, { wrap: false })
            );
            expect(result.current.focusedIndex).toBe(0);
        });

        it('accepts orientation option', () => {
            const { result } = renderHook(() =>
                useKeyboardNavigation(5, { orientation: 'horizontal' })
            );
            expect(result.current.focusedIndex).toBe(0);
        });

        it('accepts onSelect callback', () => {
            const onSelect = jest.fn();
            const { result } = renderHook(() =>
                useKeyboardNavigation(5, { onSelect })
            );
            expect(result.current.handleKeyDown).toBeDefined();
        });
    });

    describe('useSkipLink', () => {
        it('returns a ref object', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current).toHaveProperty('current');
        });

        it('ref is null initially', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current.current).toBeNull();
        });
    });
});
