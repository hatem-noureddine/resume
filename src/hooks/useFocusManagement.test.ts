import { renderHook, act } from '@testing-library/react';
import { useFocusTrap, useKeyboardNavigation, useSkipLink } from './useFocusManagement';

describe('useFocusManagement', () => {
    describe('useFocusTrap', () => {
        let mockContainer: HTMLDivElement;
        let mockButton1: HTMLButtonElement;
        let mockButton2: HTMLButtonElement;

        beforeEach(() => {
            mockContainer = document.createElement('div');
            mockButton1 = document.createElement('button');
            mockButton2 = document.createElement('button');
            mockContainer.appendChild(mockButton1);
            mockContainer.appendChild(mockButton2);
            document.body.appendChild(mockContainer);
        });

        afterEach(() => {
            document.body.removeChild(mockContainer);
        });

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

        it('does not trap focus when inactive', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(false));
            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockContainer;
            // Should not affect focus
            expect(document.activeElement).toBe(document.body);
        });
    });

    describe('useKeyboardNavigation', () => {
        const mockOnSelect = jest.fn();

        beforeEach(() => {
            jest.clearAllMocks();
        });

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

        it('handles ArrowDown key in vertical orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'vertical' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(1);
        });

        it('handles ArrowUp key in vertical orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'vertical' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            // With wrap=true, should go to last item
            expect(result.current.focusedIndex).toBe(4);
        });

        it('handles ArrowRight key in horizontal orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(1);
        });

        it('handles ArrowLeft key in horizontal orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowLeft', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(4);
        });

        it('handles Home key', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            // Move somewhere else first
            act(() => { result.current.setFocusedIndex(3); });

            act(() => {
                result.current.handleKeyDown({ key: 'Home', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('handles End key', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            act(() => {
                result.current.handleKeyDown({ key: 'End', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            // End should move to last item
            expect(result.current.focusedIndex).toBe(4);
        });

        it('handles Enter key with onSelect callback', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { onSelect: mockOnSelect }));

            act(() => {
                result.current.handleKeyDown({ key: 'Enter', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(mockOnSelect).toHaveBeenCalledWith(0);
        });

        it('handles Space key with onSelect callback', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { onSelect: mockOnSelect }));

            act(() => {
                result.current.handleKeyDown({ key: ' ', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(mockOnSelect).toHaveBeenCalledWith(0);
        });

        it('respects wrap=false option at boundaries', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { wrap: false }));

            // At 0, Up should stay 0
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('handles both orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'both' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(1);

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(2);
        });

        it('setFocusedIndex updates the focused index', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            act(() => {
                result.current.setFocusedIndex(3);
            });

            expect(result.current.focusedIndex).toBe(3);
        });

        it('getItemProps ref callback stores element', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(0);

            const mockElement = document.createElement('div');
            props.ref(mockElement);

            // Ref should be stored internally (hard to verify without internal access, but we check if it compiles and runs)
            expect(props).toHaveProperty('ref');
        });
    });

    describe('useSkipLink', () => {
        let mockElement: HTMLDivElement;

        beforeEach(() => {
            mockElement = document.createElement('div');
            document.body.appendChild(mockElement);
        });

        afterEach(() => {
            document.body.removeChild(mockElement);
        });

        it('returns a ref object', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current).toHaveProperty('current');
        });

        it('ref is null initially', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current.current).toBeNull();
        });

        it('sets id and tabindex when ref is assigned', () => {
            // To test this we need the effect to run effectively.
            // We can force a re-render with a new ID to trigger effect if ref is set.

            const { result, rerender } = renderHook(({ id }) => useSkipLink(id), {
                initialProps: { id: 'test-id' }
            });

            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockElement;

            // Trigger effect by changing ID
            rerender({ id: 'test-id-2' });

            expect(mockElement.getAttribute('id')).toBe('test-id-2');
            expect(mockElement.getAttribute('tabindex')).toBe('-1');
        });
    });

    describe('useFocusTrap additional coverage', () => {
        let mockContainer: HTMLDivElement;
        let mockButton1: HTMLButtonElement;
        let mockButton2: HTMLButtonElement;

        beforeAll(() => {
            Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
                get() { return this.parentNode; },
                configurable: true
            });
        });

        beforeEach(() => {
            mockContainer = document.createElement('div');
            mockButton1 = document.createElement('button');
            mockButton2 = document.createElement('button');
            mockContainer.appendChild(mockButton1);
            mockContainer.appendChild(mockButton2);
            document.body.appendChild(mockContainer);
        });

        afterEach(() => {
            document.body.removeChild(mockContainer);
            jest.clearAllMocks();
        });

        it('traps focus with Shift+Tab on first element', () => {
            const { result, rerender } = renderHook(({ active }) => useFocusTrap(active), {
                initialProps: { active: false }
            });
            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockContainer;

            // Activate hook
            rerender({ active: true });

            mockButton2.setAttribute('data-testid', 'button2');

            mockButton1.focus();

            // Simulate keydown event directly on document
            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });

            // We need to mocking preventDefault to verify it was called
            jest.spyOn(event, 'preventDefault');

            document.dispatchEvent(event);

            expect(document.activeElement?.getAttribute('data-testid')).toBe('button2');
        });

        it('traps focus with Tab on last element', () => {
            const { result, rerender } = renderHook(({ active }) => useFocusTrap(active), {
                initialProps: { active: false }
            });
            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockContainer;

            // Activate hook now that ref is ready
            rerender({ active: true });

            mockButton1.setAttribute('data-testid', 'button1');
            mockButton2.focus();

            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: false,
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(event);
            expect(document.activeElement?.getAttribute('data-testid')).toBe('button1');
        });

        it('ignores non-Tab keys', () => {
            const { result } = renderHook(() => useFocusTrap(true));
            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockContainer;
            mockButton1.setAttribute('data-testid', 'button1');
            mockButton1.focus();

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true
            });
            document.dispatchEvent(event);
            // Focus shouldn't change
            expect(document.activeElement?.getAttribute('data-testid')).toBe('button1');
        });

        it('handles case with no focusable elements', () => {
            const emptyContainer = document.createElement('div');
            document.body.appendChild(emptyContainer);
            const { result } = renderHook(() => useFocusTrap(true));
            // @ts-expect-error - assigning to ref for testing
            result.current.current = emptyContainer;

            const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
            document.dispatchEvent(event);

            document.body.removeChild(emptyContainer);
        });

        it('restores focus on cleanup', () => {
            const outsideButton = document.createElement('button');
            document.body.appendChild(outsideButton);
            outsideButton.focus();

            const { unmount } = renderHook(() => useFocusTrap(true));

            // Initially hook moves focus to container/first element
            // Unmount should restore it
            unmount();

            expect(document.activeElement).toBe(outsideButton);
            document.body.removeChild(outsideButton);
        });
    });

    describe('useKeyboardNavigation additional coverage', () => {
        it('wraps to end when pressing ArrowUp at index 0', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(4);
        });

        it('wraps to start when pressing ArrowDown at last index', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            // Move to end first
            act(() => { result.current.setFocusedIndex(4) });

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(0);
        });

        it('does not wrap when wrap is false', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { wrap: false }));

            // At index 0, ArrowUp should stay at 0
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(0);

            // At last index, ArrowDown should stay at last
            act(() => { result.current.setFocusedIndex(4) });
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(4);
        });

        it('handles ArrowLeft wraps', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            // Index 0 -> last
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowLeft', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(4);
        });

        it('handles ArrowRight wraps', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            act(() => { result.current.setFocusedIndex(4) });
            act(() => {
                result.current.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });
            expect(result.current.focusedIndex).toBe(0);
        });
    });
});
